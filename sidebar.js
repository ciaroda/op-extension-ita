const params = new URLSearchParams(location.search);
const site = params.get('site') || 'generic';

const STORAGE_KEY = 'pfs_onboarding_v2';

const SITE_LABELS = {
  paizo: 'Paizo.com',
  warhorn: 'Warhorn',
  pathbuilder: 'Pathbuilder',
  rpgchronicles: 'RPG Chronicles',
  discord: 'Discord',
  telegram: 'Telegram',
  organizedplayitalia: 'Organized Play Italia',
  generic: 'Sito esterno'
};

const INTERESTS = [
  { id: 'inPerson', label: 'Gioco in presenza' },
  { id: 'online', label: 'Gioco online' },
  { id: 'joinSession', label: 'Iscrizione a una partita' },
  { id: 'pfs1', label: 'PFS1' },
  { id: 'pfs2', label: 'PFS2' },
  { id: 'sfs1', label: 'SFS1' },
  { id: 'sfs2', label: 'SFS2' }
];

const INITIAL_STATE = {
  interests: {
    pfs1: false,
    pfs2: true,
    sfs1: false,
    sfs2: false,
    inPerson: true,
    online: true,
    joinSession: true
  },
  completed: {}
};

const GUIDE = [
  {
    id: 'paizo',
    number: '1',
    title: 'Paizo',
    required: true,
    context: { paizo: 'Sei su Paizo: completa account, Organized Play e i personaggi dei sistemi che ti interessano.' },
    note: 'Il numero Organized Play ricevuto su Paizo ti servira su Warhorn, RPG Chronicles e ai tavoli.',
    tasks: [
      {
        id: 'paizo-account',
        number: '1.a',
        title: 'Registrazione account Paizo',
        required: true,
        url: 'https://paizo.com/cgi-bin/WebObjects/Store.woa/wa/DirectAction/signIn?path=organizedplay/myAccount',
        detail: 'Crea o accedi all account Paizo.'
      },
      {
        id: 'paizo-op',
        number: '1.b',
        title: 'Registrazione ad Organized Play',
        required: true,
        url: 'https://paizo.com/paizo/account',
        detail: 'Attiva Organized Play e annota il tuo numero.'
      },
      {
        id: 'paizo-pfs1',
        number: '1.c',
        title: 'Creazione personaggio PFS1',
        ifInterest: 'pfs1',
        url: 'https://paizo.com/organizedplay/myAccount',
        detail: 'Da fare solo se vuoi giocare Pathfinder Society prima edizione.'
      },
      {
        id: 'paizo-pfs2',
        number: '1.d',
        title: 'Creazione personaggio PFS2',
        ifInterest: 'pfs2',
        url: 'https://paizo.com/organizedplay/myAccount',
        detail: 'Da fare se vuoi giocare Pathfinder Society seconda edizione.'
      },
      {
        id: 'paizo-sfs1',
        number: '1.e',
        title: 'Creazione personaggio SFS1',
        ifInterest: 'sfs1',
        url: 'https://paizo.com/organizedplay/myAccount',
        detail: 'Da fare se vuoi giocare Starfinder Society prima edizione.'
      },
      {
        id: 'paizo-sfs2',
        number: '1.f',
        title: 'Creazione personaggio SFS2',
        ifInterest: 'sfs2',
        url: 'https://paizo.com/organizedplay/myAccount',
        detail: 'Da fare se vuoi giocare Starfinder Society seconda edizione.'
      }
    ]
  },
  {
    id: 'warhorn',
    number: '2',
    title: 'Warhorn',
    required: true,
    context: { warhorn: 'Sei su Warhorn: crea l account, registrati agli eventi corretti e poi scegli la sessione.' },
    note: 'Warhorn e la piattaforma dove trovi gli eventi e ti prenoti alle partite.',
    tasks: [
      {
        id: 'warhorn-account',
        number: '2.a',
        title: 'Creazione account',
        required: true,
        url: 'https://warhorn.net/signup',
        detail: 'Crea l account e completa il profilo.'
      },
      {
        id: 'warhorn-live',
        number: '2.b',
        title: 'Registrazione evento gioco in presenza',
        ifInterest: 'inPerson',
        url: 'https://warhorn.net/events/opil',
        detail: 'Da fare se vuoi giocare dal vivo.'
      },
      {
        id: 'warhorn-online',
        number: '2.c',
        title: 'Registrazione evento gioco online',
        ifInterest: 'online',
        url: 'https://warhorn.net/events/OPO-Italia',
        detail: 'Da fare se vuoi giocare online.'
      },
      {
        id: 'warhorn-session',
        number: '2.d',
        title: 'Iscrizione a una sessione di gioco',
        ifInterest: 'joinSession',
        url: 'https://warhorn.net/events/OPO-Italia/schedule/sessions/b2d7d7c0-a866-4741-9524-aac5e7b8261c',
        detail: 'Il link cambia per ogni partita: usa questo solo come esempio del formato.'
      },
      {
        id: 'warhorn-games',
        number: '2.e',
        title: 'Visualizzazione partite in programma',
        optional: true,
        url: 'https://warhorn.net/games/search?l=it&c=64&c=108',
        detail: 'Link utile da salvare tra i preferiti.'
      }
    ]
  },
  {
    id: 'pathbuilder',
    number: '3',
    title: 'Pathbuilder',
    optional: true,
    context: { pathbuilder: 'Sei su Pathbuilder: scegli Core Only se sei alle prime armi.' },
    note: 'Opzionale, ma comodo per creare personaggi PF2/SF2. Le versioni Android e Mac non gestiscono Starfinder 2.',
    tasks: [
      {
        id: 'pathbuilder-open',
        number: '3',
        title: 'Apri Pathbuilder',
        optional: true,
        url: 'https://pathbuilder2e.com/',
        detail: 'Usalo per creare personaggi Pathfinder 2 o Starfinder 2.'
      },
      {
        id: 'pathbuilder-create',
        number: '3.a',
        title: 'Creazione del personaggio',
        optional: true,
        url: 'https://pathbuilder2e.com/',
        detail: 'Per giocatori neofiti: New Character, poi Core Only nella schermata iniziale.'
      },
      {
        id: 'pathbuilder-pf2-pregen',
        number: '3.a',
        title: 'Pregenerati Pathfinder 2',
        optional: true,
        url: 'https://downloads.paizo.com/Iconic+Pregenerated+Characters/Pathfinder+2E+Remaster+Pregens+(CUP27E).zip',
        detail: 'Alternativa rapida alla creazione del personaggio.'
      },
      {
        id: 'pathbuilder-sf2-pregen',
        number: '3.a',
        title: 'Pregenerati Starfinder 2',
        optional: true,
        url: 'https://downloads.paizo.com/Iconic+Pregenerated+Characters/Starfinder+2E+Pregens+(CUP28E).zip',
        detail: 'Alternativa rapida alla creazione del personaggio.'
      }
    ],
    images: [
      { src: 'assets/pathbuilder-home.png', alt: 'Pathbuilder: scelta New Character' },
      { src: 'assets/pathbuilder-core-only.png', alt: 'Pathbuilder: scelta Core Only' }
    ]
  },
  {
    id: 'rpgchronicles',
    number: '4',
    title: 'RPG Chronicles',
    conditional: 'online',
    context: { rpgchronicles: 'Sei su RPG Chronicles: crea l account e registra il PG alla sessione quando richiesto.' },
    note: 'Obbligatorio per il gioco online, facoltativo per il gioco in presenza.',
    tasks: [
      {
        id: 'rpg-account',
        number: '4.a',
        title: 'Creazione account',
        ifInterest: 'online',
        url: 'https://www.rpgchronicles.net/login',
        detail: 'Crea un account o accedi.'
      },
      {
        id: 'rpg-session',
        number: '4.b',
        title: 'Registrazione di un PG a una sessione',
        ifInterest: 'joinSession',
        url: 'https://www.rpgchronicles.net/session/16ca7ccd-608c-4a2b-9e2f-2f9234f4024f/pregame',
        detail: 'Il link cambia per ogni partita: usa questo solo come esempio del formato.'
      }
    ]
  },
  {
    id: 'social',
    number: '5',
    title: 'Social e supporto',
    optional: true,
    context: {
      discord: 'Sei su Discord: entra nel server adatto al modo in cui giochi.',
      telegram: 'Sei su Telegram: utile se preferisci questo canale per il gioco in presenza.',
      organizedplayitalia: 'Sei sul sito Organized Play Italia: qui trovi riferimenti e aggiornamenti.'
    },
    note: 'Canali utili anche per ricevere supporto durante le registrazioni.',
    tasks: [
      {
        id: 'social-discord-live',
        number: '5.a',
        title: 'Discord gioco in presenza',
        ifInterest: 'inPerson',
        recommended: true,
        url: 'https://discord.gg/sA7X8EDbj9',
        detail: 'Raccomandato per chi gioca in presenza.'
      },
      {
        id: 'social-discord-online',
        number: '5.b',
        title: 'Discord gioco online',
        ifInterest: 'online',
        recommended: true,
        url: 'https://discord.gg/CqyMhUtzjn',
        detail: 'Raccomandato per chi gioca online.'
      },
      {
        id: 'social-telegram-live',
        number: '5.c',
        title: 'Telegram gioco in presenza',
        optional: true,
        url: 'https://t.me/OrgPlayItaLive',
        detail: 'Discord e consigliato; Telegram resta disponibile se lo preferisci.'
      },
      {
        id: 'social-site',
        number: '5.d',
        title: 'Sito web Organized Play Italia',
        optional: true,
        url: 'https://www.organizedplayitalia.it/',
        detail: 'Punto di riferimento pubblico per informazioni e contatti.'
      }
    ]
  }
];

