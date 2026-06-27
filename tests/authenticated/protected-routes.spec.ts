import { test, expect } from '@playwright/test';
import { BASE_URL } from '../../src/config/locales.js';
import { authConfig, authConfigured } from '../../src/config/auth.js';

/**
 * Caso 1 — Regressao da AREA AUTENTICADA (pos-login Keycloak).
 *
 * Roda no projeto 'authenticated', que injeta o storageState salvo pelo
 * auth.setup.ts. Sem credenciais, e pulado.
 *
 * Diferente da suite publica: aqui garantimos primeiro que NAO fomos jogados de
 * volta para o login (sessao expirada) e so entao validamos o conteudo.
 *
 * Defina as rotas logadas em AUTH_ROUTES (separadas por virgula). Os caminhos
 * sao relativos ao site publico (BASE_URL), ex.:
 *   AUTH_ROUTES="/br/perfil/19/,/br/connect/"
 */
const cfg = authConfig();
const routes = (process.env.AUTH_ROUTES ?? '/')
  .split(',')
  .map((r) => r.trim())
  .filter(Boolean);

test.describe('Area autenticada', () => {
  test.skip(!authConfigured(), 'Credenciais AUTH_* nao configuradas.');

  for (const route of routes) {
    test(`rota logada acessivel: ${route}`, async ({ page }) => {
      const resp = await page.goto(new URL(route, BASE_URL).toString(), {
        waitUntil: 'domcontentloaded',
      });

      // nao deve ter sido redirecionado de volta ao Keycloak (sessao perdida)
      expect(page.url(), 'redirecionado para o login — sessao invalida').not.toContain(cfg.authHost);

      // status HTTP valido
      const status = resp?.status() ?? 0;
      expect(status, `a rota ${route} respondeu ${status}`).toBeLessThan(400);

      // elemento de "logado" presente (confirma sessao ativa)
      await expect(page.locator(cfg.loggedInSelector)).toBeVisible({ timeout: 15_000 });
    });
  }
});
