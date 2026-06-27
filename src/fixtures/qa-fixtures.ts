import { test as base, expect } from '@playwright/test';
import { PageLogs } from '../helpers/page-logs.js';
import { HeaderPage } from '../pages/header.page.js';
import { DefectReporter } from '../services/defect-reporter.js';
import { enforceSeverityGate } from '../helpers/severity-gate.js';
import { EvidenceCollector } from '../core/evidence-collector.js';

export interface QAFixtures {
  pageLogs: PageLogs;
  header: HeaderPage;
  reporter: DefectReporter;
  viewportName: string;
}

/**
 * Fixtures que tornam cada teste "consciente de QA":
 * - pageLogs: captura console/network desde o início
 * - header: page object pronto
 * - reporter: registra defeitos + evidências
 * - viewportName: nome legível do viewport corrente (vem do project)
 */
export const test = base.extend<QAFixtures>({
  viewportName: async ({}, use, testInfo) => {
    await use(testInfo.project.name);
  },

  pageLogs: async ({ page }, use) => {
    const logs = new PageLogs();
    logs.attach(page);
    await use(logs);
  },

  header: async ({ page }, use) => {
    await use(new HeaderPage(page));
  },

  reporter: async ({ page, pageLogs, browser }, use, testInfo) => {
    const browserName = testInfo.project.use.defaultBrowserType ?? 'chromium';
    void browserName;
    const reporter = new DefectReporter(page, pageLogs, browser);
    await use(reporter);

    // Vídeo: o Playwright só finaliza o .mp4 quando o contexto do navegador
    // fecha. Fechamos o contexto AQUI para forçar a gravação e então copiamos
    // os vídeos pendentes para as pastas dos bugs. Sem isto, o execution.mp4
    // saía vazio/ausente (a cópia acontecia antes do arquivo existir).
    try {
      await page.context().close();
    } catch {/* contexto pode já estar fechado */}
    await EvidenceCollector.reconcileVideos();

    // Gate de severidade aplicado no teardown: se o teste registrou defeitos
    // Critical/High confirmados, o teste FALHA (build vermelho → alguém olha).
    // Princípio: detectar e tornar VISÍVEL o problema vale mais que suíte verde.
    // Specs podem desativar com a annotation { type: 'no-severity-gate' }
    // (ex.: o spec de comparação, que agrega achados sem ser um caminho de usuário).
    const optOut = testInfo.annotations.some((a) => a.type === 'no-severity-gate');
    if (!optOut) enforceSeverityGate(reporter.registered);
  },
});

export { expect };
