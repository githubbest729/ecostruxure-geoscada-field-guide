/* EcoStruxure Geo SCADA Field Engineering Guide · agac.ae
   Routing, search, theme, install prompt, online status, mimic preview. */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } }

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var themeBtn = $('#themeBtn');
  var metaTheme = $('#meta-theme-color');

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    themeBtn.setAttribute('aria-pressed', String(t === 'light'));
    themeBtn.setAttribute('aria-label', t === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    if (metaTheme) metaTheme.setAttribute('content', t === 'light' ? '#eef1f4' : '#0f1720');
  }
  var savedTheme = safeGet('gsg-theme');
  if (!savedTheme) {
    savedTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  applyTheme(savedTheme);
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    safeSet('gsg-theme', next);
  });

  /* ---------- Drawer ---------- */
  var sidebar = $('#sidebar');
  var scrim = $('#scrim');
  var menuBtn = $('#menuBtn');
  function setDrawer(open) {
    sidebar.classList.toggle('open', open);
    scrim.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
  }
  menuBtn.addEventListener('click', function () { setDrawer(!sidebar.classList.contains('open')); });
  scrim.addEventListener('click', function () { setDrawer(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setDrawer(false); closePick(); }
  });

  /* ---------- Views / routing ---------- */
  var views = $$('.view');
  var navLinks = $$('[data-nav]');
  var main = $('#main');
  var currentView = 'home';

  function showView(name) {
    var found = false;
    views.forEach(function (v) {
      var on = v.getAttribute('data-view') === name;
      v.hidden = !on;
      if (on) found = true;
    });
    if (!found) { name = 'home'; $('[data-view="home"]').hidden = false; }
    currentView = name;
    var group = /^t\d+[a-z]?$/.test(name) ? 'tutorials' : null;
    navLinks.forEach(function (a) {
      var target = a.getAttribute('data-nav');
      var active = target === name || (a.getAttribute('data-group') === 'tutorials' && group === 'tutorials');
      if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    return name;
  }

  function route() {
    var id = decodeURIComponent((location.hash || '#home').slice(1)) || 'home';
    var el = document.getElementById(id);
    if (!el) { showView('home'); window.scrollTo(0, 0); return; }
    var view = el.classList.contains('view') ? el : el.closest('.view');
    if (!view) { showView('home'); return; }
    var name = view.getAttribute('data-view');
    if (name === 'search') name = currentView === 'search' ? 'home' : currentView;
    showView(name);
    setDrawer(false);
    if (el === view) {
      window.scrollTo(0, 0);
    } else {
      el.scrollIntoView({ block: 'start' });
      if (el.classList.contains('term')) {
        el.classList.add('flash');
        setTimeout(function () { el.classList.remove('flash'); }, 1600);
      }
    }
    var h = $('h1', view);
    if (h) document.title = h.textContent + ' · Geo SCADA Field Guide';
  }
  window.addEventListener('hashchange', function () { clearSearch(true); route(); });

  /* ---------- Search ---------- */
  var searchInput = $('#searchInput');
  var searchForm = $('#searchForm');
  var searchView = $('#searchResults');
  var resultList = $('#resultList');
  var searchSummary = $('#searchSummary');
  var index = [];
  var lastView = 'home';

  function buildIndex() {
    index = [];
    $$('[data-search-item]').forEach(function (el) {
      var text = '';
      if (/^H[1-6]$/.test(el.tagName)) {
        text = el.textContent;
        var n = el.nextElementSibling;
        while (n && !/^H[12]$/.test(n.tagName)) { text += ' ' + n.textContent; n = n.nextElementSibling; }
      } else {
        text = el.textContent;
      }
      text = text.replace(/\s+/g, ' ').trim();
      index.push({
        id: el.id,
        title: el.getAttribute('data-title') || el.textContent.trim(),
        section: el.getAttribute('data-section') || '',
        text: text,
        lower: (el.getAttribute('data-title') + ' ' + text).toLowerCase()
      });
    });
  }

  function snippet(text, term) {
    var i = text.toLowerCase().indexOf(term);
    if (i < 0) return text.slice(0, 140);
    var s = Math.max(0, i - 50);
    return (s > 0 ? '…' : '') + text.slice(s, s + 160) + (s + 160 < text.length ? '…' : '');
  }

  function appendHighlighted(parent, text, terms) {
    var lower = text.toLowerCase();
    var pos = 0;
    while (pos < text.length) {
      var best = -1, bestLen = 0;
      terms.forEach(function (t) {
        var i = lower.indexOf(t, pos);
        if (i !== -1 && (best === -1 || i < best)) { best = i; bestLen = t.length; }
      });
      if (best === -1) { parent.appendChild(document.createTextNode(text.slice(pos))); break; }
      if (best > pos) parent.appendChild(document.createTextNode(text.slice(pos, best)));
      var m = document.createElement('mark');
      m.textContent = text.slice(best, best + bestLen);
      parent.appendChild(m);
      pos = best + bestLen;
    }
  }

  function runSearch(q) {
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    var hits = [];
    index.forEach(function (it) {
      var ok = terms.every(function (t) { return it.lower.indexOf(t) !== -1; });
      if (!ok) return;
      var score = 0;
      terms.forEach(function (t) { if (it.title.toLowerCase().indexOf(t) !== -1) score += 10; });
      hits.push({ it: it, score: score });
    });
    hits.sort(function (a, b) { return b.score - a.score; });

    resultList.textContent = '';
    searchSummary.textContent = hits.length
      ? hits.length + (hits.length === 1 ? ' result for “' : ' results for “') + q + '”'
      : 'No results for “' + q + '”. Try a shorter term such as “dnp3”, “port”, or “deadband”.';

    hits.slice(0, 40).forEach(function (h) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + h.it.id;
      var sec = document.createElement('span'); sec.className = 'r-sec'; sec.textContent = h.it.section;
      var ti = document.createElement('span'); ti.className = 'r-title'; appendHighlighted(ti, h.it.title, terms);
      var sn = document.createElement('span'); sn.className = 'r-snip'; appendHighlighted(sn, snippet(h.it.text, terms[0]), terms);
      a.appendChild(sec); a.appendChild(ti); a.appendChild(sn);
      li.appendChild(a);
      resultList.appendChild(li);
    });
  }

  function clearSearch(keepView) {
    if (searchInput.value) searchInput.value = '';
    if (!searchView.hidden) {
      searchView.hidden = true;
    }
    if (!keepView) showView(lastView);
  }

  var debounce;
  searchInput.addEventListener('input', function () {
    clearTimeout(debounce);
    debounce = setTimeout(function () {
      var q = searchInput.value.trim();
      if (q.length < 2) {
        if (!searchView.hidden) { searchView.hidden = true; showView(lastView); }
        return;
      }
      if (searchView.hidden) {
        lastView = currentView;
        views.forEach(function (v) { v.hidden = true; });
        searchView.hidden = false;
        currentView = 'search';
      }
      runSearch(q);
    }, 120);
  });
  searchForm.addEventListener('submit', function (e) { e.preventDefault(); searchInput.blur(); });
  resultList.addEventListener('click', function () {
    // hashchange handler will clear search and route
    setTimeout(function () { if (!searchView.hidden) { clearSearch(true); route(); } }, 0);
  });
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { clearSearch(); }
  });

  /* ---------- Code blocks: copy buttons ---------- */
  $$('pre.code').forEach(function (pre) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy code to clipboard');
    btn.addEventListener('click', function () {
      var text = $('code', pre).textContent;
      var done = function () { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy'; }, 1500); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      } else { fallbackCopy(text); done(); }
    });
    pre.insertBefore(btn, pre.firstChild);
    pre.setAttribute('tabindex', '0');
    pre.setAttribute('role', 'region');
    pre.setAttribute('aria-label', (pre.getAttribute('data-lang') || 'code') + ' code sample');
  });
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  /* ---------- Persistent verification checklists ---------- */
  $$('.checklist').forEach(function (ul) {
    var key = 'gsg-check-' + ul.getAttribute('data-check');
    var saved = [];
    try { saved = JSON.parse(safeGet(key) || '[]'); } catch (e) { saved = []; }
    var boxes = $$('input[type="checkbox"]', ul);
    boxes.forEach(function (b, i) {
      b.checked = !!saved[i];
      b.addEventListener('change', function () {
        safeSet(key, JSON.stringify(boxes.map(function (x) { return x.checked; })));
      });
    });
  });

  /* ---------- Online / offline ---------- */
  var pill = $('#netStatus');
  var pillText = $('#netStatusText');
  var banner = $('#offlineBanner');
  function updateNet() {
    var on = navigator.onLine;
    pill.classList.toggle('offline', !on);
    pillText.textContent = on ? 'Online' : 'Offline';
    banner.hidden = on;
  }
  window.addEventListener('online', updateNet);
  window.addEventListener('offline', updateNet);
  updateNet();

  /* ---------- Install prompt ---------- */
  var installBtn = $('#installBtn');
  var deferredPrompt = null;
  var standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    if (!standalone) installBtn.hidden = false;
  });
  installBtn.addEventListener('click', function () {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(function () { deferredPrompt = null; installBtn.hidden = true; });
    } else if (isIOS) {
      banner.textContent = 'To install on iPhone/iPad: tap Share, then “Add to Home Screen”.';
      banner.hidden = false;
      setTimeout(updateNet, 8000);
    }
  });
  window.addEventListener('appinstalled', function () { installBtn.hidden = true; deferredPrompt = null; });
  if (isIOS && !standalone) installBtn.hidden = false;

  /* ---------- Service worker ---------- */
  if ('serviceWorker' in navigator) {
    var hadController = !!navigator.serviceWorker.controller;
    var reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (hadController && !reloaded) { reloaded = true; location.reload(); }
    });
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js', { scope: './' }).catch(function (err) {
        console.warn('Service worker registration failed:', err);
      });
    });
  }

  /* ---------- Mimic / point preview ---------- */
  var mimic = $('#mimic');
  if (mimic) {
    var pump = $('#pump');
    var pumpState = $('#pumpState');
    var tankFill = $('#tankFill');
    var levelText = $('#levelText');
    var levelIn = $('#level');
    var levelOut = $('#levelOut');
    var alarmBadge = $('#alarmBadge');
    var labLog = $('#labLog');
    var pickMenu = $('#pickMenu');
    var radios = $$('input[name="pstate"]');
    alarmBadge.hidden = false;

    var state = 'stopped';
    var level = 0;

    function log(msg) {
      var t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      labLog.textContent = 'Event log: ' + t + ' · ' + msg;
    }
    function render() {
      mimic.setAttribute('data-pump', state);
      var label = state.toUpperCase();
      pumpState.textContent = label;
      pump.setAttribute('aria-label', 'Pump 1, ' + state + '. Open actions');
      var h = (level / 4) * 166;
      tankFill.setAttribute('height', h.toFixed(1));
      tankFill.setAttribute('y', (208 - h).toFixed(1));
      levelText.textContent = level.toFixed(1) + ' m';
      levelOut.textContent = level.toFixed(1);
      var badges = [];
      if (state === 'fault') badges.push('PUMP FAULT');
      if (level > 3.5) badges.push('HIGH LEVEL');
      alarmBadge.textContent = badges.length ? '⚠ ' + badges.join(' · ') : '';
      radios.forEach(function (r) { r.checked = r.value === state; });
    }
    function setState(s, why) {
      if (s === state) return;
      state = s; render(); log('Pump1 ' + s + (why ? ' (' + why + ')' : ''));
    }
    radios.forEach(function (r) { r.addEventListener('change', function () { setState(r.value, 'point change'); }); });
    levelIn.addEventListener('input', function () {
      var prev = level;
      level = parseFloat(levelIn.value);
      render();
      if (prev <= 3.5 && level > 3.5) log('Level High alarm raised');
      if (prev > 3.5 && level <= 3.5) log('Level High alarm returned to normal');
    });

    function openPick() {
      pickMenu.hidden = false;
      var first = $('button', pickMenu);
      if (first) first.focus();
    }
    function closePick() { if (pickMenu) pickMenu.hidden = true; }
    window.closePick = closePick;
    pump.addEventListener('click', function (e) { e.stopPropagation(); pickMenu.hidden ? openPick() : closePick(); });
    pump.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPick(); }
    });
    document.addEventListener('click', function (e) { if (!pickMenu.contains(e.target)) closePick(); });
    pickMenu.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var act = b.getAttribute('data-act');
      closePick();
      if (act === 'start') {
        if (state === 'fault') log('Start rejected: pump in fault');
        else setState('running', 'operator command');
      } else if (act === 'stop') {
        if (state === 'running') setState('stopped', 'operator command'); else log('Stop ignored: pump not running');
      } else if (act === 'trend') {
        log('Pick action: open trend AGAC.DXB.WPS01.Level');
      } else if (act === 'props') {
        log('Pick action: open details AGAC.DXB.WPS01.Pump1.Run');
      }
      pump.focus();
    });
    render();
  } else {
    window.closePick = function () {};
  }

  /* ---------- Init ---------- */
  buildIndex();
  route();
})();
