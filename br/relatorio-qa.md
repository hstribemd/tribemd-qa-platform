# Relatório QA — TribeMD (BR/US/ES)

Data da execução: 27/06/2026, 16:25:00

## Resumo executivo

Durante a execução foram analisadas 0 páginas e registrados 66 defeitos. Distribuição por severidade: 4 crítico(s), 49 alto(s), 7 médio(s) e 6 baixo(s).

O defeito mais relevante (crítico) é "HTTP 500 — esc® 2025 – parachute hf: novo marco para o tratamento da insuficiência cardíaca" no ambiente BR: A página está fora do ar — o usuário não consegue acessar o conteúdo.

## Defeitos encontrados

### BUG-013 — HTTP 500 — esc® 2025 – parachute hf: novo marco para o tratamento da insuficiência cardíaca
- Severidade: **Critical** (crítico)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: A página está fora do ar — o usuário não consegue acessar o conteúdo.
- Observado: HTTP 500 — erro interno do servidor
- URL: https://tribemd.com/br/conteudos/esc%C2%AE-2025-%E2%80%93-parachute-hf%3A-novo-marco-para-o-tratamento-da-insufici%C3%AAncia-card%C3%ADaca-na-doen%C3%A7a-de-chagas-/
- Origem: https://tribemd.com/br/conteudos/esc%C2%AE-2025-%E2%80%93-parachute-hf--evid%C3%AAncia-in%C3%A9dita-em-cardiopatia-chag%C3%A1sica-
- Passos para reproduzir:
  1. Acessar https://tribemd.com/br/conteudos/esc%C2%AE-2025-%E2%80%93-parachute-hf--evid%C3%AAncia-in%C3%A9dita-em-cardiopatia-chag%C3%A1sica-
  2. Navegar para https://tribemd.com/br/conteudos/esc%C2%AE-2025-%E2%80%93-parachute-hf%3A-novo-marco-para-o-tratamento-da-insufici%C3%AAncia-card%C3%ADaca-na-doen%C3%A7a-de-chagas-/
  3. A página retorna HTTP 500
- Evidências: evidencias/br/BUG-013/urls.txt, evidencias/br/BUG-013/screenshot.png, evidencias/br/BUG-013/execution.webm, evidencias/br/BUG-013/console.log

### BUG-014 — HTTP 500 — por que dois estudos com a mesma medicação podem ter resultados diferentes
- Severidade: **Critical** (crítico)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: A página está fora do ar — o usuário não consegue acessar o conteúdo.
- Observado: HTTP 500 — erro interno do servidor
- URL: https://tribemd.com/br/conteudos/por-que-dois-estudos-com-a-mesma-medica%C3%A7%C3%A3o-podem-ter-resultados-diferentes?-=
- Origem: https://tribemd.com/br/coberturas/1st-international-clinical-research-summit-(icrs)/
- Passos para reproduzir:
  1. Acessar https://tribemd.com/br/coberturas/1st-international-clinical-research-summit-(icrs)/
  2. Navegar para https://tribemd.com/br/conteudos/por-que-dois-estudos-com-a-mesma-medica%C3%A7%C3%A3o-podem-ter-resultados-diferentes?-=
  3. A página retorna HTTP 500
- Evidências: evidencias/br/BUG-014/urls.txt, evidencias/br/BUG-014/screenshot.png, evidencias/br/BUG-014/execution.webm, evidencias/br/BUG-014/console.log

### BUG-015 — HTTP 500 — será que este estudo é confiável
- Severidade: **Critical** (crítico)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: A página está fora do ar — o usuário não consegue acessar o conteúdo.
- Observado: HTTP 500 — erro interno do servidor
- URL: https://tribemd.com/br/conteudos/ser%C3%A1-que-este-estudo-%C3%A9-confi%C3%A1vel
- Origem: https://tribemd.com/br/coberturas/1st-international-clinical-research-summit-(icrs)/
- Passos para reproduzir:
  1. Acessar https://tribemd.com/br/coberturas/1st-international-clinical-research-summit-(icrs)/
  2. Navegar para https://tribemd.com/br/conteudos/ser%C3%A1-que-este-estudo-%C3%A9-confi%C3%A1vel
  3. A página retorna HTTP 500
- Evidências: evidencias/br/BUG-015/urls.txt, evidencias/br/BUG-015/screenshot.png, evidencias/br/BUG-015/execution.webm, evidencias/br/BUG-015/console.log

### BUG-016 — HTTP 500 — quais são as possíveis áreas de atuação de um profissional de pesquisa clínica
- Severidade: **Critical** (crítico)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: A página está fora do ar — o usuário não consegue acessar o conteúdo.
- Observado: HTTP 500 — erro interno do servidor
- URL: https://tribemd.com/br/conteudos/quais-s%C3%A3o-as-poss%C3%ADveis-%C3%A1reas-de-atua%C3%A7%C3%A3o-de-um-profissional-de-pesquisa-cl%C3%ADnica?-=
- Origem: https://tribemd.com/br/coberturas/1st-international-clinical-research-summit-(icrs)/
- Passos para reproduzir:
  1. Acessar https://tribemd.com/br/coberturas/1st-international-clinical-research-summit-(icrs)/
  2. Navegar para https://tribemd.com/br/conteudos/quais-s%C3%A3o-as-poss%C3%ADveis-%C3%A1reas-de-atua%C3%A7%C3%A3o-de-um-profissional-de-pesquisa-cl%C3%ADnica?-=
  3. A página retorna HTTP 500
