import path from 'node:path';

/**
 * Resolve os diretórios de saída (relatórios e evidências) de uma execução.
 *
 * Princípio (plano B de isolamento): cada locale roda numa execução PRÓPRIA e
 * grava num diretório PRÓPRIO, para que BR não sobrescreva US/ES. Os caminhos
 * fixos antigos (`reports/`, `evidencias/`) sobrescreviam o resultado a cada
 * locale — perdíamos dois terços dos achados ao rodar os três.
 *
 * Controle por env:
 *   QA_REPORT_DIR  -> raiz dos relatórios   (default: reports)
 *   EVIDENCE_DIR   -> raiz das evidências   (default: evidencias)
 *   QA_LOCALE      -> se definido e nenhum dir explícito foi dado, sufixa
 *                     automaticamente com o locale (reports/br, evidencias/br).
 *
 * Assim `QA_LOCALE=br npm run qa:locale` já isola tudo sem flags extras.
 */
function localeSuffix(): string {
  const loc = (process.env.QA_LOCALE ?? '').toLowerCase().trim();
  return loc ? loc : '';
}

export function reportDir(): string {
  if (process.env.QA_REPORT_DIR) return path.resolve(process.env.QA_REPORT_DIR);
  const suffix = localeSuffix();
  return path.resolve(suffix ? path.join('reports', suffix) : 'reports');
}

export function evidenceDir(): string {
  if (process.env.EVIDENCE_DIR) return path.resolve(process.env.EVIDENCE_DIR);
  const suffix = localeSuffix();
  return path.resolve(suffix ? path.join('evidencias', suffix) : 'evidencias');
}

export function runMetaPath(): string {
  return path.join(reportDir(), 'run-meta.json');
}
