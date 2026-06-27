import type { Page } from '@playwright/test';
import { DETECTION_RULES } from '../config/detection-rules.js';

export interface PerfResult {
  url: string;
  loadMs: number;
  slow: boolean;
  infiniteLoader: boolean;
  loaderSelector?: string;
}

/**
 * Mede performance VISÍVEL — nada de métricas internas profundas.
 * - tempo até a página ficar utilizável (load + networkidle best-effort)
 * - detecção de loader que nunca some (loop de carregamento)
 */
export class VisiblePerformance {
  /** seletores comuns de spinner/loader */
  private static LOADER_SELECTORS = [
    '[class*="loader"]',
    '[class*="spinner"]',
    '[class*="loading"]',
    '[aria-busy="true"]',
    '.skeleton',
  ];

  static async measure(page: Page, url: string): Promise<PerfResult> {
    const start = Date.now();
    let slow = false;

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(() => {
      slow = true;
    });

    // espera best-effort por estabilidade da rede
    await page.waitForLoadState('networkidle', { timeout: DETECTION_RULES.slowPageThresholdMs }).catch(() => {
      slow = true;
    });

    const loadMs = Date.now() - start;
    if (loadMs > DETECTION_RULES.slowPageThresholdMs) slow = true;

    // loader infinito: existe um loader ainda visível depois do timeout?
    let infiniteLoader = false;
    let loaderSelector: string | undefined;
    for (const sel of this.LOADER_SELECTORS) {
      const loc = page.locator(sel).first();
      const count = await loc.count().catch(() => 0);
      if (count > 0) {
        const stillVisible = await loc
          .waitFor({ state: 'hidden', timeout: DETECTION_RULES.loaderTimeoutMs })
          .then(() => false)
          .catch(() => true);
        if (stillVisible && (await loc.isVisible().catch(() => false))) {
          infiniteLoader = true;
          loaderSelector = sel;
          break;
        }
      }
    }

    return { url, loadMs, slow, infiniteLoader, loaderSelector };
  }

  /** espera um elemento "que deveria aparecer" e diz se ele nunca apareceu */
  static async expectVisibleOrFail(page: Page, selector: string, timeout = 10000): Promise<boolean> {
    return page
      .locator(selector)
      .first()
      .waitFor({ state: 'visible', timeout })
      .then(() => true)
      .catch(() => false);
  }
}