- Evidências: evidencias/br/BUG-016/urls.txt, evidencias/br/BUG-016/screenshot.png, evidencias/br/BUG-016/execution.webm, evidencias/br/BUG-016/console.log

### BUG-009 — HTTP 404 — perfil
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: A página não existe — o usuário recebe erro ao tentar acessá-la.
- Observado: HTTP 404 — página não encontrada
- URL: https://tribemd.com/br/perfil
- Origem: https://tribemd.com/br/perfil/22/
- Passos para reproduzir:
  1. Acessar https://tribemd.com/br/perfil/22/
  2. Navegar para https://tribemd.com/br/perfil
  3. A página retorna HTTP 404
- Evidências: evidencias/br/BUG-009/urls.txt, evidencias/br/BUG-009/screenshot.png, evidencias/br/BUG-009/execution.webm, evidencias/br/BUG-009/console.log

### BUG-010 — HTTP 404 — coberturas
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: A página não existe — o usuário recebe erro ao tentar acessá-la.
- Observado: HTTP 404 — página não encontrada
- URL: https://tribemd.com/br/coberturas
- Origem: https://tribemd.com/br/coberturas/hemomeeting---s%C3%A3o-paulo-interior/
- Passos para reproduzir:
  1. Acessar https://tribemd.com/br/coberturas/hemomeeting---s%C3%A3o-paulo-interior/
  2. Navegar para https://tribemd.com/br/coberturas
  3. A página retorna HTTP 404
- Evidências: evidencias/br/BUG-010/urls.txt, evidencias/br/BUG-010/screenshot.png, evidencias/br/BUG-010/execution.webm, evidencias/br/BUG-010/console.log

### BUG-012 — HTTP 400 — https://tribemd.com/br/conteudos/ash-2025--cartitude-4-mostra-sobrevida-livre-de-progress%C3%A3o-superior-a-80%-em-30-meses-para-pacientes-com-risco-citogen%C3%A9tico-convencional-tratados-com-cilta-cel-
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: A página não existe — o usuário recebe erro ao tentar acessá-la.
- Observado: HTTP 400 — página não encontrada
- URL: https://tribemd.com/br/conteudos/ash-2025--cartitude-4-mostra-sobrevida-livre-de-progress%C3%A3o-superior-a-80%-em-30-meses-para-pacientes-com-risco-citogen%C3%A9tico-convencional-tratados-com-cilta-cel-
- Origem: https://tribemd.com/br/coberturas/ash-2025/
- Passos para reproduzir:
  1. Acessar https://tribemd.com/br/coberturas/ash-2025/
  2. Navegar para https://tribemd.com/br/conteudos/ash-2025--cartitude-4-mostra-sobrevida-livre-de-progress%C3%A3o-superior-a-80%-em-30-meses-para-pacientes-com-risco-citogen%C3%A9tico-convencional-tratados-com-cilta-cel-
  3. A página retorna HTTP 400
- Evidências: evidencias/br/BUG-012/urls.txt, evidencias/br/BUG-012/screenshot.png, evidencias/br/BUG-012/execution.webm, evidencias/br/BUG-012/console.log

### BUG-017 — Link quebrado (404) — profile
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 404 ao acessar https://tribemd.com/us/profile
- URL: https://tribemd.com/us/profile
- Origem: https://tribemd.com/br/perfil/22/
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/perfil/22/
  2. Clicar no link "Mudar para English"
  3. A URL retorna 404
- Evidências: evidencias/br/BUG-017/urls.txt, evidencias/br/BUG-017/screenshot.png, evidencias/br/BUG-017/execution.webm, evidencias/br/BUG-017/console.log

### BUG-018 — Link quebrado (404) — coberturas
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 404 ao acessar https://tribemd.com/es/coberturas
- URL: https://tribemd.com/es/coberturas
- Origem: https://tribemd.com/br/coberturas/hemomeeting---s%C3%A3o-paulo-interior/
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/coberturas/hemomeeting---s%C3%A3o-paulo-interior/
  2. Clicar no link "Mudar para Español"
  3. A URL retorna 404
- Evidências: evidencias/br/BUG-018/urls.txt, evidencias/br/BUG-018/screenshot.png, evidencias/br/BUG-018/execution.webm, evidencias/br/BUG-018/console.log

### BUG-019 — Link quebrado (404) — coverages
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 404 ao acessar https://tribemd.com/us/coverages
- URL: https://tribemd.com/us/coverages
- Origem: https://tribemd.com/br/coberturas/hemomeeting---s%C3%A3o-paulo-interior/
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/coberturas/hemomeeting---s%C3%A3o-paulo-interior/
  2. Clicar no link "Mudar para English"
  3. A URL retorna 404
- Evidências: evidencias/br/BUG-019/urls.txt, evidencias/br/BUG-019/screenshot.png, evidencias/br/BUG-019/execution.webm, evidencias/br/BUG-019/console.log

### BUG-020 — Link quebrado (404) — perfil
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 404 ao acessar https://tribemd.com/es/perfil
- URL: https://tribemd.com/es/perfil
- Origem: https://tribemd.com/br/perfil/22/
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/perfil/22/
  2. Clicar no link "Mudar para Español"
  3. A URL retorna 404
- Evidências: evidencias/br/BUG-020/urls.txt, evidencias/br/BUG-020/screenshot.png, evidencias/br/BUG-020/execution.webm, evidencias/br/BUG-020/console.log

