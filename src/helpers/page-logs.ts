import type { Page, ConsoleMessage, Request } from '@playwright/test';
import { DETECTION_RULES } from '../config/detection-rules.js';

/**
 * Anexa coletores de log a uma página. Filtramos ruído de terceiros desde já,
 * para manter as evidências limpas e focadas no que é do produto.
 */
export class PageLogs {
  readonly console: string[] = [];
  readonly failedRequests: string[] = [];

  attach(page: Page): void {
    page.on('console', (msg: ConsoleMessage) => {
      // guardamos só errors/warnings, e descartamos terceiros
      const type = msg.type();
      if (type !== 'error' && type !== 'warning') return;
      const text = msg.text();
      if (this.isThirdParty(text)) return;
      this.console.push(`[${type}] ${text}`);
    });

    page.on('requestfailed', (req: Request) => {
      const url = req.url();
      if (this.isThirdParty(url)) return;
      this.failedRequests.push(`${req.failure()?.errorText ?? 'failed'} ${url}`);
    });
  }

  private isThirdParty(text: string): boolean {
    return DETECTION_RULES.ignore.thirdPartyDomains.some((d) => text.includes(d));
  }

  /** logs combinados para anexar à evidência */
  all(): string[] {
    const out: string[] = [];
    if (this.console.length) out.push('=== CONSOLE (errors/warnings, produto) ===', ...this.console);
    if (this.failedRequests.length) out.push('', '=== REQUESTS FALHADAS (produto) ===', ...this.failedRequests);
    return out;
  }
}
