/**
 * Regras de "o que importa". Este arquivo materializa o princípio do projeto:
 * só reportar o que tem IMPACTO VISÍVEL ao usuário. Ruído técnico é silenciado.
 */

export const DETECTION_RULES = {
  /**
   * Padrões de "template vazado" — markup que escapou para o texto visível.
   * Ex. real encontrado no TribeMD: "Início } -->", "News & Perspectives } -->".
   * Isso É impacto ao usuário: lixo de template aparecendo na UI.
   */
  leakedTemplatePatterns: [
    /\}\s*--?>/, // "} -->"
    /\{\{.*?\}\}/, // {{ handlebars }}
    /\$\{.*?\}/, // ${template literal}
    /undefined|NaN(?![a-z])/i, // valores não resolvidos
  ],

  /**
   * Placeholders "zerados" que indicam dado não carregado.
   * Ex. real: "By the numbers" do /us mostrando 0.0M / 0K / 0M+.
   */
  zeroValuePatterns: [/^0(\.0)?[KM]\+?$/i],

  /** HTTP que conta como falha real para o usuário. */
  failingHttpStatuses: [400, 401, 403, 404, 410, 500, 502, 503, 504] as number[],

  /** Tempo acima do qual a página é considerada "muito lenta" (ms). */
  slowPageThresholdMs: 8000,

  /** Tempo de espera por um loader sumir antes de considerar "loop infinito" (ms). */
  loaderTimeoutMs: 15000,

  /**
   * IGNORAR — explicitamente. Não geramos defeito para nada disto.
   */
  ignore: {
    consoleWarnings: true, // warnings de console sem impacto visível
    missingAltWhenImageRenders: true, // alt ausente se a imagem aparece
    codeSmells: true,
    architecturalIssues: true,
    // domínios de terceiros cujos erros não são responsabilidade do produto
    thirdPartyDomains: [
      'googletagmanager.com',
      'google-analytics.com',
      'clickcease.com',
      'monitor.clickcease.com',
      'facebook.com',
      'connect.facebook.net',
    ],
  },

  /** Sinais de "texto cortado / truncado" via medição de overflow no DOM. */
  overflow: {
    // diferença mínima (px) entre scrollWidth e clientWidth para sinalizar
    horizontalOverflowPx: 4,
  },
} as const;