### BUG-021 — Link quebrado (500) — search
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/us/search?author_id=98451&type=event
- URL: https://tribemd.com/us/search?author_id=98451&type=event
- Origem: https://tribemd.com/br/busca/?author_id=98451&type=event
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=98451&type=event
  2. Clicar no link "Mudar para English"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-021/urls.txt, evidencias/br/BUG-021/screenshot.png, evidencias/br/BUG-021/execution.webm, evidencias/br/BUG-021/console.log

### BUG-022 — Link quebrado (500) — busqueda
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/es/busqueda?author_id=98451&type=event
- URL: https://tribemd.com/es/busqueda?author_id=98451&type=event
- Origem: https://tribemd.com/br/busca/?author_id=98451&type=event
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=98451&type=event
  2. Clicar no link "Mudar para Español"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-022/urls.txt, evidencias/br/BUG-022/screenshot.png, evidencias/br/BUG-022/execution.webm, evidencias/br/BUG-022/console.log

### BUG-023 — Link quebrado (500) — search
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/us/search?author_id=19&type=content
- URL: https://tribemd.com/us/search?author_id=19&type=content
- Origem: https://tribemd.com/br/busca/?author_id=19&type=content
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=19&type=content
  2. Clicar no link "Mudar para English"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-023/urls.txt, evidencias/br/BUG-023/screenshot.png, evidencias/br/BUG-023/execution.webm, evidencias/br/BUG-023/console.log

### BUG-024 — Link quebrado (500) — busqueda
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/es/busqueda?author_id=19&type=content
- URL: https://tribemd.com/es/busqueda?author_id=19&type=content
- Origem: https://tribemd.com/br/busca/?author_id=19&type=content
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=19&type=content
  2. Clicar no link "Mudar para Español"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-024/urls.txt, evidencias/br/BUG-024/screenshot.png, evidencias/br/BUG-024/execution.webm, evidencias/br/BUG-024/console.log

### BUG-025 — Link quebrado (500) — search
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/us/search?author_id=19&type=event
- URL: https://tribemd.com/us/search?author_id=19&type=event
- Origem: https://tribemd.com/br/busca/?author_id=19&type=event
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=19&type=event
  2. Clicar no link "Mudar para English"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-025/urls.txt, evidencias/br/BUG-025/screenshot.png, evidencias/br/BUG-025/execution.webm, evidencias/br/BUG-025/console.log

### BUG-026 — Link quebrado (500) — busqueda
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/es/busqueda?author_id=19&type=event
- URL: https://tribemd.com/es/busqueda?author_id=19&type=event
- Origem: https://tribemd.com/br/busca/?author_id=19&type=event
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=19&type=event
  2. Clicar no link "Mudar para Español"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-026/urls.txt, evidencias/br/BUG-026/screenshot.png, evidencias/br/BUG-026/execution.webm, evidencias/br/BUG-026/console.log

### BUG-027 — Link quebrado (500) — search
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/us/search?author_id=21&type=content
- URL: https://tribemd.com/us/search?author_id=21&type=content
- Origem: https://tribemd.com/br/busca/?author_id=21&type=content
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=21&type=content
  2. Clicar no link "Mudar para English"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-027/urls.txt, evidencias/br/BUG-027/screenshot.png, evidencias/br/BUG-027/execution.webm, evidencias/br/BUG-027/console.log

### BUG-028 — Link quebrado (500) — busqueda
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/es/busqueda?author_id=21&type=content
- URL: https://tribemd.com/es/busqueda?author_id=21&type=content
- Origem: https://tribemd.com/br/busca/?author_id=21&type=content
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=21&type=content
  2. Clicar no link "Mudar para Español"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-028/urls.txt, evidencias/br/BUG-028/screenshot.png, evidencias/br/BUG-028/execution.webm, evidencias/br/BUG-028/console.log

### BUG-029 — Link quebrado (500) — search
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/us/search?author_id=21&type=event
- URL: https://tribemd.com/us/search?author_id=21&type=event
- Origem: https://tribemd.com/br/busca/?author_id=21&type=event
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=21&type=event
  2. Clicar no link "Mudar para English"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-029/urls.txt, evidencias/br/BUG-029/screenshot.png, evidencias/br/BUG-029/execution.webm, evidencias/br/BUG-029/console.log

### BUG-030 — Link quebrado (500) — busqueda
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/es/busqueda?author_id=21&type=event
- URL: https://tribemd.com/es/busqueda?author_id=21&type=event
- Origem: https://tribemd.com/br/busca/?author_id=21&type=event
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=21&type=event
  2. Clicar no link "Mudar para Español"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-030/urls.txt, evidencias/br/BUG-030/screenshot.png, evidencias/br/BUG-030/execution.webm, evidencias/br/BUG-030/console.log

### BUG-031 — Link quebrado (500) — search
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/us/search?author_id=89874&type=event
- URL: https://tribemd.com/us/search?author_id=89874&type=event
- Origem: https://tribemd.com/br/busca/?author_id=89874&type=event
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=89874&type=event
  2. Clicar no link "Mudar para English"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-031/urls.txt, evidencias/br/BUG-031/screenshot.png, evidencias/br/BUG-031/execution.webm, evidencias/br/BUG-031/console.log

### BUG-032 — Link quebrado (500) — search
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/us/search?author_id=98451&type=content
- URL: https://tribemd.com/us/search?author_id=98451&type=content
- Origem: https://tribemd.com/br/busca/?author_id=98451&type=content
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=98451&type=content
  2. Clicar no link "Mudar para English"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-032/urls.txt, evidencias/br/BUG-032/screenshot.png, evidencias/br/BUG-032/execution.webm, evidencias/br/BUG-032/console.log

