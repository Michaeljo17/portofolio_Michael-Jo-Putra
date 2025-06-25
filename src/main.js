// Biarkan baris ini di paling atas
import './style.css';

// --- KODE UNTUK KURSOR KUSTOM ---
const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', e => {
    // Menggunakan e.clientX dan e.clientY untuk posisi mouse
    // 'px' adalah singkatan dari pixel
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});


// --- KODE UNTUK ANIMASI FADE-IN ON SCROLL ---
// Pilih semua elemen dengan class .fade-in yang ada di HTML
const faders = document.querySelectorAll('.fade-in');

// Opsi untuk Intersection Observer
const appearOptions = {
  threshold: 0.3, // Elemen dianggap terlihat jika 30% areanya masuk layar
};

// Buat observer baru
const appearOnScroll = new IntersectionObserver(function(
  entries,
  appearOnScroll
) {
  entries.forEach(entry => {
    // Jika elemen tidak terlihat, jangan lakukan apa-apa
    if (!entry.isIntersecting) {
      return;
    } else {
      // Jika terlihat, tambahkan class 'visible' untuk memicu animasi CSS
      entry.target.classList.add('visible');
      // Berhenti mengamati elemen ini agar animasi tidak berulang
      appearOnScroll.unobserve(entry.target);
    }
  });
},
appearOptions);

// Terapkan observer pada setiap elemen yang sudah kita pilih
faders.forEach(fader => {
  appearOnScroll.observe(fader);
});
// --- KODE UNTUK SMOOTH SCROLL NAVIGASI ---
// Pilih semua link di navigasi yang href-nya dimulai dengan '#'
const navLinks = document.querySelectorAll('header nav a[href^="#"]');

navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    // 1. Hentikan perilaku default (lompatan kasar)
    e.preventDefault();

    // 2. Ambil ID dari href (misal: '#projects')
    const id = this.getAttribute('href');

    // 3. Cari elemen yang sesuai dengan ID tersebut
    const targetElement = document.querySelector(id);

    // 4. Scroll ke elemen tersebut dengan efek mulus
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});
// --- KODE UNTUK FITUR EXPAND/COLLAPSE PROYEK ---
const detailLinks = document.querySelectorAll('.project-card a');

detailLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    // 1. Cegah link melompat ke atas
    e.preventDefault();

    // 2. Cari parent '.project-card' terdekat dari link yang di-klik
    const card = link.closest('.project-card');

    // 3. Tambah/hapus class 'expanded' pada kartu tersebut
    if (card) {
      card.classList.toggle('expanded');

      // 4. (Opsional) Ganti teks link
      if (card.classList.contains('expanded')) {
        link.innerHTML = 'Tutup &uarr;'; // &uarr; adalah panah atas
      } else {
        link.innerHTML = 'Lihat Detail &rarr;'; // &rarr; adalah panah kanan
      }
    }
  });
});
// --- KODE UNTUK EFEK BLOB MENGIKUTI MOUSE ---
const blob = document.getElementById('blob');

document.body.onpointermove = event => {
  const { clientX, clientY } = event;

  // Animasikan blob ke posisi pointer
  blob.animate({
    left: `${clientX}px`,
    top: `${clientY}px`
  }, { duration: 3000, fill: "forwards" });
};