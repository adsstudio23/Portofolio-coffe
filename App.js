// =============================================
// DATA REVIEW TERSIMPAN (LocalStorage)
// =============================================
let reviews = JSON.parse(localStorage.getItem('kopiLerengReviews')) || [
    {
        id: 1,
        name: 'Rina Marlina',
        rating: 5,
        comment: 'Tempatnya nyaman banget! Kopi susu gula arennya juara. View pegunungan bikin betah berlama-lama. Pasti balik lagi!',
        time: '2 hari yang lalu'
    },
    {
        id: 2,
        name: 'Andi Pratama',
        rating: 4,
        comment: 'Enak buat WFC, WiFi kencang. Platter gorengannya cocok buat teman kerja. Cuma parkiran agak kecil.',
        time: '5 hari yang lalu'
    },
    {
        id: 3,
        name: 'Siti Nurhaliza',
        rating: 5,
        comment: 'V60 Manual Brew-nya TOP! Biji kopi lokal berkualitas. Tempatnya aesthetic banget buat foto-foto.',
        time: '1 minggu yang lalu'
    },
    {
        id: 4,
        name: 'Budi Hartono',
        rating: 5,
        comment: 'Cocok buat ngerjain tugas kuliah. Suasananya tenang, kopinya enak. Recommended!',
        time: '2 minggu yang lalu'
    }
];

let selectedRating = 0;


// =============================================
// SIMPAN DATA KE LOCALSTORAGE
// =============================================
function saveReviews() {
    localStorage.setItem('kopiLerengReviews', JSON.stringify(reviews));
}


// =============================================
// RENDER SEMUA REVIEW
// =============================================
function renderReviews() {
    const reviewList = document.getElementById('reviewList');
    
    if (reviews.length === 0) {
        reviewList.innerHTML = '<p style="color:#999; padding: 30px;">Belum ada review. Jadilah yang pertama! 🎉</p>';
        updateAverageRating();
        return;
    }

    reviewList.innerHTML = reviews.map(review => {
        const starsHTML = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        return `
            <div class="review-card">
                <div class="review-header">
                    <span class="reviewer-name">${escapeHTML(review.name)}</span>
                    <span class="review-stars">${starsHTML}</span>
                </div>
                <span class="review-time">${review.time}</span>
                <p class="review-comment">${escapeHTML(review.comment)}</p>
            </div>
        `;
    }).join('');

    updateAverageRating();
}


// =============================================
// UPDATE RATA-RATA RATING
// =============================================
function updateAverageRating() {
    const total = reviews.length;
    if (total === 0) {
        document.getElementById('avgRating').textContent = '0.0';
        document.getElementById('avgStars').innerHTML = '<span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>';
        document.getElementById('totalReviews').textContent = '0';
        return;
    }

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = (sum / total).toFixed(1);

    document.getElementById('avgRating').textContent = avg;
    document.getElementById('totalReviews').textContent = total;

    // Update bintang rata-rata
    const roundedAvg = Math.round(sum / total);
    const avgStarsDiv = document.getElementById('avgStars');
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        starsHTML += i <= roundedAvg ? '<span>⭐</span>' : '<span>☆</span>';
    }
    avgStarsDiv.innerHTML = starsHTML;
}


// =============================================
// ESCAPE HTML UNTUK KEAMANAN
// =============================================
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}


// =============================================
// STAR RATING INPUT
// =============================================
function setStarRating(rating) {
    selectedRating = rating;
    const stars = document.querySelectorAll('#starRating .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.textContent = '★';
            star.classList.add('selected');
        } else {
            star.textContent = '☆';
            star.classList.remove('selected');
        }
    });
    document.getElementById('reviewRating').value = rating;

    const hints = ['', 'Kurang 😞', 'Cukup 😐', 'Lumayan 👍', 'Bagus 😊', 'Sangat Bagus! 🤩'];
    const hintEl = document.getElementById('ratingHint');
    hintEl.textContent = rating > 0 ? hints[rating] : 'Pilih rating bintang';
    if (rating > 0) hintEl.style.color = '#FFB800';
    else hintEl.style.color = '#999';
}


