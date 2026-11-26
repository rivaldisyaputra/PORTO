/* =====================================================
   TEMAN AIR — Script utama
   Ubah data bisnis di bagian PENGATURAN di bawah ini.
   ===================================================== */

const PENGATURAN = {
  // Nomor WhatsApp: gunakan kode negara tanpa tanda + (contoh 62812xxxx)
  whatsapp: '6281234567890',
  teleponTampil: '0812-3456-7890',
  email: 'halo@temanair.id',
  instagram: '@temanair.id',
  instagramUrl: 'https://instagram.com/temanair.id',
  jam: 'Senin–Minggu · 06.00–18.00',
  alamat: 'Jl. Melati Raya No. 12, Kebayoran, Jakarta Selatan',
  alamatSingkat: 'Jakarta Selatan',
  // Kata kunci lokasi untuk peta Google (nama tempat atau alamat lengkap)
  peta: 'Kebayoran Baru, Jakarta Selatan',
  // Pesan default saat tombol "Chat WhatsApp" ditekan
  pesanDefault: 'Halo Teman Air, saya ingin bertanya tentang kelas renang.'
};

(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Isi data bisnis ke halaman ---------- */
  const waUrl = (pesan) => `https://wa.me/${PENGATURAN.whatsapp}?text=${encodeURIComponent(pesan)}`;

  $$('[data-biz]').forEach(el => {
    const key = el.getAttribute('data-biz');
    if (PENGATURAN[key]) el.textContent = PENGATURAN[key];
  });
  $$('[data-wa-link]').forEach(a => a.href = waUrl(PENGATURAN.pesanDefault));
  $$('[data-ig-link]').forEach(a => a.href = PENGATURAN.instagramUrl);
  $$('[data-mail-link]').forEach(a => a.href = `mailto:${PENGATURAN.email}`);

  const map = $('#mapFrame');
  if (map) map.src = `https://www.google.com/maps?q=${encodeURIComponent(PENGATURAN.peta)}&z=14&output=embed`;

  $('#year').textContent = new Date().getFullYear();

  /* ---------- Register Service Worker untuk PWA ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js') // relative: the demo lives in a subfolder
        .then(reg => console.log('Service Worker registered'))
        .catch(err => console.log('Service Worker registration failed:', err));
    });
  }

  /* ---------- Navbar ---------- */
  const nav = $('#nav');
  const navLinks = $('#navLinks');
  const burger = $('#navBurger');
  const toTop = $('#toTop');

  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  });
  $$('a', navLinks).forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  const sections = $$('main section[id]');
  const menuLinks = $$('.nav__links a[href^="#"]:not(.btn)');
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 10);
    toTop.classList.toggle('show', window.scrollY > 600);

    let current = 'beranda';
    const offset = window.innerHeight * 0.35;
    sections.forEach(s => { if (s.getBoundingClientRect().top <= offset) current = s.id; });
    if (current === 'keunggulan') current = 'tentang';
    if (current === 'harga' || current === 'testimoni') current = current === 'harga' ? 'jadwal' : 'galeri';
    if (current === 'daftar') current = 'kontak';
    menuLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Reveal saat scroll ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Animasi angka statistik ---------- */
  const counters = $$('[data-count]');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const dur = 1400; const start = performance.now();
    const fmt = n => n.toLocaleString('id-ID');
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  } else {
    counters.forEach(c => c.textContent = parseInt(c.dataset.count, 10).toLocaleString('id-ID'));
  }

  /* ---------- Tabs jadwal ---------- */
  const tabs = $('#jadwalTabs');
  if (tabs) {
    $$('.tabs__btn', tabs).forEach(btn => btn.addEventListener('click', () => {
      $$('.tabs__btn', tabs).forEach(b => b.classList.remove('active'));
      $$('.tabs__panel', tabs).forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      $('#' + btn.dataset.tab).classList.add('active');
    }));
  }

  /* ---------- Toggle harga grup / privat ---------- */
  $$('[data-price-type]').forEach(btn => btn.addEventListener('click', () => {
    const type = btn.dataset.priceType;
    $$('[data-price-type]').forEach(b => b.classList.toggle('active', b === btn));
    $$('.plan__amount, .plan__per').forEach(el => { if (el.dataset[type]) el.textContent = el.dataset[type]; });
  }));

  /* ---------- Slider testimoni ---------- */
  const slider = $('#testiSlider');
  if (slider) {
    const track = $('.slider__track', slider);
    const items = $$('.testi', track);
    const dots = $('#testiDots');
    let index = 0, timer;

    const perView = () => window.innerWidth <= 600 ? 1 : window.innerWidth <= 1080 ? 2 : 3;
    const maxIndex = () => Math.max(0, items.length - perView());

    const render = () => {
      const gap = 24;
      const w = items[0].getBoundingClientRect().width + gap;
      track.style.transform = `translateX(-${index * w}px)`;
      $$('button', dots).forEach((d, i) => d.classList.toggle('active', i === index));
    };
    const buildDots = () => {
      dots.innerHTML = '';
      for (let i = 0; i <= maxIndex(); i++) {
        const b = document.createElement('button');
        b.setAttribute('aria-label', 'Testimoni ' + (i + 1));
        b.addEventListener('click', () => { index = i; render(); restart(); });
        dots.appendChild(b);
      }
    };
    const go = (dir) => { index = (index + dir + maxIndex() + 1) % (maxIndex() + 1); render(); };
    const restart = () => { clearInterval(timer); timer = setInterval(() => go(1), 5500); };

    $$('.slider__btn', slider).forEach(b => b.addEventListener('click', () => { go(+b.dataset.dir); restart(); }));
    window.addEventListener('resize', () => { index = Math.min(index, maxIndex()); buildDots(); render(); });
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', restart);

    // geser dengan sentuhan
    let startX = 0;
    track.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { go(dx < 0 ? 1 : -1); restart(); }
    });

    buildDots(); render(); restart();
  }

  /* ---------- Lightbox galeri ---------- */
  const lightbox = $('#lightbox');
  const galleryItems = $$('.gallery__item');
  if (lightbox && galleryItems.length) {
    const img = $('img', lightbox);
    let current = 0;
    const show = (i) => {
      current = (i + galleryItems.length) % galleryItems.length;
      img.src = galleryItems[current].href;
      img.alt = $('img', galleryItems[current]).alt;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    };
    const hide = () => { lightbox.hidden = true; document.body.style.overflow = ''; };
    galleryItems.forEach((a, i) => a.addEventListener('click', e => { e.preventDefault(); show(i); }));
    $('.lightbox__close', lightbox).addEventListener('click', hide);
    $('.lightbox__nav--prev', lightbox).addEventListener('click', () => show(current - 1));
    $('.lightbox__nav--next', lightbox).addEventListener('click', () => show(current + 1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) hide(); });
    document.addEventListener('keydown', e => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') hide();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  /* ---------- Pra-isi program/paket dari tombol ---------- */
  $$('[data-program]').forEach(a => a.addEventListener('click', () => {
    const sel = $('#fProgram');
    const opt = Array.from(sel.options).find(o => o.text === a.dataset.program);
    if (opt) sel.value = opt.value;
  }));
  $$('[data-paket]').forEach(a => a.addEventListener('click', () => {
    const r = $(`#fPaket input[value="${a.dataset.paket}"]`);
    if (r) r.checked = true;
  }));

  /* ---------- Formulir → WhatsApp ---------- */
  const form = $('#formDaftar');
  if (form) {
    const err = $('#formError');
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      $$('[required]', form).forEach(f => {
        const ok = f.value.trim() !== '';
        f.classList.toggle('invalid', !ok);
        if (!ok) valid = false;
      });
      err.hidden = valid;
      if (!valid) { $('.invalid', form)?.focus(); return; }

      const d = Object.fromEntries(new FormData(form).entries());
      const pesan =
`Halo Teman Air! Saya ingin mendaftar kelas trial.

👤 Nama siswa: ${d.nama}
🎂 Usia: ${d.usia} tahun
📞 Kontak: ${d.kontak} (${d.wa})
🏊 Program: ${d.program}
📍 Lokasi: ${d.lokasi || 'Fleksibel'}
📦 Paket: ${d.paket}
💧 Pengalaman: ${d.pengalaman}
📝 Catatan: ${d.pesan || '-'}

Mohon info jadwal trial yang tersedia. Terima kasih!`;
      window.open(waUrl(pesan), '_blank', 'noopener');
    });
    $$('[required]', form).forEach(f => f.addEventListener('input', () => f.classList.remove('invalid')));
  }
})();
