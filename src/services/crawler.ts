import type { Page } from '@playwright/test';

export interface CrawlOptions {
  maxDepth: number;
  maxPages: number;
  /** só segue URLs cujo pathname começa com este prefixo (ex.: /br) */
  scopePrefix: string;
  origin: string;
}

export interface CrawledPage {
  url: string;
  depth: number;
  fromUrl: string | null;
  /** prioridade herdada do link que levou a esta página (maior = visita antes) */
  priority: number;
}

export type LinkRegion = 'nav' | 'content' | 'footer' | 'other';

export interface DiscoveredLink {
  url: string;
  sourceUrl: string;
  text: string;
  external: boolean;
  /** de qual região da página o link veio (usado para priorizar o crawl) */
  region: LinkRegion;
}

/**
 * Pontua a relevância de um link para o USUÁRIO típico.
 * Princípio: detectar problema na jornada de maior tráfego vale mais que
 * cobrir uma página de rodapé que quase ninguém visita. Não é sobre cobertura.
 */
export function linkPriority(link: DiscoveredLink): number {
  let score = 0;
  if (link.region === 'nav') score += 100; // menu principal: primeira coisa que o usuário usa
  else if (link.region === 'content') score += 60; // conteúdo/cards do corpo
  else if (link.region === 'footer') score += 10; // institucional/rodapé: baixa prioridade
  // sinais textuais de seções de alto tráfego deste produto
  if (/notícia|news|conte[úu]do|content|evento|event|curso|course|cobertura/i.test(link.text)) score += 25;
  // sinais de páginas institucionais de baixo tráfego
  if (/pol[íi]tica|privacidade|privacy|termos|terms|cookie|[ée]tica|ethics|faq|pergunta/i.test(link.text)) score -= 15;
  return score;
}

/**
 * Crawler com priorização orientada ao usuário:
 * - profundidade configurável e limite de páginas
 * - normalização de URL (remove hash, trailing dedup) para evitar loops
 * - escopo por prefixo de locale (não sai do /br ao crawl do BR)
 * - ORDEM DE VISITA: profundidade primeiro (proximidade da home), e dentro da
 *   mesma profundidade, maior prioridade primeiro (nav/conteúdo antes de rodapé).
 *   Assim, sob um teto de páginas, gastamos o orçamento onde o usuário vai.
 */
export class Crawler {
  private visited = new Set<string>();
  readonly pages: CrawledPage[] = [];
  readonly allLinks: DiscoveredLink[] = [];

  constructor(private opts: CrawlOptions) {}

  private normalize(raw: string): string | null {
    try {
      const u = new URL(raw, this.opts.origin);
      u.hash = '';
      // remove parâmetros de rastreamento que não mudam o conteúdo da página
      const TRACKING = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','fbclid','gclid','ref','source','mc_cid','mc_eid'];
      TRACKING.forEach((p) => u.searchParams.delete(p));
      // se ficou sem query params, remove o ? residual
      return u.toString();
    } catch {
      return null;
    }
  }

  private inScope(url: string): boolean {
    try {
      const u = new URL(url);
      return u.origin === new URL(this.opts.origin).origin && u.pathname.startsWith(this.opts.scopePrefix);
    } catch {
      return false;
    }
  }

  /**
   * Executa o crawl. `loadAndExtract` recebe uma URL, navega e devolve os links
   * encontrados na página (a navegação real fica a cargo do chamador, que tem o Page).
   */
  async crawl(
    startUrl: string,
    loadAndExtract: (url: string) => Promise<DiscoveredLink[]>,
  ): Promise<void> {
    const start = this.normalize(startUrl);
    if (!start) return;
    const queue: CrawledPage[] = [{ url: start, depth: 0, fromUrl: null, priority: 1000 }];

    // ordena a fila: menor profundidade primeiro; empate -> maior prioridade
    const sortQueue = () =>
      queue.sort((a, b) => a.depth - b.depth || b.priority - a.priority);

    while (queue.length && this.pages.length < this.opts.maxPages) {
      sortQueue();
      const current = queue.shift()!;
      if (this.visited.has(current.url)) continue;
      this.visited.add(current.url);
      this.pages.push(current);

      let links: DiscoveredLink[] = [];
      try {
        links = await loadAndExtract(current.url);
      } catch {
        continue;
      }
      this.allLinks.push(...links);

      if (current.depth >= this.opts.maxDepth) continue;
      for (const link of links) {
        const norm = this.normalize(link.url);
        if (!norm || link.external || !this.inScope(norm) || this.visited.has(norm)) continue;
        const existing = queue.find((q) => q.url === norm);
        const priority = linkPriority(link);
        if (existing) {
          // se já está na fila, mantém a maior prioridade observada
          existing.priority = Math.max(existing.priority, priority);
          continue;
        }
        queue.push({ url: norm, depth: current.depth + 1, fromUrl: current.url, priority });
      }
    }
  }
}

/** extrai todos os links visíveis do DOM atual, marcando a região de origem */
export async function extractLinks(page: Page, origin: string): Promise<DiscoveredLink[]> {
  const raw = await page.evaluate(() => {
    function regionOf(el: Element): 'nav' | 'content' | 'footer' | 'other' {
      let n: Element | null = el;
      while (n) {
        const tag = n.tagName?.toLowerCase();
        if (tag === 'footer') return 'footer';
        if (tag === 'nav' || tag === 'header') return 'nav';
        if (tag === 'main' || tag === 'article') return 'content';
        const role = n.getAttribute?.('role');
        if (role === 'navigation') return 'nav';
        if (role === 'contentinfo') return 'footer';
        if (role === 'main') return 'content';
        n = n.parentElement;
      }
      return 'other';
    }
    return Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]')).map((a) => ({
      href: a.getAttribute('href') ?? '',
      text: (a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 80),
      region: regionOf(a),
    }));
  });
  const out: DiscoveredLink[] = [];
  for (const r of raw) {
    if (!r.href || /^(javascript:|#|mailto:|tel:)/i.test(r.href)) continue;
    let abs: string;
    try {
      abs = new URL(r.href, page.url()).toString();
    } catch {
      continue;
    }
    const external = new URL(abs).origin !== new URL(origin).origin;
    out.push({ url: abs, sourceUrl: page.url(), text: r.text, external, region: r.region });
  }
  return out;
}
