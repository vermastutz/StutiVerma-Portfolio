// global.js — single, robust nav for GitHub Pages project sites

// Figure out the project root (works on any subpage)
const ROOT = (() => {
    const { hostname, pathname } = window.location;
    if (hostname.endsWith('github.io')) {
      // Path looks like: /<repo>/... -> return "/<repo>/"
      const firstSeg = pathname.split('/').filter(Boolean)[0] || '';
      return firstSeg ? `/${firstSeg}/` : '/';
    }
    // Local dev (e.g., a simple server at repo root)
    return '/';
  })();
  
  // Build links absolute *within* the project
  const LINKS = [
    { title: 'Home',     href: `${ROOT}` },
    { title: 'Resume',   href: `${ROOT}resume/` },
    { title: 'Projects', href: `${ROOT}projects/` },
    { title: 'Contact',  href: `${ROOT}contact/` },
    { title: 'GitHub',   href: 'https://github.com/vermastutz', external: true },
    { title: 'LinkedIn', href: 'https://www.linkedin.com/in/stutiverma04/', external: true },
  ];
  
  // Ensure a <nav> exists, then render it
  (function renderNav() {
    let nav = document.querySelector('nav');
    if (!nav) {
      nav = document.createElement('nav');
      document.body.prepend(nav);
    }
    nav.innerHTML = LINKS.map(l =>
      `<a href="${l.href}" ${l.external ? 'target="_blank" rel="noopener"' : ''}>${l.title}</a>`
    ).join('');
  
    // Highlight current tab
    const here = new URL(location.href).pathname.replace(/\/+$/, '/') || '/';
    [...nav.querySelectorAll('a')].forEach(a => {
      const path = new URL(a.href).pathname.replace(/\/+$/, '/') || '/';
      if (path === here) a.classList.add('current');
    });
  })();
  
  // ---- Speak button (unchanged, just consolidated here)
  document.getElementById("speak-name")?.addEventListener("click", () => {
    const utter = new SpeechSynthesisUtterance("Stoo-tee Ver-mah");
    utter.rate = 0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  });
  