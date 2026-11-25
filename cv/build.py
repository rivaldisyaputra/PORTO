"""Builds the two ATS CVs. Run:  python3 cv/build.py   (needs Google Chrome for the PDF step)
Edit the text in DATA below, then re-run. Output: cv/cv-en.html, cv/cv-id.html and the PDFs in public/pdf/."""
import html, pathlib, subprocess

HERE = pathlib.Path(__file__).parent
PDF_DIR = HERE.parent / 'public' / 'pdf'
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

CONTACT = ['rivaldisyaputra029@gmail.com', 'linkedin.com/in/rivaldis12112000', 'github.com/rivaldisyaputra', 'rivaldi12.netlify.app']

DATA = {
 'en': dict(
  file='CV_Rivaldi_Syaputra_EN', lang='en', title='Full-stack Developer & IT Support', city='Bandung, Indonesia',
  h=dict(summary='Summary', exp='Work Experience', proj='Projects', edu='Education', skills='Skills', cert='Certifications', org='Organizations'),
  summary='Full-stack developer with a networking and IT support background. I build and maintain an ERP backoffice and REST API '
          '(Next.js, NestJS, Prisma, PostgreSQL) for a multi-outlet F&B company, covering access control, inventory, and financial '
          'reporting. Comfortable from the database to deployment: Linux, Docker, and CI/CD.',
  exp=[
   ('Full-stack Developer', 'Exo Drinks', 'Jan 2026 - Present', [
    'Build and maintain the company ERP backoffice (Next.js 16, React 19, TypeScript) and its REST API (NestJS, Prisma, PostgreSQL), used across outlets, as part of a small development team.',
    'Designed role-based access control down to page and action level, on JWT authentication with refresh tokens.',
    'Developed the inventory modules: outlet and central-kitchen stock, stock transfer, and stock opname.',
    'Built P&L and shrinkage reports with charts and Excel export, backed by Redis caching and a scheduled cache warmer.',
    'Implemented audit logging so every data change can be traced to a user and a time.',
    'Wrote database migrations and automated tests; about 600 commits across the backoffice and API repositories.']),
   ('IT Support', 'Exo Drinks', 'Sep 2025 - Dec 2025', [
    'Maintained company hardware and software, and resolved day-to-day user issues.',
    'Maintained the CCTV systems.',
    'Trained staff to use vendor applications.']),
   ('Intern', 'Kejaksaan Negeri Kota Bandung', 'Oct 2018 - Dec 2018', [
    'Maintained office computers and the network, and handled data entry.']),
  ],
  proj=[
   ('Undakan', 'in development', 'Tryout platform for the SKD CPNS exam: 110 questions on a 100-minute timer, explanations, passwordless sign-in, and an admin panel. Next.js 16, Payload CMS 3, PostgreSQL.'),
   ('Guppy Pasundan', 'in development', 'Online storefront with catalogue, cart, and admin area. Next.js 16, Supabase.'),
   ('Tryout Online', 'senam-otak.my.id', 'Practice site with tryout, quiz, and focus games. React, deployed to AWS through GitHub Actions.'),
   ('Hospital recommendation system', 'rekomendasi.infinityfreeapp.com', 'Ranks hospitals for BPJS eye patients with the Weighted Product method. PHP, MySQL.'),
  ],
  edu=[('Universitas Komputer Indonesia (UNIKOM)', "Bachelor's degree, Computer Systems", '2019 - 2023'),
       ('SMKN 4 Bandung', 'Computer and Network Engineering', '2016 - 2019')],
  skills=[('Web', 'TypeScript, JavaScript, Next.js, React, NestJS, Node.js, PHP, Laravel, HTML, CSS, Tailwind CSS'),
          ('Data', 'PostgreSQL, Prisma, MySQL, Redis, Supabase'),
          ('DevOps', 'Docker, Docker Compose, GitHub Actions (CI/CD), Linux, Nginx, Apache, Prometheus, Grafana'),
          ('Networking and security', 'TCP/IP, VLAN, VPN, firewall (iptables/nftables), MikroTik, Cisco, Fortinet, IDS/IPS'),
          ('IT support', 'Hardware and software maintenance, CCTV, user training')],
  cert=['Hackpoint Bootcamp 1, Hackpoint (2025)', 'Cybershield 2025, Hackpoint (2025)',
        'Security Operations Analyst, Fresh Graduate Academy, Digitalent (2024)', 'Talenta AI Indonesia (2024)',
        'Cisco Networking Academy course completions (2022): CyberOps Associate; CCNAv7 Switching, Routing, and Wireless Essentials; CCNAv7 Introduction to Networks; Cybersecurity Essentials'],
  org=['Head of the Leadership Organization Division, HIMA TEKKOM UNIKOM (2021/2022)',
       'Deputy Coordinating Minister for Character Development, BEM-U UNIKOM (2022/2023)'],
 ),
 'id': dict(
  file='CV_Rivaldi_Syaputra_ID', lang='id', title='Full-stack Developer & IT Support', city='Bandung, Indonesia',
  h=dict(summary='Ringkasan', exp='Pengalaman Kerja', proj='Proyek', edu='Pendidikan', skills='Keahlian', cert='Sertifikasi', org='Organisasi'),
  summary='Full-stack developer dengan latar belakang jaringan dan IT support. Membangun dan memelihara backoffice ERP dan REST API '
          '(Next.js, NestJS, Prisma, PostgreSQL) untuk perusahaan F&B multi-outlet, mencakup hak akses, inventori, dan laporan keuangan. '
          'Terbiasa bekerja dari database sampai deployment: Linux, Docker, dan CI/CD.',
  exp=[
   ('Full-stack Developer', 'Exo Drinks', 'Jan 2026 - sekarang', [
    'Membangun dan memelihara backoffice ERP perusahaan (Next.js 16, React 19, TypeScript) beserta REST API-nya (NestJS, Prisma, PostgreSQL) yang dipakai lintas outlet, dalam tim pengembang kecil.',
    'Merancang hak akses berbasis peran sampai tingkat halaman dan aksi, di atas autentikasi JWT dengan refresh token.',
    'Mengembangkan modul inventori: stok outlet dan central kitchen, transfer stok, dan stock opname.',
    'Membangun laporan P&L dan shrinkage dengan grafik dan ekspor Excel, didukung cache Redis dan cache warmer terjadwal.',
    'Menerapkan audit log sehingga setiap perubahan data dapat ditelusuri ke pengguna dan waktunya.',
    'Menulis migrasi database dan pengujian otomatis; sekitar 600 commit pada repositori backoffice dan API.']),
   ('IT Support', 'Exo Drinks', 'Sep 2025 - Des 2025', [
    'Memelihara hardware dan software perusahaan serta menangani kendala pengguna sehari-hari.',
    'Memelihara sistem CCTV.',
    'Melatih staf menggunakan aplikasi vendor.']),
   ('Praktik Kerja Lapangan', 'Kejaksaan Negeri Kota Bandung', 'Okt 2018 - Des 2018', [
    'Merawat komputer dan jaringan kantor serta mengerjakan entri data.']),
  ],
  proj=[
   ('Undakan', 'dalam pengembangan', 'Platform tryout SKD CPNS: 110 soal dengan timer 100 menit, pembahasan, masuk tanpa kata sandi, dan panel admin. Next.js 16, Payload CMS 3, PostgreSQL.'),
   ('Guppy Pasundan', 'dalam pengembangan', 'Toko online dengan katalog, keranjang, dan area admin. Next.js 16, Supabase.'),
   ('Tryout Online', 'senam-otak.my.id', 'Situs latihan berisi tryout, kuis, dan permainan kecermatan. React, di-deploy ke AWS lewat GitHub Actions.'),
   ('Sistem rekomendasi rumah sakit', 'rekomendasi.infinityfreeapp.com', 'Memeringkat rumah sakit untuk peserta BPJS penyakit mata dengan metode Weighted Product. PHP, MySQL.'),
  ],
  edu=[('Universitas Komputer Indonesia (UNIKOM)', 'S1 Sistem Komputer', '2019 - 2023'),
       ('SMKN 4 Bandung', 'Teknik Komputer dan Jaringan', '2016 - 2019')],
  skills=[('Web', 'TypeScript, JavaScript, Next.js, React, NestJS, Node.js, PHP, Laravel, HTML, CSS, Tailwind CSS'),
          ('Data', 'PostgreSQL, Prisma, MySQL, Redis, Supabase'),
          ('DevOps', 'Docker, Docker Compose, GitHub Actions (CI/CD), Linux, Nginx, Apache, Prometheus, Grafana'),
          ('Jaringan dan keamanan', 'TCP/IP, VLAN, VPN, firewall (iptables/nftables), MikroTik, Cisco, Fortinet, IDS/IPS'),
          ('IT support', 'Pemeliharaan hardware dan software, CCTV, pelatihan pengguna')],
  cert=['Hackpoint Bootcamp 1, Hackpoint (2025)', 'Cybershield 2025, Hackpoint (2025)',
        'Security Operations Analyst, Fresh Graduate Academy, Digitalent (2024)', 'Talenta AI Indonesia (2024)',
        'Penyelesaian kursus Cisco Networking Academy (2022): CyberOps Associate; CCNAv7 Switching, Routing, and Wireless Essentials; CCNAv7 Introduction to Networks; Cybersecurity Essentials'],
  org=['Kepala Divisi Organisasi Kepemimpinan, HIMA TEKKOM UNIKOM (2021/2022)',
       'Wakil Menteri Koordinator Pembangunan Karakter, BEM-U UNIKOM (2022/2023)'],
 ),
}

