import { test, expect } from '../../src/fixtures/qa-fixtures.js';
import { LOCALES, BASE_URL } from '../../src/config/locales.js';
import { targetLocales } from '../../src/helpers/target-locales.js';
import { DomInspector } from '../../src/helpers/dom-inspector.js';

/**
 * Regressão visual + responsividade.
 * - snapshot da home por viewport (detecta alterações inesperadas/desalinhamento)
 * - checagem de overflow horizontal (quebra responsiva clássica)
 * - sobreposição de elementos interativos
 *
 * O snapshot usa maxDiffPixelRatio para tolerar antialiasing, evitando ruído.
 */
for (const code of targetLocales()) {
  const locale = LOCALES[code];

  test.describe(`Visual & responsivo — ${code.toUpperCase()}`, () => {
    test(`home renderiza sem quebra responsiva [${code}]`, async ({ page, reporter, viewportName }) => {
      await page.goto(`${BASE_URL}${locale.basePath}/`, { waitUntil: 'networkidle' }).catch(() => undefined);

      // overflow horizontal do documento = conteúdo "vazando" da tela no mobile
      const horizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      if (horizontalOverflow > 8) {
        await reporter.report({
          category: 'responsive-failure',
          title: `Conteúdo ultrapassa a largura da tela (${viewportName})`,
          userImpact: 'No dispositivo, o usuário precisa rolar horizontalmente e parte do conteúdo fica fora da tela.',
          returned: `${horizontalOverflow}px de overflow horizontal detectado em ${viewportName}`,
          steps: [`Abrir ${locale.basePath}/ em ${viewportName}`, 'Notar a rolagem horizontal indevida'],
          url: page.url(),
          locale: code,
          browser: 'chromium',
          viewport: viewportName,
        });
      }

      // sobreposição de elementos interativos
      const overlaps = await DomInspector.findOverlaps(page);
      for (const o of overlaps.slice(0, 5)) {
        await reporter.report({
          category: 'overlapping-elements',
          title: `Elementos sobrepostos em ${viewportName}`,
          userImpact: 'Um elemento cobre outro, podendo impedir cliques ou esconder informação.',
          returned: `"${o.a}" está sobreposto por "${o.b}"`,
          steps: [`Abrir ${locale.basePath}/ em ${viewportName}`, 'Observar a sobreposição'],
          url: page.url(),
          locale: code,
          browser: 'chromium',
          viewport: viewportName,
        });
      }

      // snapshot visual — pulado quando SKIP_SNAPSHOTS=1 (ex: daily-audit.sh).
      // Rode "npm run visual:update" uma vez para criar as baselines.
      if (process.env.SKIP_SNAPSHOTS !== '1') {
        await expect(page).toHaveScreenshot(`home-${code}.png`, {
          fullPage: true,
          maxDiffPixelRatio: 0.02,
          animations: 'disabled',
        });
      }
    });
  });
}
