import { defineConfig, devices } from '@playwright/test';

/**
 * Projetos = viewports exigidos:
 *  - desktop-chromium : Desktop Full HD (1920x1080)
 *  - laptop           : 1366x768
 *  - tablet           : iPad
 *  - mobile-iphone    : iPhone
 *  - mobile-android   : Pixel
 *
 * regression/exploratory/compare rodam por padrão só no desktop (mais rápido);
 * `full-audit` roda em todos. visual roda em todos para cobrir responsividade.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 120_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'reports/playwright-html' }],
    ['allure-playwright', { resultsDir: 'allure-results' }],
    ['./src/engines/reporting/meta-reporter.ts'],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://tribemd.com',
    actionTimeout: 15_000,
    navigationTimeout: 45_000,
    // trace só em retry: o crawl site-inteiro gera trace gigante; reter por
    // falha enchia o disco (1,7 GB). Evidência por bug já vem do EvidenceCollector.
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ignoreHTTPSErrors: true,
    locale: 'pt-BR',
  },
  /** tolerância de regressão visual: pequena, para não gerar ruído */
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}',
  projects: (() => {
    const loc = (process.env.QA_LOCALE ?? 'default').toLowerCase().trim();
    const statePath = `.auth/state-${loc}.json`;
    // Modo autenticado: ligado por QA_AUTH=1 (e so faz sentido com AUTH_USER/PASS).
    // Quando ligado, os projetos publicos dependem do 'setup' e injetam a sessao,
    // crawlando o site JA LOGADO (Caso 2). Desligado: tudo roda anonimo.
    const authOn = process.env.QA_AUTH === '1';
    const publicUse = authOn ? { storageState: statePath } : {};
    const publicDeps = authOn ? { dependencies: ['setup'] as string[] } : {};
    const ignoreAuthFiles = [/auth\.setup\.ts/, /authenticated\//];

    return [
      // 'setup': faz o login real no Keycloak e salva a sessao. So roda no modo
      // autenticado; senao nao ha o que preparar.
      ...(authOn ? [{ name: 'setup', testMatch: /auth\.setup\.ts/ }] : []),

      // Caso 1 (opcional): suite dedicada a area logada, sempre autenticada.
      // So existe no modo autenticado (depende do 'setup').
      ...(authOn
        ? [{
            name: 'authenticated',
            testMatch: /authenticated\/.*\.spec\.ts/,
            dependencies: ['setup'] as string[],
            use: {
              ...devices['Desktop Chrome'],
              viewport: { width: 1920, height: 1080 },
              storageState: statePath,
            },
          }]
        : []),

      // Suites publicas (regressao/visual/crawl). Anonimas por padrao; logadas
      // quando QA_AUTH=1. Nunca rodam os arquivos de auth.
      {
        name: 'desktop-chromium',
        use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 }, ...publicUse },
        testIgnore: ignoreAuthFiles,
        ...publicDeps,
      },
      {
        name: 'laptop',
        use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 }, ...publicUse },
        testIgnore: ignoreAuthFiles,
        ...publicDeps,
      },
      {
        name: 'tablet',
        use: { ...devices['iPad (gen 7)'], ...publicUse },
        testIgnore: ignoreAuthFiles,
        ...publicDeps,
      },
      {
        name: 'mobile-iphone',
        use: { ...devices['iPhone 13'], ...publicUse },
        testIgnore: ignoreAuthFiles,
        ...publicDeps,
      },
      {
        name: 'mobile-android',
        use: { ...devices['Pixel 7'], ...publicUse },
        testIgnore: ignoreAuthFiles,
        ...publicDeps,
      },
    ];
  })(),
});
