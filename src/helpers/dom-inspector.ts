import type { Page } from '@playwright/test';
import { DETECTION_RULES } from '../config/detection-rules.js';

export interface OverflowHit {
  text: string;
  selector: string;
}
export interface InvisibleHit {
  text: string;
  selector: string;
  reason: string;
}
export interface OverlapHit {
  a: string;
  b: string;
}
export interface BrokenImageHit {
  src: string;
  alt: string;
}
export interface LeakedTextHit {
  text: string;
  selector: string;
}

/**
 * Helpers que rodam dentro do browser para achar problemas VISÍVEIS.
 * Tudo é medido pelo que o usuário enxerga (bounding boxes, visibilidade real).
 */
export const DomInspector = {
  /** texto cortado: elemento com overflow horizontal escondendo conteúdo */
  async findTruncatedText(page: Page): Promise<OverflowHit[]> {
    const threshold = DETECTION_RULES.overflow.horizontalOverflowPx;
    return page.evaluate((thr) => {
      const hits: { text: string; selector: string }[] = [];
      const els = Array.from(document.querySelectorAll<HTMLElement>('h1,h2,h3,h4,p,span,a,button,li,td'));
      for (const el of els) {
        const style = getComputedStyle(el);
        const clipped = style.overflow === 'hidden' || style.textOverflow === 'ellipsis';
        const overflowing = el.scrollWidth - el.clientWidth > thr;
        const rect = el.getBoundingClientRect();
        if (clipped && overflowing && rect.width > 0 && rect.height > 0 && el.innerText.trim()) {
          hits.push({
            text: el.innerText.trim().slice(0, 120),
            selector: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''),
          });
        }
      }
      return hits.slice(0, 30);
    }, threshold);
  },

  /** componentes invisíveis: tem conteúdo mas área zero / display none herdado / opacity 0 */
  async findInvisibleComponents(page: Page): Promise<InvisibleHit[]> {
    return page.evaluate(() => {
      const hits: { text: string; selector: string; reason: string }[] = [];
      const candidates = Array.from(
        document.querySelectorAll<HTMLElement>('[class*="card"],[class*="banner"],[class*="hero"],section,article'),
      );
      for (const el of candidates) {
        if (!el.innerText.trim() && el.querySelectorAll('img').length === 0) continue;
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        let reason = '';
        if (style.display === 'none') reason = 'display:none';
        else if (style.visibility === 'hidden') reason = 'visibility:hidden';
        else if (parseFloat(style.opacity) === 0) reason = 'opacity:0';
        else if (rect.height === 0 && rect.width > 0) reason = 'altura zero (conteúdo colapsado)';
        if (reason) {
          hits.push({
            text: (el.innerText.trim() || '[bloco com imagem]').slice(0, 80),
            selector: el.tagName.toLowerCase() + (el.className ? `.${String(el.className).split(' ')[0]}` : ''),
            reason,
          });
        }
      }
      return hits.slice(0, 20);
    });
  },

  /** sobreposição: elementos interativos cujo centro é coberto por outro elemento */
  async findOverlaps(page: Page): Promise<OverlapHit[]> {
    return page.evaluate(() => {
      const hits: { a: string; b: string }[] = [];
      const interactive = Array.from(document.querySelectorAll<HTMLElement>('a,button,input,select')).slice(0, 80);
      for (const el of interactive) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) continue;
        const top = document.elementFromPoint(cx, cy);
        if (top && top !== el && !el.contains(top) && !top.contains(el)) {
          const label = (e: Element) =>
            e.tagName.toLowerCase() + (e.textContent?.trim().slice(0, 30) ? `("${e.textContent.trim().slice(0, 30)}")` : '');
          hits.push({ a: label(el), b: label(top) });
        }
      }
      return hits.slice(0, 15);
    });
  },

  /** imagens que não carregam (naturalWidth 0 mas deveriam ter pixels) */
  async findBrokenImages(page: Page): Promise<BrokenImageHit[]> {
    return page.evaluate(() => {
      const hits: { src: string; alt: string }[] = [];
      const imgs = Array.from(document.images);
      for (const img of imgs) {
        const rect = img.getBoundingClientRect();
        const shouldShow = rect.width > 2 && rect.height > 2;
        const failed = img.complete && img.naturalWidth === 0;
        if (shouldShow && failed) hits.push({ src: img.currentSrc || img.src, alt: img.alt });
      }
      return hits;
    });
  },

  /** texto de template vazado para a UI (ex.: "Início } -->") */
  async findLeakedTemplate(page: Page, patterns: RegExp[]): Promise<LeakedTextHit[]> {
    const serial = patterns.map((p) => p.source);
    return page.evaluate((sources) => {
      const regs = sources.map((s) => new RegExp(s));
      const hits: { text: string; selector: string }[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const txt = node.textContent?.trim() ?? '';
        if (!txt) continue;
        const parent = node.parentElement;
        if (!parent) continue;
        const r = parent.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue; // só o que é visível
        if (regs.some((re) => re.test(txt))) {
          hits.push({
            text: txt.slice(0, 100),
            selector: parent.tagName.toLowerCase() + (parent.className ? `.${String(parent.className).split(' ')[0]}` : ''),
          });
        }
      }
      // dedup
      const seen = new Set<string>();
      return hits.filter((h) => (seen.has(h.text) ? false : (seen.add(h.text), true))).slice(0, 20);
    }, serial);
  },

  /** texto visível inteiro da página, para análise de idioma */
  async visibleText(page: Page): Promise<string> {
    try {
      return await page.evaluate(() => document.body?.innerText.replace(/\s+/g, ' ').trim() ?? '');
    } catch {
      // contexto pode ter sido destruído por uma navegação/redirect em andamento
      return '';
    }
  },

  /** página em branco: corpo praticamente sem conteúdo visível */
  async isBlankPage(page: Page): Promise<boolean> {
    try {
      return await page.evaluate(() => {
        const text = document.body?.innerText.replace(/\s+/g, '').trim() ?? '';
      const visibleImgs = Array.from(document.images).filter((i) => {
        const r = i.getBoundingClientRect();
        return r.width > 4 && r.height > 4;
      });
      return text.length < 20 && visibleImgs.length === 0;
      });
    } catch {
      return false; // contexto destruído por navegação; não tratamos como branco
    }
  },
};
