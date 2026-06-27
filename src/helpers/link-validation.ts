import type { APIRequestContext } from '@playwright/test';
import { BASE_URL } from '../config/locales.js';

/**
 * Validacao de links compartilhada entre o crawler (navigation.spec) e o teste
 * de header/rodape (clickables.spec). Centralizar aqui garante a MESMA regra de
 * "o que conta como quebrado" em todo lugar.
 *
 * Filosofia anti-falso-positivo:
 *  - Statuses de WAF/anti-bot ou metodo (401/403/405/406/429/501) sao tolerados:
 *    no navegador real o usuario costuma passar; nao acusamos.
 *  - Erro de rede/timeout e INCONCLUSIVO (ok=true): pode ser instabilidade
 *    momentanea de um terceiro; nao viramos isso em defeito.
 *  - So 4xx/5xx "de verdade" (404, 410, 400, 5xx...) contam como quebra.
 */

export const TOLERATED_STATUS = [401, 403, 405, 406, 429, 501];

// Protocolos nao-navegaveis e acoes destrutivas (logout encerraria a sessao).
export const SKIP_HREF = /^(mailto:|tel:|sms:|javascript:|whatsapp:)/i;
export const SKIP_URL = /wa\.me|api\.whatsapp|\/logout|\/log-?out|\/sign-?out|\/sair|\/salir/i;
export const SKIP_LABEL = /sair|logout|log\s?out|cerrar sesi[oó]n|encerrar sess[aã]o|deslogar|salir/i;

// Paths que nao existem intencionalmente em determinados locales.
// /us/connect e /es/connect nao existem no TribeMD — o seletor de idioma
// em /br/connect gera esses links mas as paginas nao foram criadas.
const KNOWN_MISSING_PATHS = ['/us/connect', '/es/connect'];

export interface UrlCheck {
  status: number | 'error';
  ok: boolean;
}

/** remove o hash (#secao) para deduplicar a mesma URL */
export function stripHash(url: string): string {
  try {
    const u = new URL(url);
    u.hash = '';
    return u.toString();
  } catch {
    return url;
  }
}

export function isExternal(url: string): boolean {
  try {
    return new URL(url).host !== new URL(BASE_URL).host;
  } catch {
    return false;
  }
}

/** true para o que nao deve ser checado: nao-http, ancora pura, logout, paths sem pagina, etc. */
export function shouldSkipUrl(url: string): boolean {
  if (!url || url === '#') return true;
  if (SKIP_URL.test(url)) return true;
  if (!/^https?:/i.test(url)) return true;
  try {
    const pathname = new URL(url).pathname.replace(/\/$/, '');
    if (KNOWN_MISSING_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) return true;
  } catch {}
  return false;
}

export async function checkUrl(request: APIRequestContext, url: string): Promise<UrlCheck> {
  try {
    const res = await request.get(url, { timeout: 20_000, maxRedirects: 5 });
    const s = res.status();
    return { status: s, ok: s < 400 || TOLERATED_STATUS.includes(s) };
  } catch {
    return { status: 'error', ok: true };
  }
}

/** valida muitas URLs com concorrencia limitada; devolve mapa url -> resultado */
export async function checkMany(
  request: APIRequestContext,
  urls: string[],
  concurrency = 10,
  onProgress?: (done: number, total: number, lastUrl: string) => void,
): Promise<Map<string, UrlCheck>> {
  const out = new Map<string, UrlCheck>();
  let i = 0;
  let done = 0;
  const total = urls.length;
  const worker = async (): Promise<void> => {
    while (i < total) {
      const u = urls[i++];
      out.set(u, await checkUrl(request, u));
      done++;
      if (onProgress) onProgress(done, total, u);
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, total || 1) }, worker));
  return out;
}
