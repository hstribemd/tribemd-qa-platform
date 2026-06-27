# Arquitetura

## Princípio condutor

> O objetivo não é maximizar cobertura de código nem métricas de automação, e sim **maximizar a probabilidade de detectar problemas antes dos usuários**.

Cobrir (o código executou) ≠ detectar (o defeito disparou um sinal que um humano lê). Três decisões concretas seguem disso:

- **Gate de severidade** (`helpers/severity-gate.ts`, aplicado na fixture `reporter`): defeito confirmado Critical/High **falha o teste**. Um bug que só vira `defect.json` numa pasta não é lido quando o build está verde; ligar a visibilidade do build à severidade do impacto resolve isso. Medium/Low entram no relatório sem quebrar o build; suspeitas de IA nunca quebram.
- **Crawl priorizado** (`services/crawler.ts`, `linkPriority`): sob um teto de páginas, visita primeiro o que tem maior tráfego de usuário — nav e conteúdo/eventos antes de páginas institucionais e rodapé. Detectar na jornada principal vale mais que cobrir um rodapé.
- **Falso negativo > falso positivo:** preferimos alertar e pedir confirmação a perder um bug real. Por isso o detector de idioma é sensível e a camada de IA existe como rede — sem calibrar thresholds para "limpar o dashboard".

**Ressalva honesta:** o princípio não é diretamente mensurável (não dá para contar os bugs que os usuários *teriam* achado). Usamos proxies — tempo até detecção, severidade do que escapa para produção, taxa de escape. O risco é o proxy virar a meta e recairmos em "otimizar métrica". Manter isto explícito é parte do design.

## Princípio condutor (operacional)

> Só reportar o que tem **impacto visível ao usuário**.

Esse princípio é codificado em `src/config/detection-rules.ts` (lista explícita de "ignorar" e "reportar") e respeitado por todos os helpers e engines. Ruído de terceiros (analytics, clickcease) é filtrado já na captura de logs.

## Camadas

```
┌──────────────────────────────────────────────────────────────┐
│ tests/                                                         │
│   regression/  visual/  exploratory/  compare/                 │
│   (specs declarativos — descrevem O QUE validar)               │
└───────────────┬────────────────────────────────────────────────┘
                │ usa fixtures
┌───────────────▼────────────────────────────────────────────────┐
│ src/fixtures/qa-fixtures.ts                                     │
│   injeta: pageLogs, header (PO), reporter, viewportName         │
└───────────────┬────────────────────────────────────────────────┘
        ┌────────┼─────────────────────────────┐
        ▼        ▼                              ▼
┌─────────────┐ ┌──────────────┐  ┌────────────────────────────┐
│ pages/      │ │ services/    │  │ engines/                   │
│ Page        │ │ crawler      │  │ exploratory/ (monkey+seed) │
│ Objects     │ │ link-checker │  │ ai/ (heurística + LLM)     │
│             │ │ visible-perf │  │ reporting/ (meta-reporter) │
│             │ │ defect-rep.  │  │                            │
└─────────────┘ └──────┬───────┘  └─────────────┬──────────────┘
                       │ reporta via            │
                       ▼                        ▼
              ┌──────────────────────────────────────────┐
              │ core/                                     │
              │  DefectReporter → EvidenceCollector       │
              │  → DefectCollector (IDs + persistência)   │
              │  → evidencias/BUG-XXX/{...}               │
              └──────────────────────────────────────────┘
                       │
                       ▼
              ┌──────────────────────────────────────────┐
              │ scripts/ + reporting/                     │
              │  relatorio-qa.md  dashboard.html  Allure  │
              └──────────────────────────────────────────┘
```

## Decisões de design

**Locales como dado, não como código.** `src/config/locales.ts` é o mapa real (extraído por inspeção) das três versões. A engine de comparação casa seções por uma *chave canônica* (`key`), não por rótulo — assim "Educação"/"Cursos" são a mesma seção mesmo com nomes diferentes.

**Detecção mede o que o usuário vê.** O `DomInspector` roda dentro do browser e usa bounding boxes, `elementFromPoint`, `naturalWidth`, `getComputedStyle` — nada de heurística sobre o código-fonte. Um componente só é "invisível" se tem conteúdo **e** área zero/opacity 0/display none.

**Exploração reproduzível.** O Exploratory Engine usa um PRNG com seed (mulberry32). Um bug exploratório encontrado com `EXPLORE_SEED=42` é sempre reproduzível — requisito de QA, não um "monkey" caótico.

**IA nunca confirma.** O `AIVisualAnalyzer` marca tudo como `aiSuspected=true` → o título recebe prefixo "POSSÍVEL PROBLEMA" e severidade Low. Funciona offline (camada heurística) e ganha uma camada LLM opcional se houver `ANTHROPIC_API_KEY`. Se a IA falhar, a suíte não quebra.

**Evidências paralelas-safe.** O `DefectCollector` aloca IDs sequenciais criando a pasta atomicamente (com retry), então funciona sob os workers paralelos do Playwright. Cada defeito é autossuficiente em sua pasta.

**Severidade centralizada.** `helpers/severity.ts` mapeia categoria → severidade, com refino em runtime (5xx = Critical, 404 = High). Specs podem sobrepor caso a caso.

## Fluxo de um defeito

1. Um teste detecta o sintoma (ex.: item de menu sem `href`).
2. Chama `reporter.report({ category, title, userImpact, steps, locator, ... })`.
3. `DefectReporter` resolve a severidade e delega ao `EvidenceCollector`.
4. `EvidenceCollector` cria `evidencias/BUG-XXX/`, captura screenshot (+ highlight do `locator`), HTML, vídeo, logs, e grava `defect.json`.
5. Ao final, `MetaReporter` agrega métricas; `scripts/` produzem `relatorio-qa.md` e `dashboard.html`.

## Extensão

- **Novo locale:** adicione uma entrada em `LOCALES` e em `KNOWN_PAGES`.
- **Nova checagem:** adicione um método ao `DomInspector` (se for no DOM) ou um service, e um `reporter.report(...)` no spec adequado.
- **Nova categoria de defeito:** adicione em `DefectCategory` (types) e no mapa de `severity.ts`.
