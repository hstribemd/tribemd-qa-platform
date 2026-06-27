import { test } from '../../src/fixtures/qa-fixtures.js';
import { LOCALES, BASE_URL } from '../../src/config/locales.js';
import { targetLocales } from '../../src/helpers/target-locales.js';
import { Crawler, extractLinks } from '../../src/services/crawler.js';
import { DETECTION_RULES } from '../../src/config/detection-rules.js';
import { checkMany, isExternal, shouldSkipUrl, stripHash } from '../../src/helpers/link-validation.js';

/**
 * Varredura de links do site (por locale).
 *
 * 1) O crawler navega pelas paginas internas e checa o status HTTP de cada uma.
 * 2) Valida TODOS os demais links descobertos (externos e nao navegados).
 *
 * Erros encontrados pelo crawler NAO gravam video — apenas screenshot + contexto
 * com a URL da pagina anterior. Video de reproducao so faz sentido para erros
 * interativos (clickables, user-journey), onde ha uma acao humana a demonstrar.
 */

const MAX_DEPTH = Number(process.env.CRAWL_DEPTH ?? 6);
const RAW_MAX_PAGES = Number(process.env.CRAWL_MAX_PAGES ?? 400);
const UNLIMITED = RAW_MAX_PAGES === 0;
const MAX_PAGES = UNLIMITED ? Number.MAX_SAFE_INTEGER : RAW_MAX_PAGES;
const SETTLE_MS = Number(process.env.CRAWL_SETTLE_MS ?? 500);
const MAX_EXTERNAL_LINKS = 200;

