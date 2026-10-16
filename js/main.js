(() => {
  'use strict';

  /* ---- Configuración de contacto (completar para activar el envío del formulario) ---- */
  const CONFIG = {
    email: '',       // ej: 'ventas@tuferreteria.com.uy'
    whatsapp: ''     // ej: '59899123456' (código de país + número, sin + ni espacios)
  };

  /* ---- Catálogo (editar libremente) ---- */
  const CATEGORIES = ['Tornillos', 'Fijaciones', 'Tuercas y arandelas', 'Herramientas', 'Barraca'];
  const PRODUCTS = [
    ['Tornillos', 'Tornillos para madera', 'Distintos largos y diámetros para carpintería y muebles.'],
    ['Tornillos', 'Autoperforantes', 'Para chapa y perfiles metálicos, sin pretaladrar.'],
    ['Tornillos', 'Bulones hexagonales', 'Cabeza hexagonal para estructuras y montajes.'],
    ['Tornillos', 'Tirafondos', 'Fijación firme en madera para cargas pesadas.'],
    ['Fijaciones', 'Tarugos y tacos', 'Para amurar en pared y hormigón.'],
    ['Fijaciones', 'Anclajes de expansión', 'Soporte seguro para cargas en hormigón.'],
    ['Fijaciones', 'Clavos y grapas', 'Surtido para obra, tapicería y carpintería.'],
    ['Fijaciones', 'Remaches', 'Uniones rápidas en chapa y metal.'],
    ['Tuercas y arandelas', 'Tuercas', 'Hexagonales, mariposa, autofrenantes y más.'],
    ['Tuercas y arandelas', 'Arandelas', 'Planas y de presión, en varias medidas.'],
    ['Tuercas y arandelas', 'Varilla roscada', 'Por metro, para soportes y montajes.'],
    ['Herramientas', 'Destornilladores y puntas', 'Para uso manual y con atornillador.'],
    ['Herramientas', 'Llaves y alicates', 'Para mecánica, plomería y electricidad.'],
    ['Herramientas', 'Brocas y discos', 'Para perforar, cortar y desbastar.'],
    ['Barraca', 'Cadenas y cables de acero', 'Para sujeción, izaje y cerramientos.'],
    ['Barraca', 'Alambres y mallas', 'Para cercos, construcción y huerta.']
  ];

  /* Íconos simples por categoría */
  const ICONS = {
    'Tornillos': '<path d="M12 3h24M24 3v6M16 9h16l-3 6H19zM19 15l10 4M19 21l10 4M19 27l10 4M19 33l10 4M24 37v8"/>',
    'Fijaciones': '<rect x="10" y="6" width="28" height="9" rx="2"/><path d="M18 15v22l6 6 6-6V15M18 23h12M18 30h12"/>',
    'Tuercas y arandelas': '<path d="M24 4l17 10v20L24 44 7 34V14z"/><circle cx="24" cy="24" r="7"/>',
    'Herramientas': '<path d="M30 6a10 10 0 0 0-9 14L6 35a4 4 0 0 0 6 6l15-15a10 10 0 0 0 14-9l-7 5-5-5 5-7z"/>',
    'Barraca': '<path d="M5 18l19-10 19 10M9 18v22h30V18M17 40V28h14v12M5 18h38"/>'
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---- Catálogo con filtros ---- */
  const grid = $('#grid');
  const filters = $('#filters');
  let current = 'Todo';

  function renderFilters() {
    ['Todo', ...CATEGORIES].forEach(cat => {
      const b = document.createElement('button');
      b.className = 'chip';
      b.type = 'button';
      b.textContent = cat;
      b.setAttribute('aria-pressed', cat === current);
      b.addEventListener('click', () => {
        current = cat;
        $$('.chip', filters).forEach(c => c.setAttribute('aria-pressed', c === b));
        renderProducts();
      });
      filters.appendChild(b);
    });
  }

  function renderProducts() {
    grid.innerHTML = '';
    PRODUCTS.filter(p => current === 'Todo' || p[0] === current).forEach(([cat, name, desc], i) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.style.animationDelay = `${i * 40}ms`;
      card.innerHTML = `
        <svg viewBox="0 0 48 48" aria-hidden="true">${ICONS[cat]}</svg>
        <h3>${name}</h3>
        <p>${desc}</p>
        <span class="tag">${cat}</span>`;
      grid.appendChild(card);
    });
  }

  /* ---- Navegación ---- */
  const nav = $('#nav');
  const progress = $('#progress');
  const menu = $('#menu');
  const menuBtn = $('#menuBtn');
  const links = $$('.menu a');
  const sections = links.map(a => $(a.getAttribute('href')));

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle('scrolled', y > 20);
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    const pos = y + window.innerHeight * 0.35;
    sections.forEach((s, i) => {
      const on = s && pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight;
      links[i].classList.toggle('active', !!on);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  function setMenu(open) {
    menu.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  links.forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---- Galería / lightbox ---- */
  const lb = $('#lightbox');
  const lbImg = $('#lbImg');
  $$('.shot').forEach(btn => btn.addEventListener('click', () => {
    lbImg.src = btn.dataset.full;
    lbImg.alt = btn.dataset.alt;
    lb.showModal();
  }));
  $('#lbClose').addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });

  /* ---- Imágenes faltantes: muestra un recuadro con el nombre esperado ---- */
  $$('img').forEach(img => {
    const fail = () => {
      const host = img.closest('.shot, .about-photo, .hero-logo') || img.parentElement;
      host.classList.add('img-missing');
      host.dataset.name = 'Falta ' + img.getAttribute('src');
    };
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* ---- Formulario ---- */
  const form = $('#form');
  const msg = $('#formMsg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    msg.className = 'form-msg';
    let ok = true;
    $$('input, textarea', form).forEach(f => {
      const bad = !f.value.trim();
      f.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) { msg.textContent = 'Completá todos los campos para enviar tu consulta.'; return; }

    const d = Object.fromEntries(new FormData(form));
    const text = `Consulta desde la web\nNombre: ${d.nombre}\nTeléfono: ${d.telefono}\n${d.mensaje}`;

    if (CONFIG.whatsapp) {
      window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    } else if (CONFIG.email) {
      location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Consulta desde la web')}&body=${encodeURIComponent(text)}`;
    } else {
      msg.innerHTML = 'Por ahora hacenos la consulta por teléfono: <a href="tel:+59844724151">4472 4151</a>.';
      return;
    }
    msg.classList.add('ok');
    msg.textContent = 'Consulta lista para enviar. ¡Gracias!';
    form.reset();
  });

  renderFilters();
  renderProducts();
  onScroll();
})();