let state = structuredClone(INITIAL_STATE);

const SVG_CHECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;

const SVG_EXT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;

const SVG_INFO = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/>
  <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

const SVG_CHEV = `<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`;

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function withHtml(tag, cls, html) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  node.innerHTML = html;
  return node;
}

function isTaskVisible(task) {
  if (!task.ifInterest) return true;
  return Boolean(state.interests[task.ifInterest]);
}

function isTaskRequired(task, step) {
  if (task.optional || step.optional) return false;
  if (step.conditional && !state.interests[step.conditional]) return false;
  if (task.ifInterest) return Boolean(state.interests[task.ifInterest]);
  return Boolean(task.required || step.required);
}

function visibleTasks() {
  return GUIDE.flatMap(step => step.tasks.filter(isTaskVisible).map(task => ({ step, task })));
}

function requiredTasks() {
  return visibleTasks().filter(({ step, task }) => isTaskRequired(task, step));
}

function saveState() {
  chrome.storage.local.set({ [STORAGE_KEY]: state });
}

function mergeState(saved) {
  const merged = structuredClone(INITIAL_STATE);
  if (saved && typeof saved === 'object') {
    merged.interests = { ...merged.interests, ...(saved.interests || {}) };
    merged.completed = { ...(saved.completed || {}) };
  }
  return merged;
}

