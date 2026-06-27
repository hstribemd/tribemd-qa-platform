import { promises as fs } from 'node:fs';
import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import { reportDir, runMetaPath } from '../../helpers/output-paths.js';

/**
 * Reporter que agrega métricas da execução (páginas analisadas, testes
 * executados) lendo as annotations que os testes empurram, e grava
 * reports/run-meta.json para os geradores de relatório consumirem.
 */
export default class MetaReporter implements Reporter {
  private pages = new Set<string>();
  private tests = 0;

  onTestEnd(_test: TestCase, result: TestResult): void {
    this.tests += 1;
    for (const a of result.annotations ?? []) {
      if (a.type === 'page-analyzed' && a.description) this.pages.add(a.description);
      if (a.type === 'explored' && a.description) this.pages.add(a.description);
      if (a.type === 'pages-crawled' && a.description) {
        // soma aproximada de páginas crawladas (registramos como contador separado)
        this.crawled += Number(a.description) || 0;
      }
    }
  }

  private crawled = 0;

  async onEnd(_result: FullResult): Promise<void> {
    await fs.mkdir(reportDir(), { recursive: true });
    const totalPages = this.pages.size + this.crawled;
    await fs.writeFile(
      runMetaPath(),
      JSON.stringify({ pages: totalPages, tests: this.tests }, null, 2),
      'utf-8',
    );
  }
}