# One column, real text, standard headings, no tables, images or icons: that is what resume parsers read reliably.
CSS = '''
@page { size: A4; margin: 10mm 15mm; }
* { box-sizing: border-box; }
body { margin: 0; font: 9.3pt/1.34 Arial, Helvetica, sans-serif; color: #111; }
h1 { margin: 0; font-size: 19pt; letter-spacing: .2pt; }
.role { margin: 1pt 0 3pt; font-size: 11pt; font-weight: bold; color: #1d4e89; }
.contact { margin: 0; font-size: 8.3pt; color: #333; white-space: nowrap; } /* one line: a wrapped contact row pushes the CV onto a second page */
h2 { margin: 7pt 0 3pt; padding-bottom: 2pt; border-bottom: 1pt solid #1d4e89; font-size: 10pt; text-transform: uppercase; letter-spacing: .8pt; color: #1d4e89; }
p { margin: 0; }
.row { display: flex; justify-content: space-between; gap: 12pt; margin-top: 4pt; }
.row:first-of-type { margin-top: 0; }
.row b { font-size: 9.8pt; }
.when { white-space: nowrap; color: #333; }
ul { margin: 2pt 0 0; padding-left: 13pt; }
li { margin: 0; }
.item { margin-top: 2pt; }
.item:first-of-type { margin-top: 0; }
'''

