/* ============ Menú móvil accesible ============ */
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

/* ============ Carrusel de reseñas ============ */
(() => {
  const track = document.querySelector('.reviews-track');
  if (!track) return;
  let index = 0;
  const items = track.children;
  const prev = document.querySelector('.rev-prev');
  const next = document.querySelector('.rev-next');
  const go = (delta) => {
    index = (index + delta + items.length) % items.length;
    track.style.transform = `translateX(-${index * 100}%)`;
  };
  prev?.addEventListener('click', () => go(-1));
  next?.addEventListener('click', () => go(1));
  setInterval(() => go(1), 7000);
})();

/* ============ Lightbox galería ============ */
(() => {
  const lb = document.querySelector('.lightbox');
  const lbImg = document.querySelector('.lb-img');
  const closeBtn = document.querySelector('.lb-close');
  if (!lb || !lbImg || !closeBtn) return;

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t instanceof HTMLImageElement && t.closest('.galeria')) {
      lbImg.src = t.dataset.full || t.src;
      lbImg.alt = t.alt || "";
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
    }
  });
  const close = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); lbImg.src = ""; };
  closeBtn.addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

/* ============ Estimador de presupuesto (Servicios) ============ */
(() => {
  const form = document.getElementById('quote-form');
  const btn = document.getElementById('quote-btn');
  if (!form || !btn) return;

  // TODO: Ajusta ciudades y tarifas
  const cityFees = { "Madrid": 0, "Barcelona": 20, "Valencia": 15 };
  const perKid = 8;     // coste por niño
  const perHour = 40;   // coste por hora
  const photoAddOn = 120;

  const compute = () => {
    const pkg = form.package.selectedOptions[0];
    const base = Number(pkg?.dataset.base || 0);
    const kids = Math.max(1, Number(form.kids.value || 0));
    const hours = Math.max(2, Number(form.hours.value || 0));
    const city = (form.city.value || "").trim();
    const photo = form.photography.checked;
    const fee = cityFees[city] ?? 10; // tarifa por defecto
    const total = base + kids*perKid + hours*perHour + fee + (photo ? photoAddOn : 0);
    return Math.round(total);
  };

  const res = form.querySelector('.quote-result');

  btn.addEventListener('click', () => {
    const total = compute();
    res.textContent = `Estimación: ${total} € (IVA no incluido)`;
    // Crear CTA a contacto con query param
    const contactLink = document.getElementById('go-contact-from-quote');
    if (contactLink) {
      contactLink.href = `contacto.html?est=${encodeURIComponent(total + " €")}`;
      contactLink.hidden = false;
    }
  });
})();

/* ============ Contacto: validación + WhatsApp + estimación ============ */
(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const msg = form.querySelector('.form-msg');
  const wa = document.getElementById('wa-cta');
  const estField = document.getElementById('estimation-field');

  // Recoger estimación desde URL si viene de Servicios
  const params = new URLSearchParams(location.search);
  const est = params.get('est');
  if (est && estField) estField.value = est;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    // Honeypot
    if (data.get('_address')) { msg.textContent = 'Error.'; return; }

    try{
      const res = await fetch(form.action, { method:'POST', body:data, headers:{'Accept':'application/json'} });
      if (res.ok){
        msg.textContent = 'Gracias, te contactaremos en breve.';
        form.reset();
      } else {
        msg.textContent = 'No se pudo enviar. Prueba WhatsApp o escríbenos por email.';
      }
    }catch{
      msg.textContent = 'Conexión no disponible. Usa WhatsApp si lo prefieres.';
    }
  });

  // WhatsApp
  // TODO: Sustituye por tu número en formato internacional (ej: 34XXXXXXXXX)
  const phoneCompany = '34XXXXXXXXX';
  const buildWA = () => {
    const name = form.name?.value || '';
    const pkg = form.package?.value || '';
    const city = form.city?.value || '';
    const date = form.date?.value || '';
    const est = estField?.value || '';
    const txt = `Hola, soy ${name}. Me interesa ${pkg} en ${city} el ${date}. Estimación: ${est}`;
    if (wa) wa.href = `https://wa.me/${phoneCompany}?text=${encodeURIComponent(txt)}`;
  };
  form.addEventListener('input', buildWA);
  buildWA();
})();

/* ============ Blog: búsqueda en vivo ============ */
(() => {
  const q = document.getElementById('blog-search');
  const list = document.getElementById('blog-list');
  if (!q || !list) return;
  const items = [...list.querySelectorAll('article')];
  q.addEventListener('input', () => {
    const term = q.value.toLowerCase();
    items.forEach(a => {
      const text = (a.textContent || '').toLowerCase() + ' ' + (a.dataset.tags||'').toLowerCase();
      a.style.display = text.includes(term) ? '' : 'none';
    });
  });
})();

/* ============ Cookies (banner simple) ============ */
(() => {
  const b = document.getElementById('cookie-banner');
  const ok = document.getElementById('cookie-accept');
  if (!b || !ok) return;
  if (!localStorage.getItem('cookie-consent')) b.classList.add('show');
  ok.addEventListener('click', () => {
    localStorage.setItem('cookie-consent','yes');
    b.classList.remove('show');
    // Aquí podrías cargar Analytics real si lo deseas
  });
})();
