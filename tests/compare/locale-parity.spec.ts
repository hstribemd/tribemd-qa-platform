import { test } from '../../src/fixtures/qa-fixtures.js';
import { LOCALES, BASE_URL } from '../../src/config/locales.js';
import { HeaderPage } from '../../src/pages/header.page.js';

/**
 * Compara BR, US e ES quanto a equivalência de navegação.
 * Usa as chaves canônicas do mapa de locales para casar a "mesma" seção entre
 * idiomas e reporta o que falta ou diverge de forma inesperada.
 *
 * Defeitos reais que isto pega no TribeMD:
 *  - US não tem Educação/Cursos nem Comunidades equivalente ao BR
 *  - ES tem item "Resource Center" sem link
 *  - rótulo "Comunidades" (PT) presente no menu do /us (EN)
 */
test.describe('Comparação entre países (BR/US/ES)', () => {
  test('paridade de seções principais entre locales', async ({ page, reporter, viewportName }) => {
    // Este teste agrega achados de BR+US+ES num só fluxo de comparação; não é um
    // caminho de usuário. Deixamos ele SEMPRE completar e registrar tudo, em vez
    // de parar no primeiro High — a visibilidade do conjunto importa mais aqui.
    // A regressão por locale (navigation/content) já aplica o gate bloqueante.
    test.info().annotations.push({ type: 'no-severity-gate' });
    const menusByLocale: Record<string, Awaited<ReturnType<HeaderPage['mainMenu']>>> = {};

    for (const code of ['br', 'us', 'es'] as const) {
      await page.goto(`${BASE_URL}${LOCALES[code].basePath}/`, { waitUntil: 'domcontentloaded' });
      const hp = new HeaderPage(page);
      await hp.acceptCookiesIfPresent();
      menusByLocale[code] = await hp.mainMenu();
    }

    // conjunto canônico de seções a partir do BR (referência de produto mais completa)
    const reference = LOCALES.br.nav.map((n) => n.key);

    for (const code of ['us', 'es'] as const) {
      const localeNav = LOCALES[code].nav;
      const presentKeys = new Set(localeNav.map((n) => n.key));

      // 1) seções faltantes em relação ao BR
      for (const key of reference) {
        if (key === 'records') continue; // prontuário é específico do BR; não tratamos como obrigatório
        if (!presentKeys.has(key)) {
          await reporter.report({
            category: 'locale-inconsistency',
            title: `Seção "${key}" existe no BR mas está ausente no ${code.toUpperCase()}`,
            userImpact: `O usuário do site ${code.toUpperCase()} não tem acesso a uma seção (${key}) que existe na versão BR, criando uma experiência desigual entre países.`,
            returned: `O menu do ${code.toUpperCase()} não possui a seção "${key}"`,
            steps: [`Comparar o menu de ${LOCALES.br.basePath}/ com ${LOCALES[code].basePath}/`, `Notar a ausência de "${key}"`],
            url: `${BASE_URL}${LOCALES[code].basePath}/`,
            locale: code,
            browser: 'chromium',
            viewport: viewportName,
            severity: 'Medium',
          });
        }
      }

      // 2) itens de menu sem link (botão morto)
      for (const item of localeNav) {
        if (item.href === null) {
          await reporter.report({
            category: 'dead-button',
            title: `Item de menu "${item.label}" sem destino no ${code.toUpperCase()}`,
            userImpact: `O usuário clica em "${item.label}" e nada acontece.`,
            returned: `O item "${item.label}" não tem link`,
            steps: [`Abrir ${LOCALES[code].basePath}/`, `Clicar em "${item.label}"`],
            url: `${BASE_URL}${LOCALES[code].basePath}/`,
            locale: code,
            browser: 'chromium',
            viewport: viewportName,
          });
        }
      }

      // 3) rótulo em idioma incorreto no menu (ex.: "Comunidades" no /us)
      for (const item of localeNav) {
        const looksPortuguese = /comunidades|início|notícias|eventos|sobre nós/i.test(item.label);
        const looksSpanish = /inicio|noticias|acerca/i.test(item.label);
        if (code === 'us' && (looksPortuguese || looksSpanish)) {
          await reporter.report({
            category: 'translation-failure',
            title: `Rótulo de menu fora do idioma no ${code.toUpperCase()}: "${item.label}"`,
            userImpact: 'O usuário em inglês vê um item de menu em outro idioma, o que confunde a navegação.',
            returned: `O menu do ${code.toUpperCase()} mostra "${item.label}"`,
            steps: [`Abrir ${LOCALES[code].basePath}/`, `Observar o item "${item.label}"`],
            url: `${BASE_URL}${LOCALES[code].basePath}/`,
            locale: code,
            browser: 'chromium',
            viewport: viewportName,
          });
        }
      }
    }
  });
});
