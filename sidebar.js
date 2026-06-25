const params = new URLSearchParams(location.search);
const site = params.get('site') || 'generic';

const SITE_LABELS = {
  paizo:         'Paizo.com',
  warhorn:       'Warhorn',
  rpgchronicles: 'RPG Chronicles',
  generic:       'Sito esterno'
};

const STEPS = [
  {
    id: 0,
    title: 'Crea account su Paizo.com',
    required: true,
    context: { paizo: 'Sei già nel posto giusto! Segui i passi qui sotto.' },
    substeps: [
      'Vai su <strong>paizo.com</strong> e clicca <em>Sign In → Create an Account</em>.',
      'Scegli email, username e password. Lo username sarà il tuo nome nel registro PFS/SFS.',
      'Conferma l\'email (controlla spam). Poi vai su <em>My Account → Organized Play</em> per trovare il tuo numero PFS.',
    ],
    tip: 'Annota il tuo numero PFS (es. <code>12345678</code>) — ti serve per tutti i passi successivi.',
    link: { url: 'https://paizo.com/organizedPlay', label: 'Paizo Organized Play' }
  },
  {
    id: 1,
    title: 'Registrati su Warhorn',
    required: true,
    context: { warhorn: 'Sei già su Warhorn! Assicurati di aver inserito il numero PFS nel profilo.' },
    substeps: [
      'Vai su <strong>warhorn.net</strong> e clicca <em>Sign up</em>.',
      'Nel profilo, inserisci il tuo <strong>numero PFS/SFS</strong> di Paizo.',
      'Cerca l\'evento a cui vuoi partecipare e iscriviti allo scenario.',
    ],
    tip: 'Warhorn è la piattaforma principale per prenotare i tavoli nelle sessioni italiane.',
    link: { url: 'https://warhorn.net', label: 'Apri Warhorn' }
  },
  {
    id: 2,
    title: 'Registrati su RPG Chronicles',
    required: false,
    context: { rpgchronicles: 'Sei già su RPG Chronicles! Collega il tuo account Paizo dal profilo.' },
    substeps: [
      'Vai su <strong>rpgchronicles.com</strong> e crea un account.',
      'Collega il tuo account Paizo inserendo il numero PFS/SFS.',
      'Potrai tenere traccia di tutti i personaggi e le sessioni giocate in modo digitale.',
    ],
    tip: 'Utile per gestire il diario di gioco (Chronicle Sheets) dei tuoi PG automaticamente.',
    link: { url: 'https://rpgchronicles.com', label: 'Apri RPG Chronicles' }
  },
  {
    id: 3,
    title: 'Unisciti alla comunità italiana',
    required: false,
    substeps: [
      'Entra nel canale <strong>WhatsApp</strong> o nel gruppo <strong>Discord/Telegram</strong> della comunità.',
      'Visita <strong>gdrplayers.it</strong> per scoprire eventi, sessioni e convention.',
      'Se hai dubbi, chiedi nel canale — la comunità aiuta volentieri i nuovi giocatori!',
    ],
    tip: 'Organizzatori disponibili su Telegram: <strong>@ciaroda</strong> — Discord: <strong>roctopus_gm</strong>',
    link: { url: 'https://gdrplayers.it', label: 'Apri gdrplayers.it' }
  }
];

let done = [false, false, false, false];

// ── Icons (SVG strings) ────────────────────────────────────────────────────

const SVG_CHECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
  stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;">
  <polyline points="20 6 9 17 4 12"/>
</svg>`;

const SVG_EXT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;">
  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
</svg>`;

const SVG_INFO = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;flex-shrink:0;margin-top:1px;">
  <circle cx="12" cy="12" r="10"/>
  <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
</svg>`;

const SVG_BOLT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;flex-shrink:0;margin-top:1px;">
  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
</svg>`;

const SVG_CHEV = `<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;flex-shrink:0;stroke:#888780;transition:transform 0.2s;">
  <polyline points="6 9 12 15 18 9"/>
</svg>`;

// ── DOM helpers ────────────────────────────────────────────────────────────

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

// ── Build a step card (no inline event handlers) ───────────────────────────

