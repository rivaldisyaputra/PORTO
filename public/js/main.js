// Set here, not inline in the HTML: the reveal CSS hides sections under .js, so it must only apply once this file has actually loaded
document.documentElement.classList.add('js');

const reducedMotion =matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (id) => document.getElementById(id);

// Mobile menu
const menuBtn = $('mobile-menu-button');
const menu = $('mobile-menu');
const setMenu = (open) => {
    menu.classList.toggle('hidden', !open);
    menuBtn.setAttribute('aria-expanded', open);
};
menuBtn.addEventListener('click', () => setMenu(menu.classList.contains('hidden')));
menu.addEventListener('click', (e) => e.target.closest('a') && setMenu(false));

// Scroll progress bar
const progress = $('progress');
addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
}, { passive: true });

// Reveal sections as they enter the viewport
const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        revealer.unobserve(entry.target);
    });
}, { rootMargin: '0px 0px -8% 0px' }); // any overlap counts: a ratio threshold fails for sections much taller than the screen
document.querySelectorAll('.reveal').forEach((el) => revealer.observe(el));

// Highlight the nav link of the section crossing the middle of the screen
const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll('nav a[href^="#"]').forEach((a) =>
            a.setAttribute('aria-current', a.getAttribute('href') === '#' + entry.target.id));
    });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section').forEach((s) => spy.observe(s));

// Spotlight that follows the pointer on cards
document.querySelectorAll('.spot').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
});

// Cards tilt toward the pointer (mouse only: on touch it would fight scrolling)
if (!reducedMotion) {
    document.querySelectorAll('.tilt').forEach((card) => {
        card.addEventListener('pointermove', (e) => {
            if (e.pointerType !== 'mouse') return;
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transition = 'transform .1s linear';
            card.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
        });
        card.addEventListener('pointerleave', () => { card.style.transition = ''; card.style.transform = ''; });
    });
}

// Hero weave: a lattice of diamonds. A wave keeps travelling through it; diamonds near the pointer swell and turn gold
const weave = $('weave');
if (weave) {
    const ctx = weave.getContext('2d');
    const hero = weave.parentElement;
    const mouse = { x: -9999, y: -9999 };
    const S = 52; // lattice spacing in px
    let w, h, running = false;
    const diamond = (x, y, r) => {
        ctx.beginPath();
        ctx.moveTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r, y);
        ctx.closePath();
    };
    const draw = (t) => {
        ctx.clearRect(0, 0, w, h);
        for (let y = 0, row = 0; y < h + S; y += S / 2, row++) {
            for (let x = (row % 2) * S / 2; x < w + S; x += S) {
                const near = Math.max(0, 1 - Math.hypot(x - mouse.x, y - mouse.y) / 220);
                const wave = 0.5 + 0.5 * Math.sin((x + y) * 0.012 - t * 0.0016);
                const r = S * (0.15 + 0.12 * wave + 0.2 * near);
                const color = near > 0.45 ? '#ffc46b' : '#7cc4ff';
                ctx.globalAlpha = 0.08 + 0.14 * wave + 0.6 * near;
                ctx.strokeStyle = color;
                diamond(x, y, r); ctx.stroke();
                if (wave > 0.75 || near > 0.15) { ctx.fillStyle = color; diamond(x, y, r * 0.3); ctx.fill(); }
            }
        }
    };
    const frame = (t) => {
        if (!running) return;
        draw(t);
        requestAnimationFrame(frame);
    };
    const resize = () => {
        const d = Math.min(devicePixelRatio || 1, 2);
        w = hero.clientWidth; h = hero.clientHeight;
        weave.width = w * d; weave.height = h * d;
        ctx.setTransform(d, 0, 0, d, 0, 0);
        draw(0);
    };
    addEventListener('resize', resize);
    resize();
    if (!reducedMotion) { // with reduced motion the pattern stays as the still frame drawn above
        hero.addEventListener('pointermove', (e) => {
            const r = hero.getBoundingClientRect();
            mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
        });
        hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
        // Only animate while the hero is on screen
        new IntersectionObserver(([entry]) => {
            const was = running;
            running = entry.isIntersecting;
            if (running && !was) requestAnimationFrame(frame);
        }).observe(hero);
    }
}

