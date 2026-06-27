/**
 * Configuracao da autenticacao via Keycloak (fluxo OIDC do TribeMD).
 *
 * Fluxo real: clicar em "Entrar" no site publico (tribemd.com/<locale>)
 * redireciona para auth.tribemd.com (realm TribeMD), e apos o login o Keycloak
 * devolve para o proprio site publico ja autenticado. Ou seja, o site logado e
 * deslogado e o MESMO; muda so a sessao. Por isso a automacao loga e depois
 * navega/crawla o proprio site publico com a sessao injetada.
 *
 * Tudo vem de variaveis de ambiente — nenhuma credencial fica no codigo.
 * Preencha um .env (NAO versionado) ou use secrets no CI:
 *
 *   AUTH_USER   e-mail da conta de TESTE dedicada (nunca a conta pessoal real)
 *   AUTH_PASS   senha da conta de teste
 *
 * O ponto de entrada do login e o proprio site (botao "Entrar"); nao montamos a
 * URL do Keycloak na mao — deixamos o site disparar o redirect, como o usuario.
 */
export interface AuthConfig {
  user: string;
  pass: string;
  /** seletor do botao/link "Entrar" no site publico que dispara o login */
  loginTrigger: string;
  /** seletores do formulario no auth.tribemd.com (Keycloak) */
  selectors: { user: string; pass: string; submit: string };
  /** host do Keycloak — usado para detectar "estou na tela de login" */
  authHost: string;
  /** seletor de elemento que so existe QUANDO logado (confirma sucesso) */
  loggedInSelector: string;
}

export function authConfig(): AuthConfig {
  return {
    user: process.env.AUTH_USER ?? '',
    pass: process.env.AUTH_PASS ?? '',
    loginTrigger: process.env.AUTH_LOGIN_TRIGGER ?? 'text=/entrar|login|acessar/i',
    selectors: {
      // Keycloak por padrao usa #username mesmo quando o label e "E-mail".
      user: process.env.AUTH_USER_SELECTOR ?? '#username',
      pass: process.env.AUTH_PASS_SELECTOR ?? '#password',
      // TribeMD usa tema Keycloak customizado: botão é "Fazer login" (não #kc-login padrão)
      submit: process.env.AUTH_SUBMIT_SELECTOR ?? 'button:has-text("Fazer login"), #kc-login, input[type="submit"]',
    },
    authHost: process.env.AUTH_HOST ?? 'auth.tribemd.com',
    loggedInSelector: process.env.AUTH_LOGGEDIN_SELECTOR ?? '[data-testid="user-menu"]',
  };
}

/** true somente quando ha credenciais minimas para tentar o login. */
export function authConfigured(): boolean {
  const c = authConfig();
  return Boolean(c.user && c.pass);
}

/** caminho do storageState (sessao salva) para o locale corrente. */
export function authStatePath(): string {
  const loc = (process.env.QA_LOCALE ?? 'default').toLowerCase().trim();
  return `.auth/state-${loc}.json`;
}
