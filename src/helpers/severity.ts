import type { DefectCategory, Severity } from '../core/types.js';

/**
 * Mapa de severidade padrão por categoria, alinhado à matriz da especificação:
 *  Critical -> usuário bloqueado / página indisponível / erro fatal
 *  High     -> funcionalidade principal quebrada
 *  Medium   -> funcionalidade parcialmente afetada
 *  Low      -> impacto visual pequeno
 *
 * Pode ser sobreposto caso a caso quando o contexto pedir.
 */
const DEFAULT_SEVERITY: Record<DefectCategory, Severity> = {
  'page-unavailable': 'Critical',
  'blank-page': 'Critical',
  'http-error': 'Critical', // refinado em runtime: 5xx=Critical, 404=High
  'infinite-loader': 'Critical',
  'broken-menu': 'High',
  'broken-link': 'High',
  'dead-button': 'High',
  'form-failure': 'High',
  'navigation-error': 'High',
  'wrong-redirect': 'High',
  'translation-failure': 'High',
  'leaked-template': 'High',
  'image-not-loading': 'Medium',
  'invisible-component': 'Medium',
  'overlapping-elements': 'Medium',
  'slow-page': 'Medium',
  'locale-inconsistency': 'Medium',
  'responsive-failure': 'Medium',
  'truncated-text': 'Low',
  'visual-regression': 'Low',
};

export function severityFor(category: DefectCategory, ctx?: { httpStatus?: number }): Severity {
  if (category === 'http-error' && ctx?.httpStatus) {
    if (ctx.httpStatus >= 500) return 'Critical';
    if (ctx.httpStatus === 404 || ctx.httpStatus === 410) return 'High';
    return 'High';
  }
  return DEFAULT_SEVERITY[category];
}
