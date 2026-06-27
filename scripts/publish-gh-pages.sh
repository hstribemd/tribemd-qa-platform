#!/usr/bin/env bash
# Publica reports/ no branch gh-pages (GitHub Pages) após a auditoria local.
#
# Funciona clonando o branch gh-pages num diretório temporário, substituindo
# o conteúdo pelos relatórios gerados e fazendo push. Não mexe na branch main.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DATE="$(date +%Y-%m-%d_%H-%M)"

REPORTS_DIR="$PROJECT_DIR/reports"
if [ ! -d "$REPORTS_DIR" ] || [ -z "$(ls -A "$REPORTS_DIR" 2>/dev/null)" ]; then
  echo "[aviso] reports/ vazio — publicação pulada"
  exit 0
fi

REMOTE="$(git -C "$PROJECT_DIR" remote get-url origin 2>/dev/null || echo "")"
if [ -z "$REMOTE" ]; then
  echo "[aviso] Remote git não configurado — publicação pulada"
  echo "        Configure com: git remote set-url origin https://hstribemd:<TOKEN>@github.com/hstribemd/tribemd-qa-platform.git"
  exit 0
fi

TMP_DIR="$(mktemp -d)"
cleanup() { rm -rf "$TMP_DIR"; }
trap cleanup EXIT

echo "[info] Preparando branch gh-pages..."
if git clone --quiet --depth=1 --branch=gh-pages "$REMOTE" "$TMP_DIR" 2>/dev/null; then
  # Branch existente: limpa para não acumular artefatos antigos
  rm -rf "${TMP_DIR:?}"/*
else
  # Primeira publicação: inicializa branch órfão
  git -C "$TMP_DIR" init --quiet
  git -C "$TMP_DIR" remote add origin "$REMOTE"
  git -C "$TMP_DIR" checkout --orphan gh-pages 2>/dev/null || true
fi

# Copia todos os relatórios gerados
cp -r "$REPORTS_DIR/." "$TMP_DIR/"

git -C "$TMP_DIR" add -A

if git -C "$TMP_DIR" diff --cached --quiet 2>/dev/null; then
  echo "[info] Dashboard já está atualizado — nada a publicar"
  exit 0
fi

git -C "$TMP_DIR" \
  -c user.name="TribeMD QA Bot" \
  -c user.email="qa-bot@tribemd.com" \
  commit -m "QA results — $DATE [automated]" --quiet

git -C "$TMP_DIR" push origin gh-pages --quiet \
  && echo "[ok] Dashboard publicado: https://hstribemd.github.io/tribemd-qa-platform/" \
  || echo "[erro] Push para gh-pages falhou — verifique se o token no remote ainda é válido"
