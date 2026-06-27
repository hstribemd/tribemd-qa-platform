import { promises as fs } from 'node:fs';
import path from 'node:path';
import { DefectCollector } from '../src/core/defect-collector.js';
import type { Severity, DefectCategory } from '../src/core/types.js';
import { reportDir, runMetaPath } from '../src/helpers/output-paths.js';

const SEV_COLOR: Record<Severity, string> = {
  Critical: '#b71c1c', High: '#e65100', Medium: '#f57f17', Low: '#2e7d32',
};
const SEV_BG: Record<Severity, string> = {
  Critical: '#2d0a0a', High: '#1f0d00', Medium: '#1f1700', Low: '#0a1f0a',
};
const SEV_PT: Record<Severity, string> = {
  Critical: 'Crítico', High: 'Alto', Medium: 'Médio', Low: 'Baixo',
};

const WHAT_TESTED: Record<DefectCategory, string> = {
  'broken-link': 'Cada link da página é requisitado via HTTP para confirmar que responde com sucesso (2xx) em vez de um código de erro.',
  'wrong-redirect': 'O link é seguido e verifica-se que o destino final é o esperado, sem redirecionamentos incorretos.',
  'page-unavailable': 'A URL é acessada e verifica-se que a página responde e carrega para o usuário.',
  'http-error': 'O crawler acessa a URL diretamente e registra o status HTTP retornado pelo servidor.',
  'image-not-loading': 'As imagens da página são inspecionadas no DOM para detectar as que carregaram com falha (naturalWidth = 0).',
  'dead-button': 'Cada elemento clicável do header/rodapé é clicado e observa-se se algo acontece (navegação, modal, aba nova ou mudança de DOM).',
  'broken-menu': 'O menu principal é inspecionado para confirmar que contém links de navegação funcionais.',
  'form-failure': 'O formulário é preenchido e submetido; verifica-se se a resposta é válida.',
  'navigation-error': 'A jornada de navegação é executada passo a passo e cada transição de página é verificada.',
  'truncated-text': 'Elementos de texto são medidos para detectar overflow ou corte por elipse não intencional.',
  'invisible-component': 'Blocos de conteúdo são verificados para garantir que estão visíveis e não ocultos por CSS.',
  'overlapping-elements': 'Elementos interativos são comparados por posição para detectar sobreposição que impediria cliques.',
  'blank-page': 'A página é carregada e verifica-se se conteúdo visível está presente (listagem de itens, título, etc.).',
  'infinite-loader': 'A página é carregada e aguarda-se até o limite; verifica-se se spinners/skeletons ainda estão visíveis.',
  'slow-page': 'O tempo até a página estabilizar (sem mais mudanças de DOM) é medido e comparado ao limite aceitável.',
  'translation-failure': 'O idioma do conteúdo é detectado e comparado ao locale esperado da página.',
  'locale-inconsistency': 'As seções de menu dos três locales (BR/US/ES) são comparadas para detectar ausências ou divergências.',
  'responsive-failure': 'A página é renderizada no viewport configurado e mede-se o overflow horizontal do documento.',
  'visual-regression': 'Um screenshot da página é comparado pixel a pixel com a baseline aprovada anteriormente.',
  'leaked-template': 'O HTML renderizado é inspecionado em busca de padrões de template ({{variavel}}, <%=%>, etc.) visíveis ao usuário.',
};

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c);
}

function readableUrl(raw: string): string {
  try {
    const u = new URL(raw);
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','fbclid','gclid','ref','source'].forEach((p) => u.searchParams.delete(p));
    return decodeURIComponent(u.toString());
  } catch { return raw; }
}

function linkifyText(text: string): string {
  return text.split(/(https?:\/\/\S+)/g).map((part, i) =>
    i % 2 === 0
      ? esc(part)
      : `<a href="${esc(part)}" target="_blank" rel="noopener noreferrer" class="step-link">${esc(part)}</a>`
  ).join('');
}

async function imgDataUri(rel?: string): Promise<string | null> {
  if (!rel) return null;
  try { return `data:image/png;base64,${(await fs.readFile(rel)).toString('base64')}`; }
  catch { return null; }
}

async function readMeta(): Promise<{ pages: number; tests: number }> {
  try { return JSON.parse(await fs.readFile(runMetaPath(), 'utf-8')); }
  catch { return { pages: 0, tests: 0 }; }
}

