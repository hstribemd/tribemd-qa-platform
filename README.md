# TribeMD QA Platform

Plataforma de QA automatizado para **tribemd.com** (locales **BR**, **US**, **ES**), construída com Playwright + TypeScript. O foco é **encontrar defeitos com impacto real ao usuário** — não ruído técnico.

> Filosofia: a automação age como um QA sênior criterioso. Ela **ignora** warnings de console sem impacto, alt text ausente quando a imagem renderiza, code smells e questões arquiteturais. Ela **reporta** links quebrados, páginas inacessíveis, botões/menus mortos, imagens que não carregam, falhas de tradução, inconsistências entre locales, quebras responsivas, loaders infinitos e páginas em branco.

## O que ela faz

| Capacidade | Onde |
|---|---|
| Regressão de navegação (menus, footer, links) | `tests/regression/navigation.spec.ts` |
| Crawler inteligente com profundidade configurável | `src/services/crawler.ts` |
| Validação de links internos/externos (status, origem) | `src/services/link-checker.ts` |
| Saúde de conteúdo (imagens, texto cortado, tradução, performance visível) | `tests/regression/content-health.spec.ts` |
| Comparação entre locales BR/US/ES | `tests/compare/locale-parity.spec.ts` |
| Regressão visual + responsividade (5 viewports) | `tests/visual/responsive.spec.ts` |
| Exploração automática (monkey reproduzível por seed) | `src/engines/exploratory/` |
| Módulo de IA (heurístico + LLM opcional, sempre "POSSÍVEL PROBLEMA") | `src/engines/ai/` |
| Evidências automáticas por defeito | `src/core/evidence-collector.ts` |
| Dashboard executivo + Relatório QA legível + Allure | `scripts/`, `src/engines/reporting/` |

## Requisitos

- Node.js >= 20
- (para relatório Allure) Java JRE
- (opcional) Docker

## Instalação

```bash
npm install
npm run install:browsers      # baixa o Chromium do Playwright
```

## Comandos

### Auditoria completa por país (recomendado)

Um único comando audita **todas as páginas de um país** (sitemap + conteúdo + navegação + visual, nos 4 viewports) e já gera o relatório:

```bash
npm run qa:br    # audita só o Brasil  → reports/dashboard.html
npm run qa:us    # audita só os EUA
npm run qa:es    # audita só a Espanha
```

Depois abra o relatório: `open reports/dashboard.html`

### Comandos individuais (uso avançado)

```bash
npm run regression        # navegação + crawl + links + saúde de conteúdo
npm run sitemap-audit     # baixa o sitemap oficial e audita TODAS as páginas declaradas (1 teste por página)
npm run exploratory       # exploração automática + IA na home de cada locale
npm run visual            # regressão visual e responsiva (todos os viewports)
npm run compare-locales   # paridade BR vs US vs ES
npm run full-audit        # tudo, em Desktop FHD + Tablet + iPhone + Android

# relatórios
npm run report:qa         # reports/relatorio-qa.md (texto p/ humanos)
npm run report:dashboard  # reports/dashboard.html (dashboard executivo)
npm run report:all        # ambos
npm run report:allure     # gera e abre o Allure

npm run clean             # limpa evidências e relatórios
```

### Primeira execução visual

A regressão visual precisa de uma baseline. Crie-a uma vez:

```bash
npm run visual:update     # grava os snapshots de referência
```

Execuções seguintes comparam contra essa baseline.

## Variáveis de ambiente

| Var | Default | Função |
|---|---|---|
| `BASE_URL` | `https://tribemd.com` | base dos testes |
| `CRAWL_DEPTH` | `2` | profundidade do crawler |
| `CRAWL_MAX_PAGES` | `40` | teto de páginas por locale |
| `EXPLORE_SEED` | `42` | semente da exploração (reproducibilidade) |
| `EXPLORE_ACTIONS` | `15` | ações por página exploratória |
| `AI_USE_LLM` | `false` | liga a análise via LLM |
| `ANTHROPIC_API_KEY` | — | chave para o módulo de IA por LLM |

## Evidências

