export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export type DefectCategory =
  | 'broken-link'
  | 'wrong-redirect'
  | 'page-unavailable'
  | 'http-error'
  | 'image-not-loading'
  | 'dead-button'
  | 'broken-menu'
  | 'form-failure'
  | 'navigation-error'
  | 'truncated-text'
  | 'invisible-component'
  | 'overlapping-elements'
  | 'blank-page'
  | 'infinite-loader'
  | 'slow-page'
  | 'translation-failure'
  | 'locale-inconsistency'
  | 'responsive-failure'
  | 'visual-regression'
  | 'leaked-template';

export interface EvidenceFiles {
  screenshot?: string;
  screenshotHighlight?: string;
  video?: string;
  html?: string;
  logs?: string;
  urls?: string;
}

export interface Defect {
  id: string; // BUG-001
  title: string;
  category: DefectCategory;
  severity: Severity;
  /** contexto do erro: cenário testado + o que aconteceu, pronto para criar chamado no Jira */
  context: string;
  /** impacto para o usuário final */
  userImpact: string;
  /** o que a automação recebeu/observou (sem "esperado") */
  returned: string;
  /** passos numerados para reproduzir */
  steps: string[];
  url: string;
  sourceUrl?: string;
  locale?: string;
  browser: string;
  viewport: string;
  timestamp: string;
  evidence: EvidenceFiles;
  meta?: Record<string, unknown>;
}

export interface LinkCheckResult {
  url: string;
  status: number | 'error';
  sourceUrl: string;
  ok: boolean;
  redirectedTo?: string;
  external: boolean;
}