for (const code of targetLocales()) {
  const locale = LOCALES[code];

  test.describe(`Navegação — ${code.toUpperCase()}`, () => {
    test(`varredura de links em todo o site: nenhum link quebrado [${code}]`, async ({
      page,
      request,
      reporter,
      viewportName,
    }) => {
      test.setTimeout(UNLIMITED ? 0 : 20 * 60_000);

      const crawler = new Crawler({
        maxDepth: MAX_DEPTH,
        maxPages: MAX_PAGES,
        scopePrefix: locale.basePath,
        origin: BASE_URL,
      });

      // --- Fase 1: crawl — navega cada pagina e checa o status HTTP ---
      let n = 0;
      await crawler.crawl(`${BASE_URL}${locale.basePath}/`, async (url) => {
        n++;
        if (n % 10 === 0 || n === 1) {
          console.log(`[${code}] crawl: ${n}${UNLIMITED ? '' : `/${MAX_PAGES}`} páginas — atual: ${url}`);
        }

        const resp = await page.goto(url, { waitUntil: 'domcontentloaded' }).catch(() => null);

        if (isOffDomain(page.url(), BASE_URL)) return [];

        await page.waitForTimeout(SETTLE_MS);

        const status = resp?.status();
        if (status && DETECTION_RULES.failingHttpStatuses.includes(status)) {
          // Crawler: sem captureVideo — screenshot da pagina + contexto da pagina anterior
          const fromUrl = crawler.pages.find((p) => p.url === url)?.fromUrl;
          await reporter.report({
            category: 'http-error',
            title: `HTTP ${status} — ${readablePath(url)}`,
            userImpact:
              status >= 500
                ? 'A página está fora do ar — o usuário não consegue acessar o conteúdo.'
                : 'A página não existe — o usuário recebe erro ao tentar acessá-la.',
            returned: `HTTP ${status} — ${status >= 500 ? 'erro interno do servidor' : 'página não encontrada'}`,
            steps: [
              ...(fromUrl ? [`Acessar ${fromUrl}`] : []),
              `Navegar para ${url}`,
              `A página retorna HTTP ${status}`,
            ],
            url,
            sourceUrl: fromUrl ?? undefined,
            locale: code,
            browser: 'chromium',
            viewport: viewportName,
            httpStatus: status,
            captureVideo: true,
          });
        }

        return extractLinks(page, BASE_URL);
      });

      // Guarda mínimo: se 0 páginas foram visitadas, o site é inacessível neste
      // ambiente (IP bloqueado, CDN, timeout). Falhar aqui deixa o erro explícito
      // em vez de passar silenciosamente com 0 defeitos.
      if (crawler.pages.length === 0) {
        throw new Error(
          `Crawler não conseguiu acessar nenhuma página em ${BASE_URL}${locale.basePath}/\n` +
          `Possíveis causas: site inacessível no CI, IP bloqueado por CDN/firewall, ou timeout de rede.\n` +
          `Verifique a etapa "Verificar conectividade" no log do workflow.`,
        );
      }

      // --- Fase 2: valida links descobertos que o crawler nao navegou ---
      const visited = new Set(crawler.pages.map((p) => stripHash(p.url)));
      const source = new Map<string, { sourceUrl: string; linkText: string }>();
      const internalLinks: string[] = [];
      const externalLinks: string[] = [];
      const seen = new Set<string>();
      for (const l of crawler.allLinks) {
        const u = stripHash(l.url);
        if (shouldSkipUrl(u) || visited.has(u) || seen.has(u)) continue;
        seen.add(u);
        source.set(u, { sourceUrl: l.sourceUrl, linkText: l.text });
        if (isExternal(u)) externalLinks.push(u);
        else internalLinks.push(u);
      }

      const extSample = externalLinks.slice(0, MAX_EXTERNAL_LINKS);
      if (externalLinks.length > MAX_EXTERNAL_LINKS) {
        console.log(`[${code}] links externos: ${externalLinks.length} descobertos, validando os primeiros ${MAX_EXTERNAL_LINKS}`);
      }
      const toCheck = [...internalLinks, ...extSample];

      console.log(`[${code}] validando links: ${internalLinks.length} internos + ${extSample.length} externos...`);
      const results = await checkMany(request, toCheck, 10, (done, total) => {
        if (done % 25 === 0 || done === total) {
          console.log(`[${code}] links: ${done}/${total} validados`);
        }
      });

      let broken = 0;
      for (const [url, res] of results) {
        if (res.ok) continue;
        broken++;
        const external = isExternal(url);
        const info = source.get(url);
        await reporter.report({
          category: 'broken-link',
          severity: external ? 'Low' : undefined,
          title: `Link ${external ? 'externo ' : ''}quebrado (${res.status}) — ${readablePath(url)}`,
          userImpact: external
            ? 'O usuario clica num link para um site de terceiros que respondeu com erro.'
            : 'O usuario clica num link interno e chega a uma pagina com erro.',
          returned: `HTTP ${res.status} ao acessar ${url}`,
          steps: [
            `Abrir ${info?.sourceUrl ?? '—'}`,
            ...(info?.linkText ? [`Clicar no link "${info.linkText}"`] : [`Clicar no link para ${url}`]),
            `A URL retorna ${res.status}`,
          ],
          url,
          sourceUrl: info?.sourceUrl,
          locale: code,
          browser: 'chromium',
          viewport: viewportName,
          httpStatus: typeof res.status === 'number' ? res.status : undefined,
          meta: { external, linkText: info?.linkText },
          captureVideo: true,
        });
      }

      console.log(
        `[${code}] páginas visitadas: ${crawler.pages.length}, links extras validados: ${toCheck.length}, quebrados: ${broken}`,
      );
      test.info().annotations.push({ type: 'pages-crawled', description: String(crawler.pages.length) });
      test.info().annotations.push({ type: 'links-checked', description: String(toCheck.length) });
    });
  });
}

function isOffDomain(currentUrl: string, origin: string): boolean {
  try { return new URL(currentUrl).host !== new URL(origin).host; } catch { return false; }
}

function readablePath(url: string): string {
  try {
    const parts = new URL(url).pathname.split('/').filter(Boolean);
    return decodeURIComponent(parts[parts.length - 1] ?? url).replace(/-+/g, ' ').slice(0, 80);
  } catch {
    return url;
  }
}