Cada defeito gera uma pasta autossuficiente:

```
evidencias/
  BUG-001/
    screenshot.png            # página inteira
    screenshot-highlight.png  # elemento destacado (quando aplicável)
    execution.mp4             # vídeo da execução
    page.html                 # DOM no momento da falha
    console.log               # logs de console/rede do produto (terceiros filtrados)
    defect.json               # registro estruturado (título, severidade, passos, impacto…)
```

## Severidade

| Nível | Critério |
|---|---|
| **Critical** | usuário bloqueado / página indisponível / erro fatal (5xx, branco, loader infinito) |
| **High** | funcionalidade principal quebrada (menu/link morto, 404, falha de tradução, template vazado) |
| **Medium** | funcionalidade parcialmente afetada (imagem, sobreposição, lentidão, divergência de locale) |
| **Low** | impacto visual pequeno (texto cortado, regressão visual leve, suspeita de IA) |

## Docker

```bash
docker compose -f docker/docker-compose.yml run --rm qa            # full-audit + relatórios
docker compose -f docker/docker-compose.yml run --rm qa npm run compare-locales
```

Evidências e relatórios são persistidos no host via volumes.

## CI (GitHub Actions)

`.github/workflows/qa.yml`:
- roda a cada 6h (monitoramento contínuo) e em push para `main`;
- permite escolher a suíte via *workflow_dispatch*;
- publica evidências + Allure como artefatos;
- publica o dashboard no GitHub Pages.

Configure o secret `ANTHROPIC_API_KEY` para habilitar a IA por LLM (opcional).

## Arquitetura

Veja [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Limitações conhecidas

- **Validação de links pode gerar falsos positivos.** O `LinkChecker` usa requisições HEAD/GET fora do contexto do browser. Alguns servidores (incluindo CDNs/WAFs) respondem com bloqueio a essas requisições, marcando como "quebrado" um link que abre normalmente no navegador. Em execução real contra o tribemd.com observou-se uma taxa alta de falsos positivos por esse motivo. Antes de tratar a lista de links quebrados como verdade, confirme uma amostra manualmente. *Melhoria pendente:* enviar `User-Agent` de browser e `Accept` headers, e revalidar via navegação real os links marcados como quebrados — isso reduz o ruído, alinhado ao princípio de não afogar defeitos reais em alertas falsos.
- **IA por LLM é opcional e best-effort.** Sem `ANTHROPIC_API_KEY`, só roda a camada heurística. A camada LLM nunca quebra a suíte e sempre marca achados como "POSSÍVEL PROBLEMA".
- **Baseline visual precisa ser criada e versionada** (`npm run visual:update`) por viewport; a primeira execução visual sem baseline cria os snapshots em vez de comparar.

## Isolamento por locale (atualizado)

Cada locale (BR/US/ES) roda em **execução isolada** e grava em **diretório próprio**, para que um país não sobrescreva o relatório de outro.

- `QA_LOCALE` é **obrigatório** nas suítes de regressão/visual. Sem ele, a suíte falha com instrução clara (antes: rodava os três misturados numa execução, com o relatório de um sobrescrevendo o do outro).
- Saída isolada: `reports/<locale>/` e `evidencias/<locale>/` (controlável via `QA_REPORT_DIR` / `EVIDENCE_DIR`).

### Comandos

```bash
npm run qa:br          # só Brasil  -> reports/br, evidencias/br
npm run qa:us          # só EUA     -> reports/us, evidencias/us
npm run qa:es          # só Espanha -> reports/es, evidencias/es
npm run qa:all         # os três em sequência, cada um isolado

# suíte avulsa em um locale (exige QA_LOCALE):
QA_LOCALE=br npm run regression
QA_LOCALE=us npm run visual
```

A engine de **comparação entre locales** (`tests/compare`) continua usando os três ao mesmo tempo de propósito — é a única que precisa, e usa `allLocalesForComparison()`.

No CI, os três locales rodam em **jobs paralelos** (matriz), cada um com artefatos `qa-artifacts-<locale>` e dashboard publicado em `dashboard/<locale>`.
