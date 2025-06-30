// File: src/main.js

import './style.css';

// --- PENGATURAN AWAL & VARIABEL GLOBAL ---
const API_URL = 'http://michaeljo-api.ct.ws/portfolio-dinamis/api/get_projects.php'; 
let allProjectsData = []; // Variabel untuk menyimpan data proyek secara global

// --- FUNGSI UTAMA ---
document.addEventListener('DOMContentLoaded', async () => {
    activateVisualEffects();
    await fetchAndRenderProjects();
    setupEventListeners();
});

// --- FUNGSI-FUNGSI PEMBANTU ---

/**
 * Mengaktifkan efek visual seperti kursor kustom dan blob yang bergerak.
 */
function activateVisualEffects() {
    const cursor = document.querySelector('.cursor');
    const blob = document.getElementById('blob');
    if (cursor && blob) {
        document.body.onpointermove = event => {
            const { clientX, clientY } = event;
            cursor.style.left = `${clientX}px`;
            cursor.style.top = `${clientY}px`;
            blob.animate({ left: `${clientX}px`, top: `${clientY}px` }, { duration: 3000, fill: "forwards" });
        };
    }
}

/**
 * Mengambil data dari API dan merender setiap proyek sebagai kartu di halaman utama.
 */
async function fetchAndRenderProjects() {
    const projectGrid = document.querySelector('.project-grid');
    if (!projectGrid) return;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        allProjectsData = await response.json();

        if (allProjectsData.length > 0) {
            projectGrid.innerHTML = allProjectsData.map((project, index) => {
                const thumbnailUrl = project.imageUrls[0] || 'https://via.placeholder.com/400x225.png?text=No+Image';
                return `
                    <div class="project-card fade-in" data-project-index="${index}">
                        <img src="${thumbnailUrl}" alt="${project.title}" class="project-image">
                        <h3>${project.title}</h3>
                        <p>${project.short_description}</p>
                        <a href="#" class="details-button">Details &rarr;</a>
                    </div>
                `;
            }).join('');
        } else {
            projectGrid.innerHTML = '<p>Saat ini tidak ada proyek untuk ditampilkan.</p>';
        }
        activateFadeInAnimation();
    } catch (error) {
        console.error('Gagal mengambil data proyek:', error);
        projectGrid.innerHTML = '<p style="color:white;">Gagal memuat data proyek. Pastikan server backend (XAMPP) berjalan.</p>';
    }
}

/**
 * Menyiapkan semua event listener untuk interaksi pengguna.
 */
function setupEventListeners() {
    const projectGrid = document.querySelector('.project-grid');
    const modal = document.getElementById('project-modal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');

    if (projectGrid) {
        projectGrid.addEventListener('click', (e) => {
            const detailButton = e.target.closest('.details-button');
            if (detailButton) {
                e.preventDefault();
                const card = detailButton.closest('.project-card');
                const projectIndex = card.dataset.projectIndex;
                openProjectModal(allProjectsData[projectIndex]);
            }
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => closeProjectModal());
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeProjectModal();
        });
    }
}

/**
 * Mengisi modal dengan data, lalu menjalankan animasi masuk.
 * @param {object} project - Objek data proyek yang akan ditampilkan.
 */
function openProjectModal(project) {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    // Ambil semua elemen yang akan dianimasikan
    const modalGallery = document.querySelector('.modal-gallery');
    const modalDetails = document.querySelector('.modal-details');

    // 1. Reset (sembunyikan) semua elemen animasi sebelum modal muncul
    const images = modalGallery.querySelectorAll('img');
    const textElements = modalDetails.querySelectorAll('*');
    images.forEach(img => img.classList.remove('animated'));
    textElements.forEach(el => el.classList.remove('animated'));

    // 2. Isi modal dengan data baru
    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-technologies').textContent = project.technologies;
    document.getElementById('modal-short-description').textContent = project.short_description;
    document.getElementById('modal-long-description').innerHTML = project.long_description.replace(/\n/g, '<br>');
    
    modalGallery.innerHTML = ''; // Kosongkan galeri
    if (project.imageUrls && project.imageUrls.length > 0) {
        project.imageUrls.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = `Gambar detail untuk ${project.title}`;
            modalGallery.appendChild(img);
        });
    } else {
        modalGallery.innerHTML = '<p>Tidak ada gambar detail untuk proyek ini.</p>';
    }

    // 3. Tampilkan modal
    modal.classList.add('visible');

    // 4. Jalankan animasi setelah modal tampil (beri delay singkat)
    setTimeout(() => {
        const newImages = modalGallery.querySelectorAll('img');
        const newTextElements = modalDetails.querySelectorAll('*:not(h2)'); // Animasikan semua kecuali judul utama
        
        // Animasikan gambar satu per satu
        newImages.forEach((img, index) => {
            setTimeout(() => {
                img.classList.add('animated');
            }, index * 150); // Delay 150ms untuk setiap gambar
        });

        // Animasikan teks satu per satu setelah gambar terakhir mulai muncul
        const imageAnimationDuration = newImages.length * 150;
        setTimeout(() => {
            // Judul muncul lebih dulu
             document.getElementById('modal-title').classList.add('animated');
             // Lalu elemen lainnya
            newTextElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('animated');
                }, (index + 1) * 100); // Delay 100ms untuk setiap elemen teks
            });
        }, imageAnimationDuration);

    }, 50); // Delay 50ms setelah modal visible untuk transisi yang mulus
}

/**
 * Menyembunyikan modal pop-up.
 */
function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.classList.remove('visible');
    }
}

/**
 * Mengaktifkan animasi fade-in untuk kartu proyek.
 */
function activateFadeInAnimation() {
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.1 };
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);
    faders.forEach(fader => appearOnScroll.observe(fader));
}
