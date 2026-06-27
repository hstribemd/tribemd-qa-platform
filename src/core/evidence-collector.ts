import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Page, Locator, Browser } from '@playwright/test';
import { DefectCollector } from './defect-collector.js';
import type { Defect, EvidenceFiles } from './types.js';

export interface RawDefectInput extends Omit<Defect, 'id' | 'timestamp' | 'evidence'> {
  locator?: Locator;
}

/**
 * Captura o pacote completo de evidências e registra o defeito.
 *
 * Quando `browser` é fornecido, cada bug recebe seu próprio vídeo isolado:
 * um contexto separado navega à origem, depois ao URL com erro, grava APENAS
 * esse trajeto e fecha. O vídeo mostra exatamente o momento do erro.
 *
 * Layout final de cada pasta:
 *   /evidencias/BUG-001/
 *       urls.txt              <- link exato do erro + origem (referência rápida)
 *       screenshot.png        <- estado da página no momento do erro
 *       screenshot-highlight.png  (apenas quando locator é informado)
 *       execution.webm        <- vídeo exclusivo deste bug
 *       page.html             <- HTML capturado no fallback
 *       defect.json
 *       console.log
 */
export class EvidenceCollector {
  static async capture(
    page: Page | undefined,
    input: RawDefectInput,
    consoleLogs: string[] = [],
    browser?: Browser,
  ): Promise<Defect> {
    const collector = DefectCollector.get();
    const { id, dir } = await collector.createFolder();
    const evidence: EvidenceFiles = {};

    // urls.txt — referência humana rápida com o link exato do erro
    if (input.url) {
      const lines: string[] = [
        `ERRO:   ${input.url}`,
        ...(input.sourceUrl ? [`ORIGEM: ${input.sourceUrl}`] : []),
        `TITULO: ${input.title}`,
      ];
      const urlsPath = path.join(dir, 'urls.txt');
      await fs.writeFile(urlsPath, lines.join('\n') + '\n', 'utf-8');
      evidence.urls = path.relative(process.cwd(), urlsPath);
    }

    if (browser && input.url) {
      // Reprodução isolada: contexto dedicado navega do source ao error URL,
      // captura screenshot e vídeo mostrando SÓ o momento do erro.
      let storageState: { cookies: unknown[]; origins: unknown[] } | undefined;
      if (page) {
        try {
          storageState = await page.context().storageState() as { cookies: unknown[]; origins: unknown[] };
        } catch { /* continua sem autenticação */ }
      }
      const srcUrl = input.sourceUrl ?? input.url;
      const reproduced = await EvidenceCollector.reproduceAndRecord(
        browser,
        srcUrl,
        input.url,
        dir,
        storageState,
      );
      if (reproduced.screenshot) evidence.screenshot = reproduced.screenshot;
      if (reproduced.video) evidence.video = reproduced.video;
    } else if (page) {
      // Fallback: screenshot da página atual + vídeo via reconcileVideos()
      try {
        const shot = path.join(dir, 'screenshot.png');
        await page.screenshot({ path: shot, fullPage: true });
        evidence.screenshot = path.relative(process.cwd(), shot);
      } catch { /* página pode ter fechado */ }

      if (input.locator) {
        try {
          await input.locator.evaluate((el) => {
            const e = el as HTMLElement;
            e.style.outline = '4px solid #ff1744';
            e.style.outlineOffset = '2px';
            e.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior });
          });
          const hl = path.join(dir, 'screenshot-highlight.png');
          await page.screenshot({ path: hl, fullPage: false });
          evidence.screenshotHighlight = path.relative(process.cwd(), hl);
        } catch { /* elemento pode não existir mais */ }
      }

      try {
        const htmlPath = path.join(dir, 'page.html');
        await fs.writeFile(htmlPath, await page.content(), 'utf-8');
        evidence.html = path.relative(process.cwd(), htmlPath);
      } catch { /* ignore */ }

