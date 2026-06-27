import { test } from '../../src/fixtures/qa-fixtures.js';
import { LOCALES, BASE_URL } from '../../src/config/locales.js';
import { targetLocales } from '../../src/helpers/target-locales.js';

/**
 * Jornada principal do usuário por locale:
 *   listagem de conteudos -> abre primeiro item -> verifica titulo visivel.
 *
 * Um 200 no crawler nao garante que o fluxo funciona. Este teste verifica
 * que o usuario consegue de fato ler um conteudo do inicio ao fim.
 */

const CONTENT_PATH: Record<string, string> = {
  br: '/br/conteudos/',
  us: '/us/contents/',
  es: '/es/contenidos/',
};

for (const code of targetLocales()) {
  const locale = LOCALES[code];
  const listingPath = CONTENT_PATH[code];

  test.describe(`Jornada do usuario — ${code.toUpperCase()}`, () => {
    test(`listagem de conteudos tem itens e abre o detalhe corretamente [${code}]`, async ({
      page,
      reporter,
      viewportName,
    }) => {
      // 1. abre a listagem
      const listingUrl = `${BASE_URL}${listingPath}`;
      const listingResp = await page.goto(listingUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => undefined);

      const listingStatus = listingResp?.status();
      if (listingStatus && listingStatus >= 400) {
        await reporter.report({
          category: 'http-error',
          title: `Listagem de conteudos indisponivel: HTTP ${listingStatus} (${listingPath})`,
          userImpact: 'O usuario nao consegue acessar a secao de noticias e conteudos do site.',
          returned: `HTTP ${listingStatus} ao acessar a listagem de conteúdos`,
          captureVideo: true,
          steps: [`Acessar ${listingUrl}`],
          url: listingUrl,
          locale: code,
          browser: 'chromium',
          viewport: viewportName,
          httpStatus: listingStatus,
        });
        return;
      }

      // 2. verifica que existe ao menos um item de conteudo
      const firstLink = page.locator('main a[href], article a[href], [class*="card"] a[href]').first();
      const firstHref = await firstLink.getAttribute('href').catch(() => null);

      if (!firstHref) {
        await reporter.report({
          category: 'blank-page',
          title: `Listagem de conteudos esta vazia: ${listingPath}`,
          userImpact: 'O usuario abre a secao de noticias e nao encontra nenhum conteudo para ler.',
          returned: 'Nenhum link de artigo encontrado na listagem — página carregou mas sem conteúdo',
          captureVideo: true,
          steps: [`Acessar ${listingUrl}`, 'Observar que nao ha artigos'],
          url: page.url(),
          locale: code,
          browser: 'chromium',
          viewport: viewportName,
        });
        return;
      }

      // 3. abre o primeiro item
      const articleUrl = new URL(firstHref, BASE_URL).toString();
      const articleResp = await page.goto(articleUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => undefined);

      const articleStatus = articleResp?.status();
      if (articleStatus && articleStatus >= 400) {
        await reporter.report({
          category: 'http-error',
          title: `Detalhe de conteudo nao carrega: HTTP ${articleStatus}`,
          userImpact: 'O usuario clica em um artigo e chega a uma pagina com erro.',
          returned: `HTTP ${articleStatus} ao abrir o detalhe do artigo`,
          captureVideo: true,
          steps: [`Acessar ${listingUrl}`, 'Clicar no primeiro artigo', `Observar o erro ${articleStatus}`],
          url: articleUrl,
          sourceUrl: listingUrl,
          locale: code,
          browser: 'chromium',
          viewport: viewportName,
          httpStatus: articleStatus,
        });
        return;
      }

      // 4. verifica que o titulo do artigo esta visivel
      const titleVisible = await page.locator('h1').first().isVisible().catch(() => false);
      if (!titleVisible) {
        await reporter.report({
          category: 'blank-page',
          title: `Pagina de detalhe abre sem titulo visivel`,
          userImpact: 'O usuario abre um artigo e nao ve nenhum titulo — nao sabe o que esta lendo.',
          returned: 'Página de detalhe abriu mas sem h1 visível — conteúdo inacessível',
          captureVideo: true,
          steps: [`Acessar ${listingUrl}`, 'Clicar no primeiro artigo', 'Observar a ausencia de titulo'],
          url: page.url(),
          sourceUrl: listingUrl,
          locale: code,
          browser: 'chromium',
          viewport: viewportName,
        });
      }

      test.info().annotations.push({ type: 'page-analyzed', description: articleUrl });
    });

    test(`home tem navegacao principal acessivel [${code}]`, async ({ page, reporter, viewportName }) => {
      await page.goto(`${BASE_URL}${locale.basePath}/`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => undefined);

      const menuLinkCount = await page.locator('nav a[href], header a[href]').count();
      if (menuLinkCount === 0) {
        await reporter.report({
          category: 'broken-menu',
          title: `Nenhum link de menu encontrado na home [${code}]`,
          userImpact: 'O usuario abre o site e nao encontra nenhuma navegacao principal.',
          returned: 'Nenhum a[href] encontrado em nav ou header — menu ausente',
          captureVideo: true,
          steps: [`Acessar ${BASE_URL}${locale.basePath}/`, 'Inspecionar o menu'],
          url: `${BASE_URL}${locale.basePath}/`,
          locale: code,
          browser: 'chromium',
          viewport: viewportName,
        });
      }

      test.info().annotations.push({ type: 'page-analyzed', description: `${BASE_URL}${locale.basePath}/` });
    });
  });
}
