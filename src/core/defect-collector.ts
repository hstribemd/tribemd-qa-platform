import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Defect, Severity } from './types.js';
import { evidenceDir } from '../helpers/output-paths.js';

const SEV_ORDER: Record<Severity, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };

/**
 * Registro global de defeitos compartilhado entre os workers via arquivo.
 * Cada defeito recebe um ID sequencial estável (BUG-001...) e uma pasta de evidências.
 *
 * Por usar arquivos, funciona mesmo com a execução paralela do Playwright:
 * cada defeito é gravado atomicamente como JSON numa pasta única.
 */
export class DefectCollector {
  private static instance: DefectCollector;
  readonly evidenceRoot: string;

  private constructor(evidenceRoot: string) {
    this.evidenceRoot = evidenceRoot;
  }

  static get(): DefectCollector {
    if (!DefectCollector.instance) {
      DefectCollector.instance = new DefectCollector(evidenceDir());
    }
    return DefectCollector.instance;
  }

  /** gera o próximo ID com base em quantas pastas BUG-* já existem */
  private async nextId(): Promise<string> {
    await fs.mkdir(this.evidenceRoot, { recursive: true });
    const entries = await fs.readdir(this.evidenceRoot).catch(() => []);
    const nums = entries
      .map((e) => /^BUG-(\d+)$/.exec(e)?.[1])
      .filter(Boolean)
      .map((n) => parseInt(n as string, 10));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `BUG-${String(next).padStart(3, '0')}`;
  }

  /** cria a pasta do defeito e retorna o caminho */
  async createFolder(): Promise<{ id: string; dir: string }> {
    // pequeno retry para evitar colisão de ID em paralelo
    for (let attempt = 0; attempt < 5; attempt++) {
      const id = await this.nextId();
      const dir = path.join(this.evidenceRoot, id);
      try {
        await fs.mkdir(dir, { recursive: false });
        return { id, dir };
      } catch {
        // colidiu, tenta de novo
      }
    }
    const id = `BUG-${Date.now()}`;
    const dir = path.join(this.evidenceRoot, id);
    await fs.mkdir(dir, { recursive: true });
    return { id, dir };
  }

  /** grava o defect.json na pasta */
  async persist(defect: Defect, dir: string): Promise<void> {
    await fs.writeFile(path.join(dir, 'defect.json'), JSON.stringify(defect, null, 2), 'utf-8');
  }

  /** lê todos os defeitos persistidos, ordenados por severidade */
  async readAll(): Promise<Defect[]> {
    const entries = await fs.readdir(this.evidenceRoot).catch(() => []);
    const defects: Defect[] = [];
    for (const e of entries) {
      const file = path.join(this.evidenceRoot, e, 'defect.json');
      try {
        const raw = await fs.readFile(file, 'utf-8');
        defects.push(JSON.parse(raw) as Defect);
      } catch {
        /* pasta sem defect.json, ignora */
      }
    }
    return defects.sort(
      (a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity] || a.id.localeCompare(b.id),
    );
  }
}