def e(t): return html.escape(t, quote=False)

def render(d):
    h = d['h']; out = []
    out.append(f'<h1>Rivaldi Syaputra</h1><p class="role">{e(d["title"])}</p>')
    out.append('<p class="contact">' + e(' | '.join([d['city']] + CONTACT)) + '</p>')
    out.append(f'<h2>{h["summary"]}</h2><p>{e(d["summary"])}</p>')
    out.append(f'<h2>{h["exp"]}</h2>')
    for role, org, when, bullets in d['exp']:
        out.append(f'<div class="row"><span><b>{e(role)}</b>, {e(org)}</span><span class="when">{e(when)}</span></div>')
        out.append('<ul>' + ''.join(f'<li>{e(b)}</li>' for b in bullets) + '</ul>')
    out.append(f'<h2>{h["proj"]}</h2>')
    for name, note, text in d['proj']:
        out.append(f'<p class="item"><b>{e(name)}</b> ({e(note)}). {e(text)}</p>')
    out.append(f'<h2>{h["edu"]}</h2>')
    for school, major, when in d['edu']:
        out.append(f'<div class="row"><span><b>{e(school)}</b>, {e(major)}</span><span class="when">{e(when)}</span></div>')
    out.append(f'<h2>{h["skills"]}</h2>')
    for k, v in d['skills']:
        out.append(f'<p class="item"><b>{e(k)}:</b> {e(v)}</p>')
    out.append(f'<h2>{h["cert"]}</h2><ul>' + ''.join(f'<li>{e(c)}</li>' for c in d['cert']) + '</ul>')
    out.append(f'<h2>{h["org"]}</h2><ul>' + ''.join(f'<li>{e(o)}</li>' for o in d['org']) + '</ul>')
    return (f'<!DOCTYPE html><html lang="{d["lang"]}"><head><meta charset="UTF-8"><title>Rivaldi Syaputra - CV</title>'
            f'<style>{CSS}</style></head><body>\n' + '\n'.join(out) + '\n</body></html>\n')

for key, d in DATA.items():
    src = HERE / f'cv-{key}.html'
    src.write_text(render(d), encoding='utf-8')
    pdf = PDF_DIR / f'{d["file"]}.pdf'
    subprocess.run([CHROME, '--headless', '--disable-gpu', '--no-pdf-header-footer', f'--print-to-pdf={pdf}', src.as_uri()],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print('built', pdf.name)
