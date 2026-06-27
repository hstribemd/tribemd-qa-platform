import { expect } from '@playwright/test';
import type { Defect, Severity } from '../core/types.js';

/**
 * Gate de severidade.
 *
 * Princípio: o objetivo não é manter a suíte verde, é maximizar a chance de um
 * problema real ser VISTO por um humano antes do usuário. Defeito que só vira
 * arquivo numa pasta tende a não ser lido quando o build está verde.
 *
 * Por isso: defeitos de severidade Critical/High FALHAM o teste
 * (CI vermelho, alguém olha). Medium/Low entram no relatório sem quebrar o build.
 */

export const BLOCKING_SEVERITIES: Severity[] = ['Critical', 'High'];

export interface GateResult {
  blocking: Defect[];
  nonBlocking: Defect[];
}

export function partitionBySeverity(defects: Defect[]): GateResult {
  const blocking: Defect[] = [];
  const nonBlocking: Defect[] = [];
  for (const d of defects) {
    if (BLOCKING_SEVERITIES.includes(d.severity)) blocking.push(d);
    else nonBlocking.push(d);
  }
  return { blocking, nonBlocking };
}

/**
 * Assere no fim de um teste que nenhum defeito bloqueante foi registrado.
 * A mensagem lista os defeitos para que o motivo da falha seja óbvio no log do CI.
 */
export function enforceSeverityGate(defects: Defect[]): void {
  const { blocking } = partitionBySeverity(defects);
  if (blocking.length === 0) return;

  const summary = blocking
    .map((d) => `  - [${d.severity}] ${d.id} (${(d.locale ?? '—').toUpperCase()}): ${d.title}\n    → ${d.userImpact}`)
    .join('\n');

  expect(
    blocking.length,
    `\n${blocking.length} defeito(s) bloqueante(s) (Critical/High) detectado(s):\n${summary}\n` +
      `Evidências em evidencias/. Build vermelho proposital — alguém precisa olhar.`,
  ).toBe(0);
}
