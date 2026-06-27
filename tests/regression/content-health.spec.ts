import { test } from '../../src/fixtures/qa-fixtures.js';
import { KNOWN_PAGES, BASE_URL } from '../../src/config/locales.js';
import { targetLocales } from '../../src/helpers/target-locales.js';
import { DomInspector } from '../../src/helpers/dom-inspector.js';
import { VisiblePerformance } from '../../src/services/visible-performance.js';

for (const code of targetLocales()) {

  test.describe(`Regressão de conteúdo — locale ${code.toUpperCase()}`, () => {
    for (const path of KNOWN_PAGES[code]) {
      const fullUrl = `${BASE_URL}${path}`;

      test(`saúde da página ${path}`, async ({ page, reporter, viewportName }) => {
        const perf = await VisiblePerformance.measure(page, fullUrl);

        if (perf.infiniteLoader) {
          await reporter.report({
            category: 'infinite-loader',
            title: `Carregamento infinito em ${path}`,
            userImpact: 'O usuário fica preso num carregamento que nunca termina.',
            returned: `Loader "${perf.loaderSelector}" permaneceu visível após o tempo máximo de espera`,
            steps: [`Acessar ${fullUrl}`, 'Observar o loader que nunca some'],
            url: fullUrl,
            locale: code,
            browser: 'chromium',
            viewport: viewportName,
          });
        } else if (perf.slow) {
          await reporter.report({
            category: 'slow-page',
            title: `Página muito lenta em ${path} (${perf.loadMs}ms)`,
            userImpact: 'A página demora demais para ficar utilizável; o usuário pode desistir.',
            returned: `Página levou ${perf.loadMs}ms para estabilizar (limite: 8000ms)`,
            steps: [`Acessar ${fullUrl}`, 'Cronometrar o carregamento'],
            url: fullUrl,
            locale: code,
            browser: 'chromium',
            viewport: viewportName,
          });
        }

        // imagens que não carregam
        const brokenImgs = await DomInspector.findBrokenImages(page);
        for (const img of brokenImgs) {
          await reporter.report({
            category: 'image-not-loading',
            title: `Imagem não carrega em ${path}`,
            userImpact: 'O usuário vê um espaço quebrado onde deveria haver uma imagem.',
            returned: `Imagem não carregou: ${img.src}`,
            steps: [`Acessar ${fullUrl}`, `Observar a imagem quebrada (${img.src})`],
            url: fullUrl,
            locale: code,
            browser: 'chromium',
            viewport: viewportName,
            meta: { src: img.src },
          });
        }

        test.info().annotations.push({ type: 'page-analyzed', description: fullUrl });
      });
    }
  });
}