// Skill tabs
const tabs = document.querySelectorAll('[role="tab"]');
const showTab = (tab) => {
    tabs.forEach((t) => t.setAttribute('aria-selected', t === tab));
    document.querySelectorAll('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== tab.dataset.tab; });
};
tabs.forEach((tab) => tab.addEventListener('click', () => showTab(tab)));
showTab(tabs[0]);

// Copy email
const copyBtn = $('copy-email');
copyBtn.addEventListener('click', async () => {
    let ok;
    try {
        await navigator.clipboard.writeText(copyBtn.dataset.email);
        ok = true;
    } catch {
        // In-app browsers (LinkedIn, WhatsApp) and http pages deny the Clipboard API; fall back to the old selection copy
        const t = document.createElement('textarea');
        t.value = copyBtn.dataset.email;
        t.style.cssText = 'position:fixed;opacity:0';
        document.body.append(t);
        t.select();
        ok = document.execCommand('copy');
        t.remove();
    }
    copyBtn.textContent = ok ? 'Copied!' : 'Copy failed';
    setTimeout(() => { copyBtn.textContent = 'Copy email'; }, 1500);
});

// Terminal
const out = $('term-out');
const input = $('term-in');
const CV = './public/pdf/CV_Rivaldi%20Syaputra_ATS.pdf';
const commands = {
    help: { text: 'Commands: about, skills, projects, experience, certs, contact, cv, clear' },
    about: { text: 'AI Prompt Engineer & IT Support, based in Bandung, Indonesia.', go: 'about' },
    skills: { text: 'AI prompting, DevOps & monitoring, networking, web, IT support.', go: 'skills' },
    projects: { text: 'Four web projects, all live.', go: 'projects' },
    experience: { text: 'UNIKOM (Computer Systems), internship, SMKN 4 Bandung.', go: 'experience' },
    certs: { text: 'Eight certificates: Cisco Networking Academy, Hackpoint, Digitalent, Talenta AI.', go: 'certificates' },
    contact: { text: 'rivaldisyaputra029@gmail.com', go: 'contact' },
    cv: { text: 'Opening CV in a new tab.', open: CV },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function print(text, className = '') {
    const line = document.createElement('div');
    line.className = className;
    out.append(line);
    if (reducedMotion) {
        line.textContent = text; // textContent only: visitor input must never be parsed as HTML
    } else {
        line.classList.add('caret');
        for (const ch of text) { line.textContent += ch; await sleep(12); }
        line.classList.remove('caret');
    }
    out.scrollTop = out.scrollHeight;
}

let busy = Promise.resolve(); // queue commands so typed lines never interleave
function run(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    // Open right away, inside the click/submit event: Safari blocks window.open once the typing animation has been awaited
    if (commands[cmd]?.open) window.open(commands[cmd].open, '_blank', 'noopener');
    busy = busy.then(async () => {
        if (cmd === 'clear') { out.textContent = ''; return; }
        const line = document.createElement('div');
        line.className = 'text-sky';
        line.textContent = '› ' + cmd;
        out.append(line);
        const c = commands[cmd];
        if (!c) return print(`Command not found: ${cmd}. Type "help".`, 'text-amber');
        await print(c.text, 'text-fog');
        if (c.go) $(c.go).scrollIntoView();
    });
}

$('term-form').addEventListener('submit', (e) => {
    e.preventDefault();
    run(input.value);
    input.value = '';
});
document.querySelectorAll('[data-cmd]').forEach((b) => b.addEventListener('click', () => run(b.dataset.cmd)));

out.textContent = ''; // drop the no-JS fallback message
busy = busy
    .then(() => print('› whoami', 'text-sky'))
    .then(() => print('Rivaldi Syaputra. I design prompts and keep systems running.', 'text-fog'))
    .then(() => print('Type "help" or tap a command below.', 'text-fog'));