### BUG-033 — Link quebrado (500) — busqueda
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/es/busqueda?author_id=98451&type=content
- URL: https://tribemd.com/es/busqueda?author_id=98451&type=content
- Origem: https://tribemd.com/br/busca/?author_id=98451&type=content
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=98451&type=content
  2. Clicar no link "Mudar para Español"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-033/urls.txt, evidencias/br/BUG-033/screenshot.png, evidencias/br/BUG-033/execution.webm, evidencias/br/BUG-033/console.log

### BUG-034 — Link quebrado (500) — busqueda
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/es/busqueda?author_id=89874&type=event
- URL: https://tribemd.com/es/busqueda?author_id=89874&type=event
- Origem: https://tribemd.com/br/busca/?author_id=89874&type=event
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=89874&type=event
  2. Clicar no link "Mudar para Español"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-034/urls.txt, evidencias/br/BUG-034/screenshot.png, evidencias/br/BUG-034/execution.webm, evidencias/br/BUG-034/console.log

### BUG-035 — Link quebrado (500) — search
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/us/search?author_id=20&type=event
- URL: https://tribemd.com/us/search?author_id=20&type=event
- Origem: https://tribemd.com/br/busca/?author_id=20&type=event
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=20&type=event
  2. Clicar no link "Mudar para English"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-035/urls.txt, evidencias/br/BUG-035/screenshot.png, evidencias/br/BUG-035/execution.webm, evidencias/br/BUG-035/console.log

### BUG-036 — Link quebrado (500) — busqueda
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/es/busqueda?author_id=20&type=event
- URL: https://tribemd.com/es/busqueda?author_id=20&type=event
- Origem: https://tribemd.com/br/busca/?author_id=20&type=event
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=20&type=event
  2. Clicar no link "Mudar para Español"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-036/urls.txt, evidencias/br/BUG-036/screenshot.png, evidencias/br/BUG-036/execution.webm, evidencias/br/BUG-036/console.log

### BUG-037 — Link quebrado (500) — search
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/us/search?author_id=25&type=content
- URL: https://tribemd.com/us/search?author_id=25&type=content
- Origem: https://tribemd.com/br/busca/?author_id=25&type=content
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=25&type=content
  2. Clicar no link "Mudar para English"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-037/urls.txt, evidencias/br/BUG-037/screenshot.png, evidencias/br/BUG-037/execution.webm, evidencias/br/BUG-037/console.log

### BUG-038 — Link quebrado (500) — busqueda
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/es/busqueda?author_id=25&type=content
- URL: https://tribemd.com/es/busqueda?author_id=25&type=content
- Origem: https://tribemd.com/br/busca/?author_id=25&type=content
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=25&type=content
  2. Clicar no link "Mudar para Español"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-038/urls.txt, evidencias/br/BUG-038/screenshot.png, evidencias/br/BUG-038/execution.webm, evidencias/br/BUG-038/console.log

### BUG-039 — Link quebrado (500) — search
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/us/search?author_id=25&type=event
- URL: https://tribemd.com/us/search?author_id=25&type=event
- Origem: https://tribemd.com/br/busca/?author_id=25&type=event
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=25&type=event
  2. Clicar no link "Mudar para English"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-039/urls.txt, evidencias/br/BUG-039/screenshot.png, evidencias/br/BUG-039/execution.webm, evidencias/br/BUG-039/console.log

### BUG-040 — Link quebrado (500) — por que dois estudos com a mesma medicação podem ter resultados diferentes
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/br/conteudos/por-que-dois-estudos-com-a-mesma-medica%C3%A7%C3%A3o-podem-ter-resultados-diferentes?-
- URL: https://tribemd.com/br/conteudos/por-que-dois-estudos-com-a-mesma-medica%C3%A7%C3%A3o-podem-ter-resultados-diferentes?-
- Origem: https://tribemd.com/br/coberturas/1st-international-clinical-research-summit-(icrs)/
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/coberturas/1st-international-clinical-research-summit-(icrs)/
  2. Clicar no link "Pesquisa Clínica

17 abr, 2026

4 min

Por que dois estudos com a mesma medicaçã"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-040/urls.txt, evidencias/br/BUG-040/screenshot.png, evidencias/br/BUG-040/execution.webm, evidencias/br/BUG-040/console.log

### BUG-041 — Link quebrado (500) — será que este estudo é confiável
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/br/conteudos/ser%C3%A1-que-este-estudo-%C3%A9-confi%C3%A1vel?
- URL: https://tribemd.com/br/conteudos/ser%C3%A1-que-este-estudo-%C3%A9-confi%C3%A1vel?
- Origem: https://tribemd.com/br/coberturas/1st-international-clinical-research-summit-(icrs)/
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/coberturas/1st-international-clinical-research-summit-(icrs)/
  2. Clicar no link "Pesquisa Clínica

17 abr, 2026

4 min

Será que este estudo é confiável?

Um edi"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-041/urls.txt, evidencias/br/BUG-041/screenshot.png, evidencias/br/BUG-041/execution.webm, evidencias/br/BUG-041/console.log

### BUG-042 — Link quebrado (500) — quais são as possíveis áreas de atuação de um profissional de pesquisa clínica
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/br/conteudos/quais-s%C3%A3o-as-poss%C3%ADveis-%C3%A1reas-de-atua%C3%A7%C3%A3o-de-um-profissional-de-pesquisa-cl%C3%ADnica?-
- URL: https://tribemd.com/br/conteudos/quais-s%C3%A3o-as-poss%C3%ADveis-%C3%A1reas-de-atua%C3%A7%C3%A3o-de-um-profissional-de-pesquisa-cl%C3%ADnica?-
- Origem: https://tribemd.com/br/coberturas/1st-international-clinical-research-summit-(icrs)/
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/coberturas/1st-international-clinical-research-summit-(icrs)/
  2. Clicar no link "Pesquisa Clínica