async function main(): Promise<void> {
  const defects = await DefectCollector.get().readAll();
  const meta = await readMeta();
  const counts: Record<Severity, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  defects.forEach((d) => counts[d.severity]++);

  const locale = (process.env.QA_LOCALE ?? 'br').toUpperCase();
  const toRoot = path.relative(reportDir(), process.cwd()) || '.';
  const evPath = (rel: string) => `${toRoot}/${rel}`.replace(/\\/g, '/');

  // Status banner
  let bannerCls: string;
  let bannerMsg: string;
  if (counts.Critical > 0) {
    bannerCls = 'status-critical';
    bannerMsg = `${counts.Critical} erro${counts.Critical > 1 ? 's' : ''} crítico${counts.Critical > 1 ? 's' : ''} encontrado${counts.Critical > 1 ? 's' : ''} — correção imediata necessária`;
  } else if (counts.High > 0) {
    bannerCls = 'status-high';
    bannerMsg = `${counts.High} erro${counts.High > 1 ? 's' : ''} de severidade alta encontrado${counts.High > 1 ? 's' : ''}`;
  } else if (counts.Medium > 0) {
    bannerCls = 'status-medium';
    bannerMsg = `${counts.Medium} alerta${counts.Medium > 1 ? 's' : ''} de média severidade`;
  } else if (defects.length > 0) {
    bannerCls = 'status-low';
    bannerMsg = `${counts.Low} item${counts.Low > 1 ? 'ns' : ''} de baixa severidade`;
  } else {
    bannerCls = 'status-ok';
    bannerMsg = 'Tudo certo — nenhum defeito encontrado nesta execução';
  }

  const sevPills = (['Critical', 'High', 'Medium', 'Low'] as Severity[])
    .filter((s) => counts[s] > 0)
    .map((s) => `<span class="sp" style="background:${SEV_COLOR[s]}">${SEV_PT[s]}: ${counts[s]}</span>`)
    .join('');

  const summaryLines = [
    `QA TribeMD — ${locale} — ${new Date().toLocaleDateString('pt-BR')}`,
    meta.pages > 0
      ? `${meta.pages} páginas verificadas · ${defects.length} defeito(s) encontrado(s)`
      : `${defects.length} defeito(s) encontrado(s)`,
    `Crítico: ${counts.Critical} | Alto: ${counts.High} | Médio: ${counts.Medium} | Baixo: ${counts.Low}`,
  ];
  const summaryText = summaryLines.join('\n');
  const reportFilename = `tribemd-qa-${locale.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.html`;

  const cards: string[] = [];
  for (const d of defects) {
    const img = await imgDataUri(d.evidence.screenshot);
    const highlight = await imgDataUri(d.evidence.screenshotHighlight);
    const shownImg = highlight ?? img;
    const meta_ = d.meta as Record<string, unknown> | undefined;
    const linkText = meta_?.linkText as string | undefined;
    const videoSrc = d.evidence.video ? evPath(d.evidence.video) : null;

    const urlCell = (label: string, url: string) =>
      `<tr><td class="dk">${label}</td><td class="dv url-cell"><a class="url-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(readableUrl(url))}</a><button class="copy-btn" data-url="${esc(url)}" onclick="copyUrl(this)" title="Copiar URL">⧉</button></td></tr>`;

    const detailRows = [
      urlCell('URL com erro', d.url),
      d.sourceUrl && d.sourceUrl !== d.url ? urlCell('Página anterior', d.sourceUrl) : '',
      linkText ? `<tr><td class="dk">Texto do link</td><td class="dv">"${esc(linkText)}"</td></tr>` : '',
      meta_?.selector ? `<tr><td class="dk">Elemento</td><td class="dv"><code>${esc(String(meta_.selector))}</code></td></tr>` : '',
      `<tr><td class="dk">Ambiente</td><td class="dv">${(d.locale ?? '—').toUpperCase()} &nbsp;•&nbsp; ${esc(d.viewport)}</td></tr>`,
      `<tr><td class="dk">Detectado</td><td class="dv">${new Date(d.timestamp).toLocaleString('pt-BR')}</td></tr>`,
    ].filter(Boolean).join('');

    cards.push(`
<article class="card" data-sev="${d.severity}" style="border-left:4px solid ${SEV_COLOR[d.severity]}">
  <div class="card-head" onclick="this.parentElement.classList.toggle('open')">
    <div class="head-left">
      <span class="sev-badge" style="background:${SEV_COLOR[d.severity]}">${SEV_PT[d.severity]}</span>
      <span class="bug-id">${d.id}</span>
    </div>
    <div class="head-title">
      <span class="htitle">${esc(d.title)}</span>
    </div>
    <div class="head-right">
      <span class="loc-badge">${(d.locale ?? '—').toUpperCase()}</span>
      <span class="chev">▸</span>
    </div>
  </div>

  <div class="card-body" style="background:${SEV_BG[d.severity]}08">
    <div class="jira-section context-box">
      <div class="slabel">Contexto</div>
      <p class="context-p">${esc(d.context)}</p>
    </div>

    <div class="two-col-top">
      <div class="jira-section">
        <div class="slabel">Detalhes do bug</div>
        <table class="dtable">${detailRows}</table>
      </div>
      <div class="right-cols">
        <div class="jira-section">
          <div class="slabel">O que foi testado</div>
          <p>${esc(WHAT_TESTED[d.category] ?? d.category)}</p>
        </div>
        <div class="jira-section">
          <div class="slabel">O que retornou</div>
          <p class="returned-p">${esc(d.returned)}</p>
        </div>
        <div class="jira-section">
          <div class="slabel">Impacto para o usuário</div>
          <p>${esc(d.userImpact)}</p>
        </div>
      </div>
    </div>

    <div class="jira-section">
      <div class="slabel">Passos para reproduzir</div>
      <ol class="steps-ol">${d.steps.map((s) => `<li>${linkifyText(s)}</li>`).join('')}</ol>
    </div>

    <div class="jira-section">
      <div class="slabel">Evidências</div>
      <div class="ev-grid">
        ${shownImg ? `
        <div class="ev-block">
          <div class="ev-label">Screenshot${highlight ? ' (elemento destacado)' : ''}</div>
          <img class="ev-img" src="${shownImg}" loading="lazy" onclick="window.open(this.src)" title="Clique para abrir em tamanho real">
          <div class="ev-hint">Clique para ampliar</div>
        </div>` : ''}
        ${videoSrc ? `
        <div class="ev-block">
          <div class="ev-label">Vídeo de reprodução — trajeto completo do erro</div>
          <video class="ev-vid" controls preload="metadata">
            <source src="${videoSrc}" type="video/webm">
            <p>Seu navegador não suporta vídeo. <a href="${videoSrc}" target="_blank">Abrir vídeo</a></p>
          </video>
          <div class="ev-hint">Mostra: página de origem → ação → erro</div>
        </div>` : (!shownImg ? `<div class="no-ev">Sem evidência de mídia registrada</div>` : '')}
        ${d.evidence.html || d.evidence.logs ? `
        <div class="ev-links">
          ${d.evidence.html ? `<a href="${evPath(d.evidence.html)}" target="_blank">HTML da página</a>` : ''}
          ${d.evidence.logs ? `<a href="${evPath(d.evidence.logs)}" target="_blank">Logs do console</a>` : ''}
        </div>` : ''}
      </div>
    </div>
  </div>
</article>`);
  }

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>QA Report — TribeMD ${locale}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#0d1117;color:#c9d1d9;font-size:14px;line-height:1.5}

/* ── Topbar ── */
.topbar{background:#161b22;border-bottom:1px solid #30363d;padding:14px 32px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:10px;flex:1;min-width:0}
.brand h1{font-size:16px;font-weight:700;color:#e6edf3;white-space:nowrap}
.locale-tag{background:#1f6feb;color:#fff;font-size:11px;font-weight:700;padding:2px 9px;border-radius:4px;letter-spacing:.6px;flex-shrink:0}
.report-meta{color:#8b949e;font-size:12px;white-space:nowrap}
.action-btns{display:flex;gap:6px;flex-wrap:wrap;flex-shrink:0}
.action-btn{background:#21262d;color:#e6edf3;border:1px solid #30363d;border-radius:6px;padding:6px 14px;cursor:pointer;font-size:12px;font-weight:500;white-space:nowrap;line-height:1.4}
.action-btn:hover{background:#30363d;border-color:#8b949e}
.action-btn.primary{background:#1f6feb;border-color:#1f6feb}
.action-btn.primary:hover{background:#388bfd}

/* ── Status banner ── */
.status-banner{padding:11px 32px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:10px}
.status-banner::before{content:'';display:inline-block;width:8px;height:8px;border-radius:50%;background:currentColor;flex-shrink:0}
.status-critical{background:#2d0a0a;color:#ff7b72;border-bottom:1px solid #b71c1c44}
.status-high{background:#1f0d00;color:#ffa657;border-bottom:1px solid #e6510044}
.status-medium{background:#1f1700;color:#e3b341;border-bottom:1px solid #f57f1744}
.status-low{background:#111a0f;color:#7ee787;border-bottom:1px solid #2e7d3244}
.status-ok{background:#0a1f0a;color:#3fb950;border-bottom:1px solid #2e7d3244}

/* ── Stats ── */
.stats-bar{padding:16px 32px;border-bottom:1px solid #21262d;display:flex;align-items:center;gap:24px;flex-wrap:wrap}
.stat-block{text-align:center;min-width:64px}
.stat-n{font-size:26px;font-weight:700;color:#e6edf3;line-height:1}
.stat-l{font-size:11px;color:#8b949e;margin-top:3px}
.vd{width:1px;height:40px;background:#30363d;flex-shrink:0}
.sev-row{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.sp{padding:4px 13px;border-radius:999px;font-size:12px;font-weight:600;color:#fff}

/* ── Toolbar ── */
.toolbar{padding:10px 32px;border-bottom:1px solid #21262d;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.search-input{background:#0d1117;color:#e6edf3;border:1px solid #30363d;border-radius:6px;padding:5px 12px;font-size:12px;width:220px;outline:none}
.search-input:focus{border-color:#58a6ff;background:#111820}
.search-input::placeholder{color:#484f58}
.tb-sep{width:1px;height:20px;background:#30363d;flex-shrink:0;margin:0 2px}
.tb-btn{background:#21262d;color:#e6edf3;border:1px solid #30363d;border-radius:6px;padding:4px 12px;cursor:pointer;font-size:12px}
.tb-btn:hover,.tb-btn.on{background:#1f6feb;border-color:#1f6feb}

/* ── Cards ── */
main{padding:16px 32px 64px}
.card{background:#161b22;border:1px solid #30363d;border-radius:10px;margin-bottom:10px;overflow:hidden;transition:box-shadow .15s}
.card:hover{box-shadow:0 0 0 1px #58a6ff40}
.card-head{display:flex;align-items:center;gap:10px;padding:12px 16px;cursor:pointer;user-select:none}
.card-head:hover{background:#1c2128}
.head-left{display:flex;align-items:center;gap:8px;flex-shrink:0}
.sev-badge{padding:2px 9px;border-radius:5px;color:#fff;font-size:11px;font-weight:700;letter-spacing:.4px;text-transform:uppercase}
.bug-id{font-family:ui-monospace,monospace;font-size:12px;color:#8b949e;white-space:nowrap}
.head-title{flex:1;min-width:0}
.htitle{font-size:13px;font-weight:600;color:#e6edf3}
.head-right{display:flex;align-items:center;gap:8px;flex-shrink:0}
.loc-badge{font-size:11px;color:#8b949e;border:1px solid #30363d;border-radius:5px;padding:2px 7px}
.chev{color:#8b949e;font-size:12px;transition:transform .15s}
.card.open .chev{transform:rotate(90deg)}
.card-body{display:none;padding:0 16px 20px;border-top:1px solid #21262d}
.card.open .card-body{display:block}

/* ── Seções ── */
.jira-section{margin-top:16px}
.slabel{font-size:11px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#58a6ff;margin-bottom:8px}
.jira-section p{font-size:13px;color:#c9d1d9;line-height:1.6}
.context-box{background:#1c2128;border-left:3px solid #58a6ff;border-radius:0 6px 6px 0;padding:12px 14px;margin-top:16px}
.context-p{font-size:13px;color:#e6edf3;line-height:1.7}
.two-col-top{display:grid;grid-template-columns:minmax(300px,auto) 1fr;gap:16px;margin-top:16px}
@media(max-width:900px){.two-col-top{grid-template-columns:1fr}}
.right-cols{display:flex;flex-direction:column;gap:0}
.dtable{border-collapse:collapse;width:100%;font-size:13px}
.dtable tr{border-bottom:1px solid #21262d}
.dtable tr:last-child{border-bottom:none}
.dk{color:#8b949e;padding:6px 12px 6px 0;white-space:nowrap;vertical-align:top;font-weight:500;width:130px}
.dv{color:#e6edf3;padding:6px 0;word-break:break-word}
.url-cell{display:flex;align-items:baseline;flex-wrap:wrap;gap:4px}
.url-cell .url-link{font-family:ui-monospace,monospace;font-size:11px;color:#79c0ff;word-break:break-all;text-decoration:none;min-width:0;flex:1}
.url-cell .url-link:hover{text-decoration:underline;color:#a5d6ff}
.copy-btn{background:none;border:1px solid #30363d;border-radius:4px;color:#8b949e;cursor:pointer;font-size:12px;line-height:1;padding:1px 5px;flex-shrink:0}
.copy-btn:hover{background:#21262d;color:#e6edf3;border-color:#58a6ff}
.copy-btn.ok{color:#3fb950;border-color:#3fb950}
code{background:#0d1117;border:1px solid #30363d;border-radius:4px;padding:1px 6px;font-size:11px;font-family:ui-monospace,monospace}
.returned-p{font-weight:600;color:#f0883e}
.steps-ol{padding-left:18px;font-size:13px;color:#c9d1d9}
.steps-ol li{margin-bottom:4px;line-height:1.5}
.step-link{color:#79c0ff;text-decoration:none;word-break:break-all}
.step-link:hover{text-decoration:underline}
.ev-grid{display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start;margin-top:4px}
.ev-block{flex:1;min-width:260px;max-width:600px}
.ev-label{font-size:11px;color:#8b949e;margin-bottom:6px;font-weight:500}
.ev-img{width:100%;border:1px solid #30363d;border-radius:6px;cursor:zoom-in;display:block;background:#fff}
.ev-vid{width:100%;border-radius:6px;border:1px solid #30363d;max-height:340px;display:block;background:#000}
.ev-hint{font-size:11px;color:#8b949e;margin-top:4px}
.ev-links{display:flex;flex-direction:column;gap:6px;margin-top:4px;font-size:12px}
.ev-links a{color:#58a6ff;text-decoration:none}
.ev-links a:hover{text-decoration:underline}
.no-ev{color:#8b949e;font-size:13px;font-style:italic}
a{color:#58a6ff}
.empty{color:#8b949e;text-align:center;padding:48px 0;font-size:14px}

/* ── Impressão / PDF ── */
@media print{
  .action-btns,.toolbar{display:none!important}
  body{background:#fff;color:#111}
  .topbar{background:#fff;border-bottom:2px solid #000;padding:12px 16px}
  .brand h1{color:#000}
  .locale-tag{background:#1f6feb;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .report-meta{color:#555}
  .status-banner{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .stats-bar{background:#fafafa;border-bottom:1px solid #ddd}
  .stat-n{color:#000}
  .stat-l{color:#555}
  .vd{background:#ddd}
  .sp{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .card{background:#fff;border:1px solid #ccc;break-inside:avoid;margin-bottom:8px;box-shadow:none!important}
  .card-head{background:#fafafa!important}
  .sev-badge{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .htitle,.context-p{color:#000}
  .card-body{display:block!important;background:#fff!important}
  .context-box{background:#f0f4ff!important;border-left:3px solid #1f6feb;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .slabel{color:#1f6feb}
  .dk{color:#555}
  .dv,.jira-section p,.steps-ol{color:#111}
  .returned-p{color:#c62400}
  .url-cell .url-link{color:#0055cc}
  .step-link{color:#0055cc}
  .copy-btn{display:none}
  .ev-img{max-height:280px;width:auto;border:1px solid #ccc}
  .ev-vid{display:none}
  .ev-hint{display:none}
}
</style>
</head>
<body>

<div class="topbar">
  <div class="brand">
    <h1>QA Report — TribeMD</h1>
    <span class="locale-tag">${locale}</span>
  </div>
  <div class="report-meta">Gerado em ${new Date().toLocaleString('pt-BR')}</div>
  <div class="action-btns">
    <button class="action-btn" onclick="copySummary(this)" title="Copia um resumo pronto para colar no WhatsApp, Slack ou e-mail">Copiar resumo</button>
    <button class="action-btn" onclick="window.print()" title="Abre o diálogo de impressão — use 'Salvar como PDF' para exportar">Imprimir / PDF</button>
    <button class="action-btn primary" onclick="downloadReport()" title="Baixa este painel como arquivo HTML — basta abrir no navegador para visualizar">Baixar relatório</button>
  </div>
</div>

<div class="status-banner ${bannerCls}">${bannerMsg}</div>

<div class="stats-bar">
  ${meta.pages > 0 ? `<div class="stat-block"><div class="stat-n">${meta.pages}</div><div class="stat-l">Páginas verificadas</div></div><div class="vd"></div>` : ''}
  <div class="stat-block"><div class="stat-n">${defects.length}</div><div class="stat-l">Defeitos encontrados</div></div>
  ${sevPills ? `<div class="vd"></div><div class="sev-row">${sevPills}</div>` : ''}
</div>

<div class="toolbar">
  <input class="search-input" type="search" placeholder="Buscar por URL, título, erro…" oninput="search(this.value)" aria-label="Buscar defeitos">
  <div class="tb-sep"></div>
  <button class="tb-btn on" data-f="all" onclick="filt(this,'all')">Todos (${defects.length})</button>
  ${counts.Critical > 0 ? `<button class="tb-btn" data-f="Critical" onclick="filt(this,'Critical')">Crítico (${counts.Critical})</button>` : ''}
  ${counts.High > 0 ? `<button class="tb-btn" data-f="High" onclick="filt(this,'High')">Alto (${counts.High})</button>` : ''}
  ${counts.Medium > 0 ? `<button class="tb-btn" data-f="Medium" onclick="filt(this,'Medium')">Médio (${counts.Medium})</button>` : ''}
  ${counts.Low > 0 ? `<button class="tb-btn" data-f="Low" onclick="filt(this,'Low')">Baixo (${counts.Low})</button>` : ''}
  <div class="tb-sep"></div>
  <button class="tb-btn" onclick="document.querySelectorAll('.card').forEach(c=>c.classList.add('open'))">Expandir tudo</button>
  <button class="tb-btn" onclick="document.querySelectorAll('.card').forEach(c=>c.classList.remove('open'))">Recolher tudo</button>
</div>

<main>
  ${cards.join('\n') || '<p class="empty">Nenhum defeito registrado nesta execução.</p>'}
</main>

<script>
const SUMMARY_TEXT = ${JSON.stringify(summaryText)};
const REPORT_FILENAME = ${JSON.stringify(reportFilename)};

function filt(btn, sev) {
  document.querySelectorAll('.toolbar button[data-f]').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  applyFilters();
}

function search() {
  applyFilters();
}

function applyFilters() {
  const sev = document.querySelector('.toolbar button[data-f].on')?.dataset.f || 'all';
  const term = (document.querySelector('.search-input').value || '').toLowerCase();
  document.querySelectorAll('.card').forEach(c => {
    const matchSev = sev === 'all' || c.dataset.sev === sev;
    const matchQ = !term || c.textContent.toLowerCase().includes(term);
    c.style.display = (matchSev && matchQ) ? '' : 'none';
  });
}

function copyUrl(btn) {
  const url = btn.dataset.url;
  const done = () => {
    btn.classList.add('ok'); btn.textContent = '✓';
    setTimeout(() => { btn.textContent = '⧉'; btn.classList.remove('ok'); }, 1500);
  };
  if (navigator.clipboard) { navigator.clipboard.writeText(url).then(done); }
  else { fallbackCopy(url); done(); }
}

function copySummary(btn) {
  const done = () => {
    const prev = btn.textContent;
    btn.textContent = 'Copiado!';
    setTimeout(() => { btn.textContent = prev; }, 2000);
  };
  if (navigator.clipboard) { navigator.clipboard.writeText(SUMMARY_TEXT).then(done); }
  else { fallbackCopy(SUMMARY_TEXT); done(); }
}

function fallbackCopy(text) {
  const ta = Object.assign(document.createElement('textarea'), {
    value: text, style: 'position:fixed;opacity:0'
  });
  document.body.appendChild(ta); ta.focus(); ta.select();
  document.execCommand('copy'); document.body.removeChild(ta);
}

function downloadReport() {
  const html = '<!doctype html>' + document.documentElement.outerHTML;
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([html], {type: 'text/html;charset=utf-8'})),
    download: REPORT_FILENAME
  });
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); document.body.removeChild(a); }, 3000);
}
</script>
</body>
</html>`;

  await fs.mkdir(reportDir(), { recursive: true });
  const out = path.join(reportDir(), 'dashboard.html');
  await fs.writeFile(out, html, 'utf-8');
  console.log(`Dashboard gerado em ${out} (${defects.length} defeito(s))`);
}

main().catch((e) => { console.error(e); process.exit(1); });
