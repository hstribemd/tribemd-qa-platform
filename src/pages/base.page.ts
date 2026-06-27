import type { Page } from '@playwright/test';
import { BASE_URL } from '../config/locales.js';

export abstract class BasePage {
  constructor(protected page: Page) {}

  url(path = ''): string {
    return `${BASE_URL}${path}`;
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(this.url(path), { waitUntil: 'domcontentloaded' });
  }

  async acceptCookiesIfPresent(): Promise<void> {
    // tenta dispensar banner de cookies, que costuma cobrir elementos (causa de "sobreposição")
    const candidates = [
      'button:has-text("Aceitar")',
      'button:has-text("Accept")',
      'button:has-text("Aceptar")',
      '[id*="cookie"] button',
      '[class*="cookie"] button',
    ];
    for (const sel of candidates) {
      const loc = this.page.locator(sel).first();
      if (await loc.isVisible().catch(() => false)) {
        await loc.click().catch(() => undefined);
        return;
      }
    }
  }
}