// =============================================
// TOGGLE FORM REVIEW
// =============================================
function toggleReviewForm() {
    const formWrapper = document.getElementById('reviewFormWrapper');
    const btn = document.getElementById('btnTulisReview');
    
    if (formWrapper.style.display === 'none' || formWrapper.style.display === '') {
        formWrapper.style.display = 'block';
        btn.textContent = '✖️ Tutup Form';
        btn.style.backgroundColor = '#999';
        // Scroll ke form
        setTimeout(() => {
            formWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    } else {
        formWrapper.style.display = 'none';
        btn.textContent = '✍️ Tulis Review Kamu';
        btn.style.backgroundColor = '#D4A853';
        resetForm();
    }
}


// =============================================
// SUBMIT REVIEW BARU
// =============================================
function submitReview(event) {
    event.preventDefault();

    const name = document.getElementById('reviewerName').value.trim();
    const rating = parseInt(document.getElementById('reviewRating').value);
    const comment = document.getElementById('reviewComment').value.trim();

    // Validasi
    if (name === '') {
        alert('Mohon isi nama kamu ya! 🙏');
        return;
    }
    if (rating === 0) {
        alert('Jangan lupa pilih rating bintang ya! ⭐');
        return;
    }
    if (comment === '') {
        alert('Tulis komentar dulu ya! ✍️');
        return;
    }

    // Buat review baru
    const newReview = {
        id: Date.now(),
        name: name,
        rating: rating,
        comment: comment,
        time: 'Baru saja'
    };

    // Tambahkan ke array
    reviews.unshift(newReview);

    // Simpan ke localStorage
    saveReviews();

    // Render ulang
    renderReviews();

    // Reset form
    resetForm();

    // Tutup form
    document.getElementById('reviewFormWrapper').style.display = 'none';
    document.getElementById('btnTulisReview').textContent = '✍️ Tulis Review Kamu';
    document.getElementById('btnTulisReview').style.backgroundColor = '#D4A853';

    // Scroll ke daftar review
    document.getElementById('reviewList').scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Animasi sukses
    showToast('Review berhasil dikirim! 🎉 Terima kasih!');
}


// =============================================
// RESET FORM
// =============================================
function resetForm() {
    document.getElementById('reviewForm').reset();
    document.getElementById('reviewRating').value = '0';
    selectedRating = 0;
    document.getElementById('charCount').textContent = '0';
    document.getElementById('ratingHint').textContent = 'Pilih rating bintang';
    document.getElementById('ratingHint').style.color = '#999';

    const stars = document.querySelectorAll('#starRating .star');
    stars.forEach(star => {
        star.textContent = '☆';
        star.classList.remove('selected');
    });
}


// =============================================
// TOAST NOTIFIKASI SUKSES
// =============================================
function showToast(message) {
    // Buat elemen toast
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #2E5A3B;
        color: #fff;
        padding: 14px 28px;
        border-radius: 50px;
        font-size: 0.95rem;
        font-weight: bold;
        z-index: 9999;
        box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        animation: fadeInUp 0.4s ease-out;
        text-align: center;
        max-width: 90%;
    `;

    document.body.appendChild(toast);

    // Hapus setelah 3 detik
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}


// =============================================
// CHARACTER COUNT
// =============================================
document.getElementById('reviewComment').addEventListener('input', function() {
    document.getElementById('charCount').textContent = this.value.length;
});


// =============================================
// NAVBAR SCROLL EFFECT
// =============================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


// =============================================
// HAMBURGER MENU TOGGLE (MOBILE)
// =============================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});


// =============================================
// SMOOTH SCROLL FALLBACK
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


// =============================================
// ANIMASI FADE-IN SAAT SCROLL
// =============================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

const cardsToAnimate = document.querySelectorAll('.feature-card, .menu-card');
cardsToAnimate.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

window.addEventListener('load', () => {
    cardsToAnimate.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });

    // Render reviews saat halaman load
    renderReviews();
});