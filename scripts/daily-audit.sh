#!/usr/bin/env bash
# =============================================================
#  TribeMD QA — Auditoria Diária Automatizada
#
#  Executa a suite completa autenticada para o locale BR:
#    1. Carrega .env com credenciais do Keycloak
#    2. Faz login real clicando em "Entrar"
#    3. Crawla todo o site com a sessão logada (links descobertos no próprio site)
#    4. Valida: header (botões mortos), links (internos e externos),
#       imagens quebradas, páginas lentas, templates vazados
#    5. Gera relatório HTML + dashboard JSON em reports/
#
#  Log diário em: logs/daily-YYYY-MM-DD.log
# =============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$PROJECT_DIR/logs"
DATE="$(date +%Y-%m-%d)"
LOGFILE="$LOG_DIR/daily-$DATE.log"

# garante dir de logs
mkdir -p "$LOG_DIR"

# encaminha tudo (stdout + stderr) para o log e para o terminal
exec > >(tee -a "$LOGFILE") 2>&1

echo "============================================================"
echo " TribeMD QA — Auditoria Diária BR · US · ES"
echo " Início: $(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================================"

cd "$PROJECT_DIR"

# Locale desta auditoria — exportado globalmente para que TANTO os testes
# QUANTO o gerador de relatório usem o mesmo subdiretório (evidencias/br,
# reports/br). Sem isso, `npm run report:all` não encontra as evidências.
export QA_LOCALE="${QA_LOCALE:-br}"

# carrega variáveis de ambiente (credenciais + config)
# Usa export explícito para evitar problemas com regex e seletores CSS no source
if [ -f .env ]; then
  while IFS= read -r line || [ -n "$line" ]; do
    # ignora linhas em branco e comentários
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ -z "${line//[[:space:]]/}" ]] && continue
    # extrai KEY=VALUE e exporta
    if [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)=(.*) ]]; then
      key="${BASH_REMATCH[1]}"
      val="${BASH_REMATCH[2]}"
      export "$key=$val"
    fi
  done < .env
  echo "[ok] .env carregado"
else
  echo "[ERRO] Arquivo .env não encontrado em $PROJECT_DIR"
  echo "       Copie .env.example para .env e preencha AUTH_USER e AUTH_PASS"
  exit 1
fi

# verifica credenciais mínimas
if [ -z "${AUTH_USER:-}" ] || [ -z "${AUTH_PASS:-}" ]; then
  echo "[ERRO] AUTH_USER e/ou AUTH_PASS não definidos no .env"
  exit 1
fi

echo "[ok] Credenciais: $AUTH_USER"

# garante que o Node/npm está acessível (nvm, volta, brew, etc.)
export PATH="$HOME/.nvm/versions/node/$(ls "$HOME/.nvm/versions/node" 2>/dev/null | sort -V | tail -1)/bin:$PATH"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

echo "[info] Node: $(node --version 2>/dev/null || echo 'não encontrado')"
echo "[info] NPM:  $(npm --version 2>/dev/null || echo 'não encontrado')"

# Locales auditados nesta rodada. Cada um roda numa execução PRÓPRIA e grava
# em reports/<locale> + evidencias/<locale> (isolamento via QA_LOCALE), para
# que BR não sobrescreva US/ES. Sobrescreva com:  QA_LOCALES="br us" bash ...
QA_LOCALES="${QA_LOCALES:-br us es}"

# limpa artefatos antigos para não acumular lixo
echo ""
echo "--- Limpando artefatos anteriores ---"
rm -rf allure-results test-results .auth reports evidencias
mkdir -p .auth

OVERALL_EXIT=0
for LOCALE in $QA_LOCALES; do
  echo ""
  echo "============================================================"
  echo " Locale: $(echo "$LOCALE" | tr 'a-z' 'A-Z')  ($(date '+%H:%M:%S'))"
  echo "============================================================"

  # auth.setup grava storageState por locale; limpa entre locales para garantir
  # login limpo a cada execução.
  rm -rf .auth allure-results
  mkdir -p .auth

  EXIT_CODE=0
  # Roda local: usa o cap padrao do crawler (CRAWL_MAX_PAGES=400) pra nao pesar a
  # maquina. Para varrer o SITE INTEIRO, exporte CRAWL_MAX_PAGES=0 (idealmente no
  # CI, que tem maquina dedicada). Tudo num viewport so (link nao depende de tela).
  QA_LOCALE="$LOCALE" \
  QA_AUTH=1 \
  SKIP_SNAPSHOTS=1 \
  CRAWL_MAX_PAGES="${CRAWL_MAX_PAGES:-400}" \
  npx playwright test \
    tests/regression/navigation.spec.ts \
    tests/regression/clickables.spec.ts \
    tests/regression/user-journey.spec.ts \
    tests/regression/content-health.spec.ts \
    tests/visual/responsive.spec.ts \
    tests/authenticated/protected-routes.spec.ts \
    --project=desktop-chromium \
    --reporter=list \
    || EXIT_CODE=$?

  echo ""
  echo "--- Gerando relatório ($LOCALE) ---"
  QA_LOCALE="$LOCALE" npx tsx scripts/generate-dashboard.mts || true

  if [ "$EXIT_CODE" -ne 0 ]; then
    OVERALL_EXIT="$EXIT_CODE"
    echo "[locale $LOCALE] FALHOU (exit $EXIT_CODE)"
  else
    echo "[locale $LOCALE] PASSOU"
  fi
done

echo ""
echo "--- Gerando dashboard unificado (BR + US + ES) ---"
npm run report:unified || echo "[aviso] Falha ao gerar dashboard unificado"

# Empacota um único .zip pronto para enviar (dashboards + evidências dos 3
# locales). Screenshots já vêm embutidos no HTML; o zip preserva vídeos e o
# "HTML da página" que ficam como links relativos.
echo ""
echo "--- Empacotando relatório para compartilhar ---"
SHARE_ZIP="$PROJECT_DIR/reports/tribemd-qa-$DATE.zip"
( cd "$PROJECT_DIR" && rm -f "$SHARE_ZIP" \
    && zip -r -q "$SHARE_ZIP" reports evidencias -x "*.zip" ) \
    && echo "[ok] Pacote: $SHARE_ZIP" \
    || echo "[aviso] Falha ao gerar o zip (relatórios individuais seguem em reports/)"

echo ""
echo "--- Publicando resultados no GitHub Pages ---"
bash "$SCRIPT_DIR/publish-gh-pages.sh" || echo "[aviso] Publicação falhou — relatórios locais continuam disponíveis"

echo ""
echo "============================================================"
if [ "$OVERALL_EXIT" -eq 0 ]; then
  echo " RESULTADO: PASSOU — nenhum defeito Critical/High em ($QA_LOCALES)"
else
  echo " RESULTADO: FALHOU (exit $OVERALL_EXIT) — verifique defeitos em reports/"
fi
echo " Fim: $(date '+%Y-%m-%d %H:%M:%S')"
echo " Dashboard unificado: $PROJECT_DIR/reports/index.html"
for LOCALE in $QA_LOCALES; do
  echo " Dashboard $LOCALE:   $PROJECT_DIR/reports/$LOCALE/dashboard.html"
done
echo " Pacote p/ enviar: $SHARE_ZIP"
echo " Log completo:     $LOGFILE"
echo "============================================================"

exit "$OVERALL_EXIT"
