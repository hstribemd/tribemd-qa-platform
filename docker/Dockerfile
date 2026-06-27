# Imagem oficial do Playwright já traz browsers + dependências de sistema.
FROM mcr.microsoft.com/playwright:v1.49.0-noble

WORKDIR /app

# Java é necessário apenas para gerar o relatório Allure
RUN apt-get update && apt-get install -y --no-install-recommends default-jre-headless \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .

# por padrão roda a auditoria completa e gera relatórios
CMD ["sh", "-c", "npm run full-audit; npm run report:all"]