function setCompleted(id, value) {
  state.completed[id] = value;
  saveState();
  render();
}

function setInterest(id, value) {
  state.interests[id] = value;
  saveState();
  render();
}

function renderInterests() {
  const wrap = document.getElementById('interest-panel');
  wrap.innerHTML = '';

  INTERESTS.forEach(item => {
    const label = el('label', 'interest-chip');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = Boolean(state.interests[item.id]);
    input.addEventListener('change', () => setInterest(item.id, input.checked));

    label.append(input, el('span', null, item.label));
    wrap.appendChild(label);
  });
}

function renderStep(step) {
  const tasks = step.tasks.filter(isTaskVisible);
  if (!tasks.length) return null;

  const doneCount = tasks.filter(task => state.completed[task.id]).length;
  const card = el('section', 'step');
  card.id = `step-${step.id}`;

  const header = el('button', 'step-head');
  header.type = 'button';
  header.setAttribute('aria-expanded', 'false');

  const num = el('span', 'step-num', step.number);
  const text = el('span', 'step-heading');
  text.append(el('span', 'step-title', step.title), el('span', 'step-meta', `${doneCount}/${tasks.length} completati`));

  const badgeLabel = step.required ? 'Obbligatorio' : step.conditional ? 'Obbligatorio se online' : 'Opzionale';
  const badgeClass = step.required || step.conditional ? 'badge badge-req' : 'badge badge-opt';
  const badge = el('span', badgeClass, badgeLabel);
  const chev = withHtml('span', 'chev-wrap', SVG_CHEV);

  header.append(num, text, badge, chev);

  const body = el('div', 'step-body');

/*   const contextMsg = step.context && step.context[site];
  if (contextMsg) {
    const ctx = withHtml('div', 'context-box', SVG_INFO);
    ctx.append(el('span', null, contextMsg));
    body.append(ctx);
  } */

  if (step.note) {
    const note = withHtml('div', 'tip', SVG_INFO);
    note.append(el('span', null, step.note));
    body.append(note);
  }

  if (step.images) {
    const gallery = el('div', 'image-gallery');
    step.images.forEach(image => {
      const img = document.createElement('img');
      img.src = chrome.runtime.getURL(image.src);
      img.alt = image.alt;
      img.loading = 'lazy';
      gallery.append(img);
    });
    body.append(gallery);
  }

  tasks.forEach(task => body.append(renderTask(task, step)));

  header.addEventListener('click', () => {
    const isOpen = body.classList.toggle('visible');
    header.setAttribute('aria-expanded', String(isOpen));
    card.classList.toggle('active', isOpen);
  });

  card.append(header, body);
  return card;
}

