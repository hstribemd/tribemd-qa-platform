import { ALL_LOCALES, type LocaleCode } from '../config/locales.js';

/**
 * Resolve quais locales a suíte deve rodar.
 *
 * ISOLAMENTO POR LOCALE (plano B):
 * Cada locale é um produto estruturalmente diferente (paths, menu e defeitos
 * próprios) e grava num diretório de saída próprio. Rodar os três numa mesma
 * execução fazia o relatório de um sobrescrever o do outro. Por isso, a suíte
 * agora EXIGE um locale explícito via QA_LOCALE.
 *
 *   QA_LOCALE=br  -> roda só o Brasil
 *   QA_LOCALE=us  -> roda só os EUA
 *   QA_LOCALE=es  -> roda só a Espanha
 *   (não definida) -> ERRO com instrução clara (antes: rodava os três juntos)
 *
 * Para rodar os três, use o comando guarda-chuva `npm run qa:all`, que dispara
 * UMA execução isolada por locale, em sequência, cada uma com sua saída.
 */
export function targetLocales(): LocaleCode[] {
  const env = (process.env.QA_LOCALE ?? '').toLowerCase().trim();

  if (!env) {
    throw new Error(
      'QA_LOCALE não definido. Rode um locale por vez para manter o isolamento:\n' +
        '  QA_LOCALE=br npm run regression   (ou us / es)\n' +
        'Para rodar os três em sequência (cada um isolado): npm run qa:all',
    );
  }

  if (!(ALL_LOCALES as string[]).includes(env)) {
    throw new Error(
      `QA_LOCALE inválido: "${env}". Valores aceitos: ${ALL_LOCALES.join(', ')}.`,
    );
  }

  return [env as LocaleCode];
}

/**
 * Retorna TODOS os locales — exclusivo para a engine de comparação/paridade,
 * que por natureza precisa dos três ao mesmo tempo para casar seções entre
 * países. Não use isto na regressão/visual: lá o isolamento é obrigatório.
 */
export function allLocalesForComparison(): LocaleCode[] {
  return ALL_LOCALES;
}