function buildStep(step) {
  const i = step.id;
  const isDone = done[i];
  const contextMsg = step.context && step.context[site];

  const card = el('div', 'step');
  card.id = 'step-' + i;

  // ── Header ──
  const head = el('div', 'step-head');

  const num = el('div', 'step-num' + (isDone ? ' done' : ''));
  num.id = 'snum-' + i;
  num.innerHTML = isDone ? SVG_CHECK : String(i + 1);

  const title = el('span', 'step-title', step.title);

  const badge = el('span', 'badge ' + (step.required ? 'badge-req' : 'badge-opt'),
    step.required ? 'Obbligatorio' : 'Consigliato');

  const chevWrap = el('span');
  chevWrap.id = 'chev-' + i;
  chevWrap.innerHTML = SVG_CHEV;

  head.append(num, title, badge, chevWrap);

  // ── Body ──
  const body = el('div', 'step-body');
  body.id = 'body-' + i;

  if (contextMsg) {
    const ctx = el('div', 'context-box');
    ctx.innerHTML = SVG_BOLT;
    ctx.appendChild(el('span', null, contextMsg));
    body.appendChild(ctx);
  }

  step.substeps.forEach((text, n) => {
    const sub = el('div', 'substep');
    sub.appendChild(el('div', 'snum', String(n + 1)));
    sub.appendChild(el('span', null, text));
    body.appendChild(sub);
  });

  if (step.tip) {
    const tip = el('div', 'tip');
    tip.innerHTML = SVG_INFO;
    tip.appendChild(el('span', null, step.tip));
    body.appendChild(tip);
  }

  const btnRow = el('div', 'btn-row');

  if (step.link) {
    const a = document.createElement('a');
    a.className = 'btn-link';
    a.href = step.link.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = SVG_EXT + step.link.label;
    btnRow.appendChild(a);
  }

  if (!isDone) {
    const doneBtn = el('button', 'btn-done');
    doneBtn.innerHTML = SVG_CHECK + 'Fatto';
    doneBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      markDone(i);
    });
    btnRow.appendChild(doneBtn);
  }

  body.appendChild(btnRow);

  // ── Toggle on header click ──
  head.addEventListener('click', () => toggleStep(i));

  card.append(head, body);
  return card;
}

// ── Render ─────────────────────────────────────────────────────────────────

function renderSteps() {
  const content = document.getElementById('content');
  content.innerHTML = '';

  const required = STEPS.filter(s => s.required);
  const optional  = STEPS.filter(s => !s.required);

  const reqLabel = el('div', 'section-label', 'Passi obbligatori');
  content.appendChild(reqLabel);
  required.forEach(s => content.appendChild(buildStep(s)));

  const optLabel = el('div', 'section-label', 'Passi consigliati');
  content.appendChild(optLabel);
  optional.forEach(s => content.appendChild(buildStep(s)));
}

function render() {
  document.getElementById('site-name').textContent = SITE_LABELS[site] || site;
  renderSteps();
  updateProgress();
}

// ── Interactions ───────────────────────────────────────────────────────────

function toggleStep(i) {
  const body = document.getElementById('body-' + i);
  const chevEl = document.getElementById('chev-' + i);
  const card = document.getElementById('step-' + i);
  const isOpen = body.classList.contains('visible');
  body.classList.toggle('visible', !isOpen);
  const svg = chevEl.querySelector('svg');
  if (svg) svg.style.transform = isOpen ? '' : 'rotate(180deg)';
  card.classList.toggle('active', !isOpen);
}

function markDone(i) {
  done[i] = true;
  saveDone();

  const body = document.getElementById('body-' + i);
  const chevEl = document.getElementById('chev-' + i);
  const card = document.getElementById('step-' + i);
  const snum = document.getElementById('snum-' + i);

  body.classList.remove('visible');
  const svg = chevEl && chevEl.querySelector('svg');
  if (svg) svg.style.transform = '';
  card.classList.remove('active');

  snum.className = 'step-num done';
  snum.innerHTML = SVG_CHECK;

  updateProgress();

  // Re-render to remove the "Fatto" button
  renderSteps();
  updateProgress();
}

function updateProgress() {
  const count = done.filter(Boolean).length;
  document.getElementById('prog-label').textContent = count + ' di 4 passi completati';
  document.getElementById('prog-fill').style.width = (count / 4 * 100) + '%';
}

// ── Storage ────────────────────────────────────────────────────────────────

function saveDone() {
  chrome.storage.local.set({ pfs_done: done });
}

// ── Close button ───────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      window.parent.postMessage('pfs-close', '*');
    });
  }

  chrome.storage.local.get(['pfs_done'], (res) => {
    if (res.pfs_done) done = res.pfs_done;
    render();
  });
});