function renderTask(task, step) {
  const row = el('div', 'task');
  const checked = Boolean(state.completed[task.id]);
  const required = isTaskRequired(task, step);

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-check';
  checkbox.checked = checked;
  checkbox.addEventListener('change', () => setCompleted(task.id, checkbox.checked));

  const main = el('div', 'task-main');
  const titleRow = el('div', 'task-title-row');
  titleRow.append(el('span', 'task-number', task.number), el('strong', null, task.title));
  titleRow.append(el('span', required ? 'mini-badge mini-req' : 'mini-badge', required ? 'Da fare' : task.recommended ? 'Raccomandato' : 'Facoltativo'));

  main.append(titleRow, el('p', 'task-detail', task.detail));

  const actions = el('div', 'btn-row');
  const link = document.createElement('a');
  link.className = 'btn-link';
  link.href = task.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.innerHTML = `${SVG_EXT}<span>Apri link</span>`;
  actions.append(link);
  main.append(actions);

  row.append(checkbox, main);
  return row;
}

function renderSteps() {
  const content = document.getElementById('content');
  content.innerHTML = '';

  GUIDE.forEach(step => {
    const node = renderStep(step);
    if (node) content.append(node);
  });
}

function updateProgress() {
  const required = requiredTasks();
  const done = required.filter(({ task }) => state.completed[task.id]).length;
  const total = required.length || 1;
  document.getElementById('prog-label').textContent = `${done} di ${required.length} attivita obbligatorie completate`;
  document.getElementById('prog-fill').style.width = `${Math.round((done / total) * 100)}%`;
}

function render() {
  document.getElementById('site-name').textContent = SITE_LABELS[site] || SITE_LABELS.generic;
  const siteGuide = GUIDE.find(g => g.context?.[site]);
  const siteContext = document.getElementById('site-context');
  if (siteContext) {
    siteContext.textContent = siteGuide?.context?.[site] || 'Contesto non disponibile';
  }
  renderInterests();
  renderSteps();
  updateProgress();
}

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      window.parent.postMessage('pfs-close', '*');
    });
  }

  chrome.storage.local.get([STORAGE_KEY], res => {
    state = mergeState(res[STORAGE_KEY]);
    render();
  });
});
