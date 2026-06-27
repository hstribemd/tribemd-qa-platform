import { test as setup, expect } from '@playwright/test';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { BASE_URL, LOCALES, type LocaleCode } from '../src/config/locales.js';
import { authConfig, authConfigured, authStatePath } from '../src/config/auth.js';

/**
 * Login project: faz o login REAL como o usuario faria — abre o site publico,
 * clica em "Entrar", e o site redireciona para o Keycloak (auth.tribemd.com).
 * Preenche e-mail + senha, volta para o site ja autenticado e salva a sessao
 * (storageState) para a suite publica reusar e crawlar o site LOGADO.
 *
 * Sem credenciais (AUTH_*), o setup e pulado e a suite roda anonima.
 */
setup('login keycloak no site publico', async ({ page }) => {
  setup.skip(!authConfigured(), 'AUTH_USER / AUTH_PASS nao configurados — site sera testado anonimo.');

  const cfg = authConfig();
  const code = ((process.env.QA_LOCALE ?? 'br').toLowerCase().trim()) as LocaleCode;
  const locale = LOCALES[code] ?? LOCALES.br;

  // 1) abre o site publico no locale
  await page.goto(`${BASE_URL}${locale.basePath}/`, { waitUntil: 'domcontentloaded' });

  // 2) clica em "Entrar" — o site dispara o redirect para o Keycloak
  await page.locator(cfg.loginTrigger).first().click();

  // 3) aguarda chegar na tela do Keycloak
  await page.waitForURL((url) => url.host === cfg.authHost, { timeout: 30_000 });

  // 4) preenche e submete o formulario (e-mail + senha)
  await page.fill(cfg.selectors.user, cfg.user);
  await page.fill(cfg.selectors.pass, cfg.pass);
  // .first() para suportar seletor com múltiplas alternativas separadas por vírgula
  await page.locator(cfg.selectors.submit).first().click();

  // 5) confirma o retorno ao site publico ja logado
  await page.waitForURL((url) => url.host === new URL(BASE_URL).host, { timeout: 30_000 });
  // aguarda a pagina estabilizar (sai do estado de skeleton/loading)
  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => undefined);

  // verifica que o botao "Entrar" sumiu (confirmacao robusta: independe de data-testid)
  const loginButtonGone = await page.locator('text=/^entrar$/i').count() === 0;
  if (!loginButtonGone) {
    // tenta o seletor configuravel como segunda opcao
    await expect(
      page.locator(cfg.loggedInSelector),
      'nao encontrei o elemento de usuario logado — ajuste AUTH_LOGGEDIN_SELECTOR',
    ).toBeVisible({ timeout: 10_000 });
  }

  // 6) salva a sessao
  const statePath = authStatePath();
  await fs.mkdir(path.dirname(statePath), { recursive: true });
  await page.context().storageState({ path: statePath });
});