      try {
        const video = page.video();
        if (video) {
          EvidenceCollector.pendingVideos.push({ page, dir });
        }
      } catch { /* ignore */ }
    }

    if (consoleLogs.length) {
      const logPath = path.join(dir, 'console.log');
      await fs.writeFile(logPath, consoleLogs.join('\n'), 'utf-8');
      evidence.logs = path.relative(process.cwd(), logPath);
    }

    const { locator: _omit, ...rest } = input;
    const defect: Defect = {
      ...rest,
      id,
      timestamp: new Date().toISOString(),
      evidence,
    };

    await collector.persist(defect, dir);
    return defect;
  }

  /**
   * Abre um contexto isolado, navega à origem e depois ao URL com erro,
   * captura screenshot e vídeo, fecha o contexto. Cada bug recebe seu
   * próprio .webm mostrando exatamente o trajeto que reproduz o problema.
   */
  static async reproduceAndRecord(
    browser: Browser,
    sourceUrl: string,
    errorUrl: string,
    dir: string,
    storageState?: { cookies: unknown[]; origins: unknown[] },
  ): Promise<{ screenshot?: string; video?: string }> {
    const result: { screenshot?: string; video?: string } = {};

    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: { dir, size: { width: 1280, height: 720 } },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(storageState ? { storageState: storageState as any } : {}),
    });

    const reproPage = await ctx.newPage();
    try {
      // Página de origem: espera carregar visualmente antes de navegar
      if (sourceUrl !== errorUrl) {
        await reproPage.goto(sourceUrl, { waitUntil: 'load', timeout: 20_000 }).catch(() => null);
        // aguarda estabilizar: sem animações ou spinners no caminho
        await reproPage.waitForLoadState('networkidle', { timeout: 5_000 }).catch(() => null);
        await reproPage.waitForTimeout(800);
      }

      // Navega ao URL com erro e aguarda o conteúdo renderizar de verdade
      await reproPage.goto(errorUrl, { waitUntil: 'load', timeout: 20_000 }).catch(() => null);
      // networkidle garante que a página de erro (ex: 404 customizada) terminou de pintar
      await reproPage.waitForLoadState('networkidle', { timeout: 5_000 }).catch(() => null);
      await reproPage.waitForTimeout(1_200);

      const shot = path.join(dir, 'screenshot.png');
      await reproPage.screenshot({ path: shot, fullPage: true }).catch(() => null);
      if (await fileExists(shot)) {
        result.screenshot = path.relative(process.cwd(), shot);
      }
    } finally {
      const video = reproPage.video();
      await ctx.close(); // fecha o contexto: Playwright finaliza o .webm agora

      if (video) {
        try {
          const src = await video.path();
          const dest = path.join(dir, 'execution.webm');
          await fs.rename(src, dest);
          result.video = path.relative(process.cwd(), dest);
        } catch { /* vídeo indisponível: continua sem ele */ }
      }
    }

    return result;
  }

  /**
   * Fila de vídeos a reconciliar após o fechamento do contexto principal.
   * Usada apenas no fallback (sem browser disponível).
   */
  static pendingVideos: Array<{ page: Page; dir: string }> = [];

  static async reconcileVideos(): Promise<void> {
    const pending = EvidenceCollector.pendingVideos;
    EvidenceCollector.pendingVideos = [];

    for (const { page, dir } of pending) {
      try {
        const video = page.video();
        if (!video) continue;
        const src = await video.path();
        const dest = path.join(dir, 'execution.webm');
        await fs.copyFile(src, dest);
        if (!(await fileExists(dest))) continue;

        const defectFile = path.join(dir, 'defect.json');
        try {
          const defect = JSON.parse(await fs.readFile(defectFile, 'utf-8')) as Defect;
          defect.evidence = defect.evidence ?? {};
          defect.evidence.video = path.relative(process.cwd(), dest);
          await fs.writeFile(defectFile, JSON.stringify(defect, null, 2), 'utf-8');
        } catch { /* defect.json ausente: ignora */ }
      } catch { /* vídeo indisponível: ignora */ }
    }
  }
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}
