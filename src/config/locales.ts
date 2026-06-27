/**
 * Mapa de locales do TribeMD.
 *
 * IMPORTANTE: este mapa foi construído a partir da INSPEÇÃO REAL das três homes
 * (br, us, es) em 2026. Os caminhos de menu divergem por locale — isso NÃO é um
 * bug por si só, mas a base para a comparação de equivalência. A engine de
 * comparação usa a chave canônica (`key`) para casar páginas entre locales e
 * reportar o que está faltando ou divergente.
 */

export type LocaleCode = 'br' | 'us' | 'es';

export interface NavItem {
  /** chave canônica usada para casar a mesma seção entre locales */
  key: string;
  /** rótulo exibido no menu */
  label: string;
  /** href real (pode ser null se for um item de menu SEM link — isso é defeito) */
  href: string | null;
  /** se o destino é externo ao domínio do locale */
  external?: boolean;
}

export interface LocaleConfig {
  code: LocaleCode;
  /** path raiz, ex.: /br */
  basePath: string;
  /** idioma esperado do conteúdo (para detecção de falha de tradução) */
  expectedLang: string;
  ogLocale: string;
  /** itens de menu observados na inspeção real */
  nav: NavItem[];
}

export const BASE_URL = process.env.BASE_URL ?? 'https://tribemd.com';

export const LOCALES: Record<LocaleCode, LocaleConfig> = {
  br: {
    code: 'br',
    basePath: '/br',
    expectedLang: 'pt',
    ogLocale: 'pt_BR',
    nav: [
      { key: 'home', label: 'Início', href: '/br/' },
      { key: 'news', label: 'News', href: '/br/conteudos/' },
      { key: 'education', label: 'Educação', href: '/br/cursos/' },
      { key: 'events', label: 'Eventos', href: '/br/eventos/' },
      { key: 'communities', label: 'Comunidades', href: '/br/connect/' },
      { key: 'records', label: 'Prontuário', href: 'https://assist.tribemd.com/', external: true },
    ],
  },
  us: {
    code: 'us',
    basePath: '/us',
    expectedLang: 'en',
    ogLocale: 'en_US',
    nav: [
      { key: 'home', label: 'Home', href: '/us/' },
      { key: 'news', label: 'News & Perspectives', href: '/us/contents/' },
      { key: 'events', label: 'Events', href: '/us/events/' },
      // Observado na inspeção: rótulo em PT ("Comunidades") num site EN, e destino externo.
      { key: 'communities', label: 'Comunidades', href: 'https://cred.tribemd.com/auth/login', external: true },
    ],
  },
  es: {
    code: 'es',
    basePath: '/es',
    expectedLang: 'es',
    ogLocale: 'es_AR',
    nav: [
      { key: 'home', label: 'Inicio', href: '/es/' },
      { key: 'news', label: 'News', href: '/es/contenidos/' },
      // Observado na inspeção: item de menu SEM href (botão morto).
      { key: 'resources', label: 'Resource Center', href: null },
      { key: 'education', label: 'Cursos', href: 'https://netmd.org/mis-cursos/', external: true },
      { key: 'events', label: 'Eventos', href: '/es/eventos/' },
    ],
  },
};

export const ALL_LOCALES: LocaleCode[] = ['br', 'us', 'es'];

/**
 * Páginas-âncora verificadas por content-health.spec.ts.
 * Conjunto mínimo de alta confiança que cobre as jornadas principais por locale.
 */
export const KNOWN_PAGES: Record<LocaleCode, string[]> = {
  br: ['/br/', '/br/conteudos/', '/br/eventos/', '/br/cursos/', '/br/sobre/', '/br/perguntas-frequentes/'],
  us: ['/us/', '/us/contents/', '/us/events/', '/us/frequently-asked-questions/'],
  es: ['/es/', '/es/contenidos/', '/es/eventos/', '/es/preguntas-frecuentes/'],
};
