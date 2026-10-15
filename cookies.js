/* cookies.js — aviso de cookies y carga de Google Analytics solo con consentimiento.
   La elección se guarda 12 meses en este navegador (localStorage, no es una cookie).
   window.tisCookies() vuelve a abrir el aviso (se usa en /cookies/). */
(function () {
  var GA_ID = 'G-E5D2H8N96Y';
  var KEY = 'tis-cookies';
  var MAX_AGE = 365 * 24 * 60 * 60 * 1000;

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (v && (v.ok === true || v.ok === false) && Date.now() - v.t < MAX_AGE) return v.ok;
    } catch (e) {}
    return null;
  }
  function save(ok) {
    try { localStorage.setItem(KEY, JSON.stringify({ ok: ok, t: Date.now() })); } catch (e) {}
  }

  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }
  function clearGA() {
    // Borra las cookies de Analytics si se retira el consentimiento
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (/^_ga/.test(name)) {
        ['', '; domain=.' + host, '; domain=' + location.hostname].forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }

  var css =
    '#tis-cookies{position:fixed;left:12px;right:12px;bottom:12px;z-index:1000;max-width:560px;margin:0 auto;' +
    'background:#111110;color:#F5F3EC;border:1px solid rgba(201,162,39,.45);border-radius:8px;padding:16px;' +
    'box-shadow:0 12px 40px rgba(0,0,0,.6);font-family:"Space Grotesk",system-ui,sans-serif;font-size:.9rem;line-height:1.55}' +
    '#tis-cookies p{margin:0 0 12px}#tis-cookies a{color:#E8BD47;text-decoration:underline}' +
    '#tis-cookies .tc-row{display:flex;gap:8px}' +
    '#tis-cookies button{flex:1;min-height:44px;border-radius:4px;font:700 .8rem/1 "Space Grotesk",system-ui,sans-serif;' +
    'letter-spacing:.08em;text-transform:uppercase;cursor:pointer;border:1px solid #C9A227}' +
    '#tis-cookies .tc-no{background:transparent;color:#F5F3EC}#tis-cookies .tc-yes{background:#C9A227;color:#0A0A08}' +
    '#tis-cookies button:focus-visible{outline:2px solid #F5F3EC;outline-offset:2px}' +
    'body.tis-cookies-open #wa-float{display:none}';

  function show() {
    if (document.getElementById('tis-cookies')) return;
    if (!document.getElementById('tis-cookies-css')) {
      var st = document.createElement('style');
      st.id = 'tis-cookies-css';
      st.textContent = css;
      document.head.appendChild(st);
    }
    var box = document.createElement('section');
    box.id = 'tis-cookies';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Aviso de cookies');
    box.innerHTML =
      '<p>Usamos cookies de Google Analytics para saber qué páginas se visitan y mejorar la web. ' +
      'Solo se activan si aceptas. <a href="/cookies/">Política de cookies</a></p>' +
      '<div class="tc-row"><button type="button" class="tc-no">Rechazar</button>' +
      '<button type="button" class="tc-yes">Aceptar</button></div>';
    document.body.appendChild(box);
    document.body.classList.add('tis-cookies-open');
    function close(ok) {
      save(ok);
      box.remove();
      document.body.classList.remove('tis-cookies-open');
      if (ok) loadGA(); else clearGA();
    }
    box.querySelector('.tc-yes').addEventListener('click', function () { close(true); });
    box.querySelector('.tc-no').addEventListener('click', function () { close(false); });
  }

  window.tisCookies = show;

  var choice = read();
  if (choice === true) loadGA();
  else if (choice === null) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show);
    else show();
  }
})();
