import type { Locator } from '@playwright/test';
import { BasePage } from './base.page.js';

export interface MenuLink {
  label: string;
  href: string | null;
  visible: boolean;
}

/**
 * Page Object da navegação principal e rodapé.
 * Lê dinamicamente o que está renderizado — não confia em texto fixo —
 * para que a comparação entre locales seja sobre o estado REAL da página.
 */
export class HeaderPage extends BasePage {
  get header(): Locator {
    return this.page.locator('header, nav').first();
  }

  /** extrai todos os itens de menu principais visíveis */
  async mainMenu(): Promise<MenuLink[]> {
    return this.page.evaluate(() => {
      const root = document.querySelector('header') ?? document.querySelector('nav');
      if (!root) return [];
      const anchors = Array.from(root.querySelectorAll('a, [role="menuitem"], button'));
      const items: { label: string; href: string | null; visible: boolean }[] = [];
      for (const el of anchors) {
        const label = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (!label || label.length > 60) continue;
        const href = el.getAttribute('href');
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el as HTMLElement);
        const visible = rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
        items.push({ label, href, visible });
      }
      // dedup por label
      const seen = new Set<string>();
      return items.filter((i) => (seen.has(i.label) ? false : (seen.add(i.label), true)));
    });
  }

  /**
   * Itens de menu SEM destino (links mortos) — só inspeciona <a> e [role="menuitem"],
   * pois <button> legitimamente não tem href (dispara JS/modal/dropdown).
   * Falso positivo: incluir <button> fazia todo CTA virar "morto".
   */
  async deadMenuItems(): Promise<MenuLink[]> {
    return this.page.evaluate(() => {
      const root = document.querySelector('header') ?? document.querySelector('nav');
      if (!root) return [] as { label: string; href: string | null; visible: boolean }[];
      const seen = new Set<string>();
      return Array.from(root.querySelectorAll<HTMLElement>('a, [role="menuitem"]'))
        .map((el) => {
          const label = (el.textContent || '').replace(/\s+/g, ' ').trim();
          const href = el.getAttribute('href');
          const rect = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          const visible =
            rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
          return { label, href, visible };
        })
        .filter(({ label, visible, href }) => {
          if (!label || label.length > 60 || !visible) return false;
          if (seen.has(label)) return false;
          seen.add(label);
          return href === null || href === '' || href === '#';
        });
    });
  }

  /** links do rodapé */
  async footerLinks(): Promise<{ label: string; href: string }[]> {
    return this.page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (!footer) return [];
      return Array.from(footer.querySelectorAll<HTMLAnchorElement>('a[href]'))
        .map((a) => ({ label: (a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 80), href: a.href }))
        .filter((x) => x.href);
    });
  }

  /** seletor de idioma (bandeiras) */
  get localeSwitcher(): Locator {
    return this.page.locator('a[href*="/br/"], a[href*="/us/"], a[href*="/es/"]').filter({ has: this.page.locator('img') });
  }
}
