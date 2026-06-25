(() => {
  if (document.getElementById('pfs-sidebar-root')) return;

  const SIDEBAR_WIDTH = '360px';

  // Detect which site we're on
  function detectSite() {
    const host = location.hostname;
    if (host.includes('paizo.com'))         return 'paizo';
    if (host.includes('warhorn.net'))       return 'warhorn';
    if (host.includes('rpgchronicles.net')) return 'rpgchronicles';
    return 'generic';
  }

  // Detect current page context within the site
  function detectPage(site) {
    const path = location.pathname + location.search;
    if (site === 'paizo') {
      if (path.includes('create') || path.includes('register')) return 'register';
      if (path.includes('organizedPlay') || path.includes('organized-play')) return 'organized';
      if (path.includes('signin') || path.includes('login')) return 'login';
      return 'generic';
    }
    if (site === 'warhorn') {
      if (path.includes('sign_up') || path.includes('register')) return 'register';
      if (path.includes('profile') || path.includes('account')) return 'profile';
      if (path.includes('sign_in') || path.includes('login')) return 'login';
      return 'generic';
    }
    if (site === 'rpgchronicles') {
      if (path.includes('register') || path.includes('signup')) return 'register';
      if (path.includes('profile') || path.includes('characters')) return 'profile';
      return 'generic';
    }
    return 'generic';
  }

  const site = detectSite();
  const page = detectPage(site);
  const sidebarUrl = chrome.runtime.getURL('sidebar.html')
    + '?site=' + site + '&page=' + page;

  // Root container
  const root = document.createElement('div');
  root.id = 'pfs-sidebar-root';
  document.body.appendChild(root);

  // Toggle button
  const btn = document.createElement('button');
  btn.id = 'pfs-toggle-btn';
  btn.setAttribute('aria-label', 'Apri guida PFS/SFS Italia');
  btn.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
    <span>Guida PFS/SFS</span>
  `;
  root.appendChild(btn);

  // Sidebar iframe
  const sidebar = document.createElement('div');
  sidebar.id = 'pfs-sidebar';
  sidebar.setAttribute('aria-hidden', 'true');

  const iframe = document.createElement('iframe');
  iframe.id = 'pfs-sidebar-iframe';
  iframe.src = sidebarUrl;
  iframe.setAttribute('title', 'Guida registrazione Gioco Organizzato Italia');
  sidebar.appendChild(iframe);
  root.appendChild(sidebar);

  // State
  let open = false;

  function setSidebarOpen(val) {
    open = val;
    sidebar.classList.toggle('pfs-open', open);
    btn.classList.toggle('pfs-active', open);
    sidebar.setAttribute('aria-hidden', String(!open));
    // Push page content
    document.body.style.marginRight = open ? SIDEBAR_WIDTH : '';
    document.body.style.transition = 'margin-right 0.28s ease';
  }

  btn.addEventListener('click', () => setSidebarOpen(!open));

  // Listen for close message from iframe
  window.addEventListener('message', (e) => {
    if (e.data === 'pfs-close') setSidebarOpen(false);
  });

  // Restore state across navigations
  chrome.storage.local.get(['pfs_open'], (res) => {
    if (res.pfs_open) setSidebarOpen(true);
  });

  btn.addEventListener('click', () => {
    chrome.storage.local.set({ pfs_open: open });
  });
})();