17 abr, 2026

Quais são as possíveis áreas de atuação de um pr"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-042/urls.txt, evidencias/br/BUG-042/screenshot.png, evidencias/br/BUG-042/execution.webm, evidencias/br/BUG-042/console.log

### BUG-043 — Link quebrado (500) — esc® 2025 – parachute hf: novo marco para o tratamento da insuficiência cardíaca
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/br/conteudos/esc%C2%AE-2025-%E2%80%93-parachute-hf%3A-novo-marco-para-o-tratamento-da-insufici%C3%AAncia-card%C3%ADaca-na-doen%C3%A7a-de-chagas-/?utm_source=chatgpt.com
- URL: https://tribemd.com/br/conteudos/esc%C2%AE-2025-%E2%80%93-parachute-hf%3A-novo-marco-para-o-tratamento-da-insufici%C3%AAncia-card%C3%ADaca-na-doen%C3%A7a-de-chagas-/?utm_source=chatgpt.com
- Origem: https://tribemd.com/br/conteudos/esc%C2%AE-2025-%E2%80%93-parachute-hf--evid%C3%AAncia-in%C3%A9dita-em-cardiopatia-chag%C3%A1sica-
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/conteudos/esc%C2%AE-2025-%E2%80%93-parachute-hf--evid%C3%AAncia-in%C3%A9dita-em-cardiopatia-chag%C3%A1sica-
  2. Clicar no link "https://tribemd.com/br/conteudos/esc%C2%AE-2025-%E2%80%93-parachute-hf%3A-novo-m"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-043/urls.txt, evidencias/br/BUG-043/screenshot.png, evidencias/br/BUG-043/execution.webm, evidencias/br/BUG-043/console.log

### BUG-044 — Link quebrado (500) — search
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/us/search?author_id=1&type=course
- URL: https://tribemd.com/us/search?author_id=1&type=course
- Origem: https://tribemd.com/br/busca/?author_id=1&type=course
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=1&type=course
  2. Clicar no link "Mudar para English"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-044/urls.txt, evidencias/br/BUG-044/screenshot.png, evidencias/br/BUG-044/execution.webm, evidencias/br/BUG-044/console.log

### BUG-045 — Link quebrado (500) — busqueda
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/es/busqueda?author_id=1&type=course
- URL: https://tribemd.com/es/busqueda?author_id=1&type=course
- Origem: https://tribemd.com/br/busca/?author_id=1&type=course
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=1&type=course
  2. Clicar no link "Mudar para Español"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-045/urls.txt, evidencias/br/BUG-045/screenshot.png, evidencias/br/BUG-045/execution.webm, evidencias/br/BUG-045/console.log

### BUG-046 — Link quebrado (500) — search
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/us/search?author_id=1&type=content
- URL: https://tribemd.com/us/search?author_id=1&type=content
- Origem: https://tribemd.com/br/busca/?author_id=1&type=content
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=1&type=content
  2. Clicar no link "Mudar para English"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-046/urls.txt, evidencias/br/BUG-046/screenshot.png, evidencias/br/BUG-046/execution.webm, evidencias/br/BUG-046/console.log

### BUG-047 — Link quebrado (500) — search
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/us/search?author_id=1&type=event
- URL: https://tribemd.com/us/search?author_id=1&type=event
- Origem: https://tribemd.com/br/busca/?author_id=1&type=event
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=1&type=event
  2. Clicar no link "Mudar para English"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-047/urls.txt, evidencias/br/BUG-047/screenshot.png, evidencias/br/BUG-047/execution.webm, evidencias/br/BUG-047/console.log

### BUG-048 — Link quebrado (500) — busqueda
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/es/busqueda?author_id=1&type=event
- URL: https://tribemd.com/es/busqueda?author_id=1&type=event
- Origem: https://tribemd.com/br/busca/?author_id=1&type=event
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=1&type=event
  2. Clicar no link "Mudar para Español"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-048/urls.txt, evidencias/br/BUG-048/screenshot.png, evidencias/br/BUG-048/execution.webm, evidencias/br/BUG-048/console.log

### BUG-049 — Link quebrado (500) — busqueda
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/es/busqueda?author_id=1&type=content
- URL: https://tribemd.com/es/busqueda?author_id=1&type=content
- Origem: https://tribemd.com/br/busca/?author_id=1&type=content
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=1&type=content
  2. Clicar no link "Mudar para Español"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-049/urls.txt, evidencias/br/BUG-049/screenshot.png, evidencias/br/BUG-049/execution.webm, evidencias/br/BUG-049/console.log

### BUG-050 — Link quebrado (500) — busqueda
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/es/busqueda?author_id=25&type=event
- URL: https://tribemd.com/es/busqueda?author_id=25&type=event
- Origem: https://tribemd.com/br/busca/?author_id=25&type=event
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=25&type=event
  2. Clicar no link "Mudar para Español"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-050/urls.txt, evidencias/br/BUG-050/screenshot.png, evidencias/br/BUG-050/execution.webm, evidencias/br/BUG-050/console.log

### BUG-051 — Link quebrado (500) — search
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/us/search?author_id=2&type=course
- URL: https://tribemd.com/us/search?author_id=2&type=course
- Origem: https://tribemd.com/br/busca/?author_id=2&type=course
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=2&type=course
  2. Clicar no link "Mudar para English"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-051/urls.txt, evidencias/br/BUG-051/screenshot.png, evidencias/br/BUG-051/execution.webm, evidencias/br/BUG-051/console.log

