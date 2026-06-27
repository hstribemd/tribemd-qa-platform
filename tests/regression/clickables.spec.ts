import type { APIRequestContext, Page } from '@playwright/test';
import { test } from '../../src/fixtures/qa-fixtures.js';
import { LOCALES, BASE_URL } from '../../src/config/locales.js';
import { targetLocales } from '../../src/helpers/target-locales.js';
import type { DefectReporter } from '../../src/services/defect-reporter.js';
import { checkUrl, isExternal, SKIP_HREF, SKIP_LABEL, SKIP_URL } from '../../src/helpers/link-validation.js';

/**
 * Cobertura EXAUSTIVA do que e clicavel no header e no rodape.
 *
 * Diferente do crawler (que segue <a href> navegando), aqui testamos CADA
 * elemento interativo das areas globais do site:
 *
 *   Fase A — Links (a[href]): navega ate o destino e confirma que nao retorna
 *            erro (404/410/4xx/5xx). Internos = High; externos = Low.
 *
 *   Fase B — Botoes e controles (button, [role=button], a sem href, a[href="#"]):
 *            clica de fato e verifica se ALGO acontece (muda de URL, abre nova
 *            aba, abre menu/modal, ou o DOM muda). Se nada reage, e botao morto.
 *
 * Entre cada clique a home e recarregada para garantir estado limpo (solido,
 * sem efeito cascata de um clique no proximo).
 */

// Regras de "o que pular" e validacao de URL vem do helper compartilhado
// (mesma logica do crawler em navigation.spec) — ver src/helpers/link-validation.

const REGIONS: { name: string; selector: string }[] = [
  { name: 'header', selector: 'header, nav' },
  { name: 'rodape', selector: 'footer' },
];

interface Ctx {
  page: Page;
  request: APIRequestContext;
  reporter: DefectReporter;
  code: string;
  viewport: string;
  homeUrl: string;
}

for (const code of targetLocales()) {
  const locale = LOCALES[code];
  const homeUrl = `${BASE_URL}${locale.basePath}/`;

  test.describe(`Clicaveis (header e rodape) — ${code.toUpperCase()}`, () => {
    for (const region of REGIONS) {
      test(`todos os clicaveis do ${region.name} funcionam [${code}]`, async ({
        page,
        request,
        reporter,
        viewportName,
      }) => {
        // Varredura clique-a-clique e naturalmente mais demorada que um teste
        // comum; damos folga propria para nao falhar por tempo (e nao por defeito).
        test.setTimeout(300_000);
        const ctx: Ctx = { page, request, reporter, code, viewport: viewportName, homeUrl };

        await gotoHome(ctx);
        await auditLinks(ctx, region);
        await auditButtons(ctx, region);

        test.info().annotations.push({ type: 'page-analyzed', description: `${homeUrl} [${region.name}]` });
      });
    }
  });
}

async function gotoHome(ctx: Ctx, light = false): Promise<void> {
  await ctx.page.goto(ctx.homeUrl, { waitUntil: 'domcontentloaded' });
  await acceptCookies(ctx.page);
  // No reset entre cada clique (light) basta um respiro curto; a espera longa de
  // networkidle so vale a pena na 1a carga, senao multiplica o tempo por botao.
  if (light) {
    await ctx.page.waitForTimeout(400);
  } else {
    await ctx.page.waitForLoadState('networkidle', { timeout: 8_000 }).catch(() => undefined);
  }
}

async function acceptCookies(page: Page): Promise<void> {
  for (const sel of [
    'button:has-text("Aceitar")',
    'button:has-text("Accept")',
    'button:has-text("Aceptar")',
    '[id*="cookie"] button',
    '[class*="cookie"] button',
  ]) {
    const loc = page.locator(sel).first();
    if (await loc.isVisible().catch(() => false)) {
      await loc.click().catch(() => undefined);
      return;
    }
  }
}

// ---- Fase A: links ----------------------------------------------------------

async function auditLinks(ctx: Ctx, region: { name: string; selector: string }): Promise<void> {
  const links = await ctx.page.evaluate((rootSel) => {
    const root = document.querySelector(rootSel.split(',')[0].trim()) ?? document.querySelector(rootSel.split(',').pop()!.trim());
    if (!root) return [] as { href: string; label: string }[];
    const out: { href: string; label: string }[] = [];
    for (const a of Array.from(root.querySelectorAll<HTMLAnchorElement>('a[href]'))) {
      const href = a.getAttribute('href') ?? '';
      const label = (a.textContent || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 80);
      const rect = a.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) out.push({ href, label });
    }
    return out;
  }, region.selector);

  // resolve absoluto, dedup por URL, filtra nao-navegaveis
  const seen = new Set<string>();
  const targets: { url: string; label: string; external: boolean }[] = [];
  for (const l of links) {
    if (!l.href || SKIP_HREF.test(l.href) || l.href === '#' || SKIP_LABEL.test(l.label)) continue;
    let abs: string;
    try {
      abs = new URL(l.href, ctx.homeUrl).toString();
    } catch {
      continue;
    }
    if (SKIP_URL.test(abs) || seen.has(abs)) continue;
    seen.add(abs);
    targets.push({ url: abs, label: l.label, external: isExternal(abs) });
  }

  for (const t of targets) {
    const { status, ok } = await checkUrl(ctx.request, t.url);
    if (ok) continue;

    await ctx.reporter.report({
      category: 'broken-link',
      severity: t.external ? 'Low' : undefined,
      title: `Link ${t.external ? 'externo ' : ''}quebrado no ${region.name} (${status}): ${t.label || t.url}`,
      userImpact: t.external
        ? 'O usuario clica num link do site para um destino de terceiros que respondeu com erro. Fora do controle do TribeMD; verificar manualmente.'
        : `O usuario clica em "${t.label || t.url}" no ${region.name} e chega a uma pagina com erro.`,
      returned: `HTTP ${status} ao acessar ${t.url}`,
      steps: [`Abrir ${ctx.homeUrl}`, `Clicar em "${t.label || t.url}" no ${region.name}`, `Observar o erro ${status}`],
      url: t.url,
      sourceUrl: ctx.homeUrl,
      locale: ctx.code,
      browser: 'chromium',
      viewport: ctx.viewport,
      httpStatus: typeof status === 'number' ? status : undefined,
      meta: { external: t.external, region: region.name },
    });
  }

  console.log(`[${ctx.code}] ${region.name}: ${targets.length} link(s) verificado(s)`);
}

