import { promises as fs } from 'node:fs';
import path from 'node:path';
import { DefectCollector } from '../src/core/defect-collector.js';
import { reportDir, runMetaPath } from '../src/helpers/output-paths.js';

/**
 * Gera um texto corrido, em PT, descrevendo a execução e os defeitos —
 * legível por gestores e não-QAs. Exemplo do formato pedido na especificação.
 */
function severityLabel(s: string): string {
  return ({ Critical: 'crítico', High: 'alto', Medium: 'médio', Low: 'baixo' })[s] ?? s;
}

async function readMeta() {
  try {
    const raw = await fs.readFile(runMetaPath(), 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { pages: 0, tests: 0 };
  }
}

async function main() {
  const defects = await DefectCollector.get().readAll();
  const meta = await readMeta();

  const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  defects.forEach((d) => (counts[d.severity] += 1));

  const confirmed = defects;
  const mostCritical = defects[0];

  const lines = [];
  lines.push('# Relatório QA — TribeMD (BR/US/ES)');
  lines.push('');
  lines.push(`Data da execução: ${new Date().toLocaleString('pt-BR')}`);
  lines.push('');
  lines.push('## Resumo executivo');
  lines.push('');
  lines.push(
    `Durante a execução foram analisadas ${meta.pages} páginas e registrados ` +
      `${confirmed.length} defeitos. ` +
      `Distribuição por severidade: ${counts.Critical} crítico(s), ${counts.High} alto(s), ` +
      `${counts.Medium} médio(s) e ${counts.Low} baixo(s).`,
  );
  if (mostCritical) {
    lines.push('');
    lines.push(
      `O defeito mais relevante (${severityLabel(mostCritical.severity)}) é "${mostCritical.title}" ` +
        `no ambiente ${(mostCritical.locale ?? '—').toUpperCase()}: ${mostCritical.userImpact}`,
    );
  } else {
    lines.push('');
    lines.push('Nenhum defeito confirmado foi registrado nesta execução.');
  }

  lines.push('');
  lines.push('## Defeitos encontrados');
  lines.push('');
  if (!confirmed.length) lines.push('_Nenhum._');
  for (const d of confirmed) {
    lines.push(`### ${d.id} — ${d.title}`);
    lines.push(`- Severidade: **${d.severity}** (${severityLabel(d.severity)})`);
    lines.push(`- Locale: ${(d.locale ?? '—').toUpperCase()} | Viewport: ${d.viewport}`);
    lines.push(`- Impacto ao usuário: ${d.userImpact}`);
    lines.push(`- Observado: ${d.returned}`);
    lines.push(`- URL: ${d.url}`);
    if (d.sourceUrl) lines.push(`- Origem: ${d.sourceUrl}`);
    lines.push(`- Passos para reproduzir:`);
    d.steps.forEach((s, i) => lines.push(`  ${i + 1}. ${s}`));
    const ev = Object.values(d.evidence).filter(Boolean);
    if (ev.length) lines.push(`- Evidências: ${ev.join(', ')}`);
    lines.push('');
  }

  await fs.mkdir(reportDir(), { recursive: true });
  const out = path.join(reportDir(), 'relatorio-qa.md');
  await fs.writeFile(out, lines.join('\n'), 'utf-8');
  console.log(`Relatório QA gerado em ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