### BUG-052 — Link quebrado (500) — busqueda
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/es/busqueda?author_id=2&type=event
- URL: https://tribemd.com/es/busqueda?author_id=2&type=event
- Origem: https://tribemd.com/br/busca/?author_id=2&type=event
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=2&type=event
  2. Clicar no link "Mudar para Español"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-052/urls.txt, evidencias/br/BUG-052/screenshot.png, evidencias/br/BUG-052/execution.webm, evidencias/br/BUG-052/console.log

### BUG-053 — Link quebrado (500) — search
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/us/search?author_id=3&type=course
- URL: https://tribemd.com/us/search?author_id=3&type=course
- Origem: https://tribemd.com/br/busca/?author_id=3&type=course
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=3&type=course
  2. Clicar no link "Mudar para English"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-053/urls.txt, evidencias/br/BUG-053/screenshot.png, evidencias/br/BUG-053/execution.webm, evidencias/br/BUG-053/console.log

### BUG-054 — Link quebrado (500) — busqueda
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/es/busqueda?author_id=3&type=course
- URL: https://tribemd.com/es/busqueda?author_id=3&type=course
- Origem: https://tribemd.com/br/busca/?author_id=3&type=course
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=3&type=course
  2. Clicar no link "Mudar para Español"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-054/urls.txt, evidencias/br/BUG-054/screenshot.png, evidencias/br/BUG-054/execution.webm, evidencias/br/BUG-054/console.log

### BUG-058 — Link quebrado (500) — search
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/us/search?author_id=3&type=content
- URL: https://tribemd.com/us/search?author_id=3&type=content
- Origem: https://tribemd.com/br/busca/?author_id=3&type=content
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=3&type=content
  2. Clicar no link "Mudar para English"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-058/urls.txt, evidencias/br/BUG-058/screenshot.png, evidencias/br/BUG-058/execution.webm, evidencias/br/BUG-058/console.log

### BUG-059 — Link quebrado (500) — busqueda
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/es/busqueda?author_id=2&type=course
- URL: https://tribemd.com/es/busqueda?author_id=2&type=course
- Origem: https://tribemd.com/br/busca/?author_id=2&type=course
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=2&type=course
  2. Clicar no link "Mudar para Español"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-059/urls.txt, evidencias/br/BUG-059/screenshot.png, evidencias/br/BUG-059/execution.webm, evidencias/br/BUG-059/console.log

### BUG-060 — Link quebrado (500) — busqueda
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/es/busqueda?author_id=3&type=content
- URL: https://tribemd.com/es/busqueda?author_id=3&type=content
- Origem: https://tribemd.com/br/busca/?author_id=3&type=content
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=3&type=content
  2. Clicar no link "Mudar para Español"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-060/urls.txt, evidencias/br/BUG-060/screenshot.png, evidencias/br/BUG-060/execution.webm, evidencias/br/BUG-060/console.log

### BUG-061 — Link quebrado (500) — search
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/us/search?author_id=3&type=event
- URL: https://tribemd.com/us/search?author_id=3&type=event
- Origem: https://tribemd.com/br/busca/?author_id=3&type=event
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=3&type=event
  2. Clicar no link "Mudar para English"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-061/urls.txt, evidencias/br/BUG-061/screenshot.png, evidencias/br/BUG-061/execution.webm, evidencias/br/BUG-061/console.log

### BUG-062 — Link quebrado (500) — search
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/us/search?author_id=2&type=event
- URL: https://tribemd.com/us/search?author_id=2&type=event
- Origem: https://tribemd.com/br/busca/?author_id=2&type=event
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=2&type=event
  2. Clicar no link "Mudar para English"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-062/urls.txt, evidencias/br/BUG-062/screenshot.png, evidencias/br/BUG-062/execution.webm, evidencias/br/BUG-062/console.log

### BUG-063 — Link quebrado (500) — busqueda
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/es/busqueda?author_id=3&type=event
- URL: https://tribemd.com/es/busqueda?author_id=3&type=event
- Origem: https://tribemd.com/br/busca/?author_id=3&type=event
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/busca/?author_id=3&type=event
  2. Clicar no link "Mudar para Español"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-063/urls.txt, evidencias/br/BUG-063/screenshot.png, evidencias/br/BUG-063/execution.webm, evidencias/br/BUG-063/console.log

### BUG-064 — Link quebrado (500) — world symposium 2026: perspectivas clínicas e experiências reais no tratamento d
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/br/conteudos/world-symposium-2026%3A-perspectivas-cl%C3%ADnicas-e-experi%C3%AAncias-reais-no-tratamento-da-doen%C3%A7a-de-fabry./
- URL: https://tribemd.com/br/conteudos/world-symposium-2026%3A-perspectivas-cl%C3%ADnicas-e-experi%C3%AAncias-reais-no-tratamento-da-doen%C3%A7a-de-fabry./
- Origem: https://tribemd.com/br/conteudos/highlights-world-symposium-2026--avan%C3%A7os-em-diagn%C3%B3stico-e-tratamento-de-doen%C3%A7as-lisoss%C3%B4micas
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/conteudos/highlights-world-symposium-2026--avan%C3%A7os-em-diagn%C3%B3stico-e-tratamento-de-doen%C3%A7as-lisoss%C3%B4micas
  2. Clicar no link "World Symposium 2026: Perspectivas Clínicas e Experiências Reais no Tratamento d"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-064/urls.txt, evidencias/br/BUG-064/screenshot.png, evidencias/br/BUG-064/execution.webm, evidencias/br/BUG-064/console.log