// ---- Fase B: botoes e controles --------------------------------------------

const INTERACTIVE_SEL = 'button, [role="button"], a:not([href]), a[href="#"], a[href=""]';

async function auditButtons(ctx: Ctx, region: { name: string; selector: string }): Promise<void> {
  await gotoHome(ctx);
  const total = await regionLocator(ctx.page, region).locator(INTERACTIVE_SEL).count();
  let tested = 0;

  for (let i = 0; i < total; i++) {
    // estado limpo a cada clique (reset leve: nao precisa de networkidle aqui)
    await gotoHome(ctx, true);
    const el = regionLocator(ctx.page, region).locator(INTERACTIVE_SEL).nth(i);

    if (!(await el.isVisible().catch(() => false))) continue;
    const label = ((await el.innerText().catch(() => '')) || (await el.getAttribute('aria-label').catch(() => '')) || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 80);
    if (SKIP_LABEL.test(label)) continue;
    tested++;

    const before = await signature(ctx.page);
    const popupPromise = ctx.page
      .context()
      .waitForEvent('page', { timeout: 2_000 })
      .catch(() => null);

    let interacted = true;
    try {
      await el.scrollIntoViewIfNeeded({ timeout: 3_000 }).catch(() => undefined);
      await el.click({ timeout: 6_000 });
    } catch {
      interacted = false;
    }
    await ctx.page.waitForTimeout(800);

    const popup = await popupPromise;
    const navigated = ctx.page.url() !== before.url;
    const after = navigated ? null : await signature(ctx.page).catch(() => null);
    const domChanged = after ? reacted(before, after) : false;
    const reaction = navigated || Boolean(popup) || domChanged;

    if (popup) await popup.close().catch(() => undefined);

    if (!reaction) {
      await ctx.reporter.report({
        category: 'dead-button',
        severity: 'Medium', // heuristico (baseado em clique) — sinaliza sem bloquear o build
        title: `Botao sem acao no ${region.name}: "${label || '(sem rotulo)'}"`,
        userImpact: `O usuario clica em "${label || 'um botao'}" no ${region.name} e nada acontece — nao navega, nao abre menu nem modal.`,
        returned: interacted
          ? 'Clique registrado mas sem reação (sem navegação, nova aba ou mudança de DOM).'
          : 'Elemento visível mas não clicável (pode estar sobreposto).',
        captureVideo: true,
        steps: [`Abrir ${ctx.homeUrl}`, `Clicar em "${label || 'o controle'}" no ${region.name}`, 'Observar que nada acontece'],
        url: ctx.homeUrl,
        locale: ctx.code,
        browser: 'chromium',
        viewport: ctx.viewport,
        meta: { region: region.name, label },
      });
    }
  }

  console.log(`[${ctx.code}] ${region.name}: ${tested} botao(oes)/controle(s) clicado(s)`);
}

function regionLocator(page: Page, region: { name: string; selector: string }) {
  return page.locator(region.selector).first();
}

interface Signature {
  url: string;
  h: number;
  expanded: number;
  overlays: number;
  visCount: number;
}

async function signature(page: Page): Promise<Signature> {
  return page.evaluate(() => {
    const vis = (e: Element) => {
      const r = e.getBoundingClientRect();
      const s = getComputedStyle(e as HTMLElement);
      return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
    };
    return {
      url: location.href,
      h: document.body.scrollHeight,
      expanded: document.querySelectorAll('[aria-expanded="true"]').length,
      overlays: Array.from(
        document.querySelectorAll('dialog,[role="dialog"],[class*="modal"],[class*="drawer"],[class*="offcanvas"],[class*="overlay"]'),
      ).filter(vis).length,
      visCount: Array.from(document.body.querySelectorAll('*')).filter(vis).length,
    };
  });
}

/** considera que o clique surtiu efeito se algum sinal mudou de forma relevante */
function reacted(a: Signature, b: Signature): boolean {
  if (a.expanded !== b.expanded) return true;
  if (a.overlays !== b.overlays) return true;
  if (Math.abs(a.h - b.h) > 8) return true;
  if (Math.abs(a.visCount - b.visCount) > 1) return true;
  return false;
}
