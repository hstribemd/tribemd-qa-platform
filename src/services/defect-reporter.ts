import type { Page, Locator, Browser } from '@playwright/test';
import { EvidenceCollector } from '../core/evidence-collector.js';
import { severityFor } from '../helpers/severity.js';
import type { DefectCategory, Defect, Severity } from '../core/types.js';
import { PageLogs } from '../helpers/page-logs.js';

export interface ReportArgs {
  category: DefectCategory;
  title: string;
  /** contexto manual; se omitido, é gerado automaticamente a partir dos demais campos */
  context?: string;
  userImpact: string;
  /** o que a automação recebeu/observou */
  returned: string;
  steps: string[];
  url: string;
  sourceUrl?: string;
  locale?: string;
  browser: string;
  viewport: string;
  locator?: Locator;
  severity?: Severity;
  httpStatus?: number;
  meta?: Record<string, unknown>;
  /**
   * Gravar vídeo de reprodução isolado (abre novo contexto, navega source → error, fecha).
   * Padrão: false — ativar explicitamente nos specs onde há interação do usuário
   * (clickables, user-journey). O crawler NÃO grava vídeo — só screenshot + contexto.
   */
  captureVideo?: boolean;
}

/** gera contexto legível automaticamente quando o spec não fornece um explícito */
function autoContext(args: ReportArgs): string {
  const loc = args.locale?.toUpperCase() ?? 'BR';
  const readable = (u: string) => {
    try {
      return decodeURIComponent(new URL(u).pathname);
    } catch {
      return u;
    }
  };

  switch (args.category) {
    case 'http-error':
      return (
        `A automação navegou o site ${loc} e acessou a URL "${readable(args.url)}", ` +
        `que retornou HTTP ${args.httpStatus ?? 'erro de servidor'}. ` +
        (args.sourceUrl
          ? `Esta página é acessível a partir de: ${args.sourceUrl}. `
          : '') +
        'O usuário não consegue visualizar o conteúdo — a página simplesmente falha ao carregar.'
      );

    case 'broken-link': {
      const linkText = (args.meta as Record<string, unknown> | undefined)?.linkText as string | undefined;
      const external = (args.meta as Record<string, unknown> | undefined)?.external as boolean | undefined;
      return (
        `${external ? 'Link externo: ' : ''}Na página "${readable(args.sourceUrl ?? args.url)}", ` +
        `existe um link ${linkText ? `com o texto "${linkText}" ` : ''}` +
        `apontando para "${readable(args.url)}" que retornou HTTP ${args.httpStatus ?? 'erro'}. ` +
        (external
          ? 'Embora seja um link de terceiros, o site TribeMD está referenciando um destino com erro, prejudicando a experiência do usuário.'
          : 'O usuário clica no link e cai numa página de erro — o conteúdo está inacessível.')
      );
    }

    case 'dead-button':
      return (
        `Durante a verificação do header/rodapé no site ${loc}, o elemento ` +
        `"${(args.meta as Record<string, unknown> | undefined)?.label ?? 'sem rótulo'}" ` +
        `foi clicado mas não produziu nenhuma reação — a URL não mudou, nenhum modal ou aba foi aberto, ` +
        `e o DOM não se alterou. O botão está presente na interface mas não funciona.`
      );

    case 'image-not-loading':
      return (
        `Na página "${readable(args.url)}" do site ${loc}, ` +
        `uma imagem não carregou — o usuário vê um ícone de imagem quebrada no lugar do visual esperado. ` +
        `Recurso: ${(args.meta as Record<string, unknown> | undefined)?.src ?? '—'}.`
      );

    case 'infinite-loader':
      return (
        `A página "${readable(args.url)}" no site ${loc} ficou presa num estado de carregamento — ` +
        'um spinner ou skeleton screen continuou visível após o tempo máximo permitido. ' +
        'O usuário enxerga a página "travada" e não consegue interagir com o conteúdo.'
      );

    case 'slow-page':
      return (
        `A página "${readable(args.url)}" no site ${loc} demorou mais que o limite aceitável para ficar utilizável. ` +
        `${args.returned}. ` +
        'Performance perceptível para o usuário, podendo causar abandono da página.'
      );

    case 'navigation-error':
      return (
        `Erro de navegação detectado na jornada do usuário no site ${loc}. ` +
        `A automação tentou acessar "${readable(args.url)}" mas encontrou: ${args.returned}. ` +
        (args.sourceUrl ? `Ponto de origem: ${args.sourceUrl}.` : '')
      );

    case 'responsive-failure':
      return (
        `Problema de layout responsivo detectado na página "${readable(args.url)}" ` +
        `no viewport "${args.viewport}". ${args.returned}`
      );

    case 'visual-regression':
      return (
        `A página "${readable(args.url)}" apresentou diferença visual em relação à baseline aprovada ` +
        `no viewport "${args.viewport}" (site ${loc}). Uma mudança no layout, cores ou posicionamento ` +
        'foi detectada automaticamente e precisa de validação manual.'
      );

    default:
      return (
        `Problema detectado em "${readable(args.url)}" durante a execução do QA automatizado no site ${loc}. ` +
        `Categoria: ${args.category}. ${args.returned}`
      );
  }
}

export class DefectReporter {
  readonly registered: Defect[] = [];

  constructor(
    private page: Page | undefined,
    private logs?: PageLogs,
    private browserInstance?: Browser,
  ) {}

  async report(args: ReportArgs): Promise<Defect> {
    const severity = args.severity ?? severityFor(args.category, { httpStatus: args.httpStatus });
    const context = args.context ?? autoContext(args);
    const defect = await EvidenceCollector.capture(
      this.page,
      {
        title: args.title,
        category: args.category,
        severity,
        context,
        userImpact: args.userImpact,
        returned: args.returned,
        steps: args.steps,
        url: args.url,
        sourceUrl: args.sourceUrl,
        locale: args.locale,
        browser: args.browser,
        viewport: args.viewport,
        locator: args.locator,
        meta: args.meta,
      },
      this.logs?.all() ?? [],
      args.captureVideo ? this.browserInstance : undefined,
    );
    this.registered.push(defect);
    return defect;
  }
}