### BUG-065 — Link quebrado (500) — world symposium 2026 – mucopolissacaridoses: terapias com alcance ao sistema ner
- Severidade: **High** (alto)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link interno e chega a uma pagina com erro.
- Observado: HTTP 500 ao acessar https://tribemd.com/br/conteudos/world-symposium-2026-%E2%80%93-mucopolissacaridoses%3A-terapias-com-alcance-ao-sistema-nervoso-central-redefinem-o-tratamento-das-formas-neuronais/
- URL: https://tribemd.com/br/conteudos/world-symposium-2026-%E2%80%93-mucopolissacaridoses%3A-terapias-com-alcance-ao-sistema-nervoso-central-redefinem-o-tratamento-das-formas-neuronais/
- Origem: https://tribemd.com/br/conteudos/highlights-world-symposium-2026--avan%C3%A7os-em-diagn%C3%B3stico-e-tratamento-de-doen%C3%A7as-lisoss%C3%B4micas
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/conteudos/highlights-world-symposium-2026--avan%C3%A7os-em-diagn%C3%B3stico-e-tratamento-de-doen%C3%A7as-lisoss%C3%B4micas
  2. Clicar no link "World Symposium 20269 – Mucopolissacaridoses: terapias com alcance ao sistema ne"
  3. A URL retorna 500
- Evidências: evidencias/br/BUG-065/urls.txt, evidencias/br/BUG-065/screenshot.png, evidencias/br/BUG-065/execution.webm, evidencias/br/BUG-065/console.log

### BUG-001 — Página muito lenta em /br/ (8110ms)
- Severidade: **Medium** (médio)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: A página demora demais para ficar utilizável; o usuário pode desistir.
- Observado: Página levou 8110ms para estabilizar (limite: 8000ms)
- URL: https://tribemd.com/br/
- Passos para reproduzir:
  1. Acessar https://tribemd.com/br/
  2. Cronometrar o carregamento
- Evidências: evidencias/br/BUG-001/urls.txt, evidencias/br/BUG-001/screenshot.png, evidencias/br/BUG-001/page.html, evidencias/br/BUG-001/console.log, evidencias/br/BUG-001/execution.webm

### BUG-002 — Página muito lenta em /br/conteudos/ (8142ms)
- Severidade: **Medium** (médio)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: A página demora demais para ficar utilizável; o usuário pode desistir.
- Observado: Página levou 8142ms para estabilizar (limite: 8000ms)
- URL: https://tribemd.com/br/conteudos/
- Passos para reproduzir:
  1. Acessar https://tribemd.com/br/conteudos/
  2. Cronometrar o carregamento
- Evidências: evidencias/br/BUG-002/urls.txt, evidencias/br/BUG-002/screenshot.png, evidencias/br/BUG-002/page.html, evidencias/br/BUG-002/console.log, evidencias/br/BUG-002/execution.webm

### BUG-005 — Página muito lenta em /br/eventos/ (8386ms)
- Severidade: **Medium** (médio)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: A página demora demais para ficar utilizável; o usuário pode desistir.
- Observado: Página levou 8386ms para estabilizar (limite: 8000ms)
- URL: https://tribemd.com/br/eventos/
- Passos para reproduzir:
  1. Acessar https://tribemd.com/br/eventos/
  2. Cronometrar o carregamento
- Evidências: evidencias/br/BUG-005/urls.txt, evidencias/br/BUG-005/screenshot.png, evidencias/br/BUG-005/page.html, evidencias/br/BUG-005/console.log, evidencias/br/BUG-005/execution.webm

### BUG-006 — Página muito lenta em /br/cursos/ (9010ms)
- Severidade: **Medium** (médio)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: A página demora demais para ficar utilizável; o usuário pode desistir.
- Observado: Página levou 9010ms para estabilizar (limite: 8000ms)
- URL: https://tribemd.com/br/cursos/
- Passos para reproduzir:
  1. Acessar https://tribemd.com/br/cursos/
  2. Cronometrar o carregamento
- Evidências: evidencias/br/BUG-006/urls.txt, evidencias/br/BUG-006/screenshot.png, evidencias/br/BUG-006/page.html, evidencias/br/BUG-006/console.log, evidencias/br/BUG-006/execution.webm

### BUG-007 — Página muito lenta em /br/perguntas-frequentes/ (8090ms)
- Severidade: **Medium** (médio)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: A página demora demais para ficar utilizável; o usuário pode desistir.
- Observado: Página levou 8090ms para estabilizar (limite: 8000ms)
- URL: https://tribemd.com/br/perguntas-frequentes/
- Passos para reproduzir:
  1. Acessar https://tribemd.com/br/perguntas-frequentes/
  2. Cronometrar o carregamento
- Evidências: evidencias/br/BUG-007/urls.txt, evidencias/br/BUG-007/screenshot.png, evidencias/br/BUG-007/page.html, evidencias/br/BUG-007/console.log, evidencias/br/BUG-007/execution.webm

### BUG-008 — Página muito lenta em /br/sobre/ (8192ms)
- Severidade: **Medium** (médio)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: A página demora demais para ficar utilizável; o usuário pode desistir.
- Observado: Página levou 8192ms para estabilizar (limite: 8000ms)
- URL: https://tribemd.com/br/sobre/
- Passos para reproduzir:
  1. Acessar https://tribemd.com/br/sobre/
  2. Cronometrar o carregamento
- Evidências: evidencias/br/BUG-008/urls.txt, evidencias/br/BUG-008/screenshot.png, evidencias/br/BUG-008/page.html, evidencias/br/BUG-008/console.log, evidencias/br/BUG-008/execution.webm

### BUG-011 — Elementos sobrepostos em desktop-chromium
- Severidade: **Medium** (médio)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: Um elemento cobre outro, podendo impedir cliques ou esconder informação.
- Observado: "a" está sobreposto por "div("Para vocêConteúdos exclusivos ")"
- URL: https://tribemd.com/br/
- Passos para reproduzir:
  1. Abrir /br/ em desktop-chromium
  2. Observar a sobreposição
- Evidências: evidencias/br/BUG-011/urls.txt, evidencias/br/BUG-011/screenshot.png, evidencias/br/BUG-011/page.html, evidencias/br/BUG-011/console.log, evidencias/br/BUG-011/execution.webm

### BUG-003 — Link externo quebrado no rodape (400): https://www.facebook.com/tribemd.br/
- Severidade: **Low** (baixo)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link do site para um destino de terceiros que respondeu com erro. Fora do controle do TribeMD; verificar manualmente.
- Observado: HTTP 400 ao acessar https://www.facebook.com/tribemd.br/
- URL: https://www.facebook.com/tribemd.br/
- Origem: https://tribemd.com/br/
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/
  2. Clicar em "https://www.facebook.com/tribemd.br/" no rodape
  3. Observar o erro 400
- Evidências: evidencias/br/BUG-003/urls.txt, evidencias/br/BUG-003/screenshot.png, evidencias/br/BUG-003/page.html, evidencias/br/BUG-003/console.log, evidencias/br/BUG-003/execution.webm

### BUG-004 — Link externo quebrado no rodape (999): https://www.linkedin.com/company/tribemd-br/posts/?feedView=all
- Severidade: **Low** (baixo)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link do site para um destino de terceiros que respondeu com erro. Fora do controle do TribeMD; verificar manualmente.
- Observado: HTTP 999 ao acessar https://www.linkedin.com/company/tribemd-br/posts/?feedView=all
- URL: https://www.linkedin.com/company/tribemd-br/posts/?feedView=all
- Origem: https://tribemd.com/br/
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/
  2. Clicar em "https://www.linkedin.com/company/tribemd-br/posts/?feedView=all" no rodape
  3. Observar o erro 999
- Evidências: evidencias/br/BUG-004/urls.txt, evidencias/br/BUG-004/screenshot.png, evidencias/br/BUG-004/page.html, evidencias/br/BUG-004/console.log, evidencias/br/BUG-004/execution.webm

### BUG-055 — Link externo quebrado (400) — tribemd.br
- Severidade: **Low** (baixo)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link para um site de terceiros que respondeu com erro.
- Observado: HTTP 400 ao acessar https://www.facebook.com/tribemd.br/
- URL: https://www.facebook.com/tribemd.br/
- Origem: https://tribemd.com/br/
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/
  2. Clicar no link para https://www.facebook.com/tribemd.br/
  3. A URL retorna 400
- Evidências: evidencias/br/BUG-055/urls.txt, evidencias/br/BUG-055/screenshot.png, evidencias/br/BUG-055/execution.webm, evidencias/br/BUG-055/console.log

### BUG-056 — Link externo quebrado (999) — posts
- Severidade: **Low** (baixo)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link para um site de terceiros que respondeu com erro.
- Observado: HTTP 999 ao acessar https://www.linkedin.com/company/tribemd-br/posts/?feedView=all
- URL: https://www.linkedin.com/company/tribemd-br/posts/?feedView=all
- Origem: https://tribemd.com/br/
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/
  2. Clicar no link para https://www.linkedin.com/company/tribemd-br/posts/?feedView=all
  3. A URL retorna 999
- Evidências: evidencias/br/BUG-056/urls.txt, evidencias/br/BUG-056/screenshot.png, evidencias/br/BUG-056/execution.webm, evidencias/br/BUG-056/console.log

### BUG-057 — Link externo quebrado (400) — cookies
- Severidade: **Low** (baixo)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link para um site de terceiros que respondeu com erro.
- Observado: HTTP 400 ao acessar https://www.facebook.com/policies/cookies/
- URL: https://www.facebook.com/policies/cookies/
- Origem: https://tribemd.com/br/politica-de-privacidade/
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/politica-de-privacidade/
  2. Clicar no link "https://www.facebook.com/policies/cookies/"
  3. A URL retorna 400
- Evidências: evidencias/br/BUG-057/urls.txt, evidencias/br/BUG-057/screenshot.png, evidencias/br/BUG-057/execution.webm, evidencias/br/BUG-057/console.log

### BUG-066 — Link externo quebrado (522) — https://mediq.com.br/
- Severidade: **Low** (baixo)
- Locale: BR | Viewport: desktop-chromium
- Impacto ao usuário: O usuario clica num link para um site de terceiros que respondeu com erro.
- Observado: HTTP 522 ao acessar https://mediq.com.br/
- URL: https://mediq.com.br/
- Origem: https://tribemd.com/br/perfil/85/
- Passos para reproduzir:
  1. Abrir https://tribemd.com/br/perfil/85/
  2. Clicar no link "https://mediq.com.br/"
  3. A URL retorna 522
- Evidências: evidencias/br/BUG-066/urls.txt, evidencias/br/BUG-066/screenshot.png, evidencias/br/BUG-066/execution.webm, evidencias/br/BUG-066/console.log
