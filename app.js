// --- LOGIKA UTAMA WEBSITE (APLIKASI) ---
let currentMainCat = "Semua";
let currentSubCat = "";

// RENDER KATEGORI UTAMA
function renderMainCategories() {
    const container = document.getElementById('mainCategories');
    if (!container) return;
    container.innerHTML = "";

    if (typeof categoriesData === 'undefined') return;

    categoriesData.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `cat-chip ${cat.name === currentMainCat ? 'active' : ''}`;
        btn.innerHTML = `${cat.name}`;
        btn.onclick = () => {
            currentMainCat = cat.name;
            currentSubCat = "";
            renderMainCategories();
            renderSubCategories(cat);
            filterProducts();
        };
        container.appendChild(btn);
    });

    const activeCatObj = categoriesData.find(c => c.name === currentMainCat);
    if (activeCatObj) renderSubCategories(activeCatObj);
}

// RENDER SUB-KATEGORI
function renderSubCategories(catObj) {
    const container = document.getElementById('subCategoriesContainer');
    const subContainer = document.getElementById('subCategories');
    if (!container || !subContainer) return;
    
    if (!catObj.subs || catObj.subs.length === 0 || currentMainCat === "Semua") {
        container.style.display = "none";
        return;
    }

    container.style.display = "block";
    subContainer.innerHTML = "";

    const allSubBtn = document.createElement('button');
    allSubBtn.className = `sub-chip ${currentSubCat === "" ? 'active' : ''}`;
    allSubBtn.innerHTML = `Semua ${catObj.name}`;
    allSubBtn.onclick = () => {
        currentSubCat = "";
        renderSubCategories(catObj);
        filterProducts();
    };
    subContainer.appendChild(allSubBtn);

    catObj.subs.forEach(sub => {
        const subBtn = document.createElement('button');
        subBtn.className = `sub-chip ${currentSubCat === sub ? 'active' : ''}`;
        subBtn.innerHTML = sub;
        subBtn.onclick = () => {
            currentSubCat = sub;
            renderSubCategories(catObj);
            filterProducts();
        };
        subContainer.appendChild(subBtn);
    });
}

// FILTER & RENDER PRODUK
function filterProducts() {
    if (typeof products === 'undefined') return;
    let result = products;
    const searchInputElem = document.getElementById('searchInput');
    const keyword = searchInputElem ? searchInputElem.value.toLowerCase().trim() : "";

    if (currentMainCat !== "Semua") {
        result = result.filter(p => p.category === currentMainCat);
    }

    if (currentSubCat !== "") {
        result = result.filter(p => p.subCategory === currentSubCat);
    }

    if (keyword !== "") {
        result = result.filter(p => 
            p.name.toLowerCase().includes(keyword) || 
            (p.subCategory && p.subCategory.toLowerCase().includes(keyword)) ||
            (p.category && p.category.toLowerCase().includes(keyword)) ||
            (p.platform && p.platform.toLowerCase().includes(keyword))
        );
    }

    renderProducts(result);
}

// RENDER GRID PRODUK (Dengan Tombol Aksi Gradasi Senada)
function renderProducts(data) {
    const container = document.getElementById('product-container');
    if (!container) return; 
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 2rem; color: var(--text-muted);">Produk tidak ditemukan atau segera diluncurkan...</p>`;
        return;
    }

    data.forEach(product => {
        let shopBadgeHTML = '';
        if (product.shopBadge === "Shopee Mall") {
            shopBadgeHTML = `<span class="shopee-mall-badge">Mall | Ori</span>`;
        } else if (product.shopBadge === "Star+") {
            shopBadgeHTML = `<span class="shopee-star-plus-badge">Star+</span>`;
        } else if (product.shopBadge === "Star") {
            shopBadgeHTML = `<span class="shopee-star-badge">Star</span>`;
        }

        let priceHTML = `<span class="current-price">${product.price}</span>`;
        if (product.originalPrice) {
            priceHTML += `<span class="original-price">${product.originalPrice}</span>`;
        }

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <a href="${product.link}" target="_blank" rel="noopener noreferrer" class="product-img-wrap" style="cursor: pointer; display: block; text-decoration: none;">
                <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300?text=Gambar+Tidak+Tersedia'">
                <span class="product-badge">${product.badge || 'Rekomendasi'}</span>
            </a>
            <div class="product-body">
                <div class="product-platform">${product.platform || 'Shopee'}</div>
                <div class="product-title-row">
                    ${shopBadgeHTML}
                    <a href="${product.link}" target="_blank" rel="noopener noreferrer" class="product-title" style="text-decoration: none; color: inherit; display: block;">${product.name}</a>
                </div>
                <div class="price-container">
                    ${priceHTML}
                </div>
                
                <div class="product-actions" style="display: flex; gap: 8px; margin-top: auto; padding-top: 8px;">
                    <button onclick="openModal(${product.id})" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 10px; font-size: 0.78rem; font-weight: 700; color: #028090; background: rgba(2, 195, 154, 0.1); border: 1px solid rgba(2, 195, 154, 0.4); border-radius: 10px; cursor: pointer; transition: all 0.2s ease;">
                        <i class="fas fa-eye"></i>
                        <span>Detail</span>
                    </button>

                    <a href="${product.link}" target="_blank" rel="noopener noreferrer" style="flex: 1.2; display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; font-size: 0.78rem; font-weight: 700; color: #ffffff; background: linear-gradient(135deg, #02c39a, #028090); border-radius: 10px; text-decoration: none; box-shadow: 0 4px 12px rgba(2, 195, 154, 0.35);">
                        <span>Beli</span>
                        <div style="width: 20px; height: 20px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-arrow-right" style="font-size: 0.65rem;"></i>
                        </div>
                    </a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

   // KARTU PENUTUP ULTIMATE STORE
   const shopLinkUrl = typeof getActiveStoreLink === 'function' ? getActiveStoreLink(currentMainCat, currentSubCat) : "#";

   const endCard = document.createElement('div');
   endCard.className = 'end-store-card-pro';
   endCard.innerHTML = `
        <div class="end-store-glow-bg"></div>
        <div class="end-store-content-pro">
            <div class="end-store-icon-ring">
                <i class="fas fa-store-alt"></i>
            </div>
            <h3 class="end-store-title">Official Store</h3>
            <p class="end-store-desc">Temukan ribuan produk pilihan langsung di official Store-nya.</p>
            
            <a href="${shopLinkUrl}" target="_blank" rel="noopener noreferrer" class="btn-ultimate-shopee">
                <span class="btn-shine-effect"></span>
                <span class="btn-label-text">Selengkapnya</span>
                <span class="btn-arrow-badge">
                    <i class="fas fa-arrow-right"></i>
                </span>
            </a>
        </div>
   `;
   container.appendChild(endCard);
}

// REALTIME SEARCH INPUT LISTENER (Dengan pelindung duplikasi)
const searchInputElem = document.getElementById('searchInput');
if (searchInputElem && !searchInputElem.dataset.listenerAttached) {
    searchInputElem.dataset.listenerAttached = "true";
    searchInputElem.addEventListener('input', () => {
        filterProducts();
    });
}

// MODAL DETAIL PRODUK
function openModal(id) {
    if (typeof products === 'undefined') return;
    const product = products.find(p => p.id === id);
    const modal = document.getElementById('productModal');
    const body = document.getElementById('modalBody');
    if (!modal || !body || !product) return;

    body.innerHTML = `
        <img src="${product.image}" alt="${product.name}" style="width:100%; height:200px; object-fit:cover; border-radius:12px; margin-bottom:1rem;" onerror="this.src='https://via.placeholder.com/300?text=Gambar+Tidak+Tersedia'">
        <span class="product-platform"><i class="fas fa-tag"></i> ${product.platform || 'Shopee'} &bull; ${product.category} (${product.subCategory})</span>
        <h2 style="font-size: 1.15rem; font-weight: 800; margin: 0.4rem 0;">${product.name}</h2>
        <div class="price-container" style="margin-bottom:0.75rem;">
            <span class="current-price" style="font-size:1.1rem;">${product.price}</span>
            ${product.originalPrice ? `<span class="original-price">${product.originalPrice}</span>` : ''}
        </div>
        <p style="color:var(--text-muted); font-size: 0.85rem; line-height: 1.6; margin-bottom: 1.5rem;">${product.description || 'Silakan cek langsung detail lengkap produk ini melalui tombol di bawah.'}</p>
        
        <a href="${product.link}" target="_blank" rel="noopener noreferrer" class="modal-cta-buy">
            <span>Amankan Promo & Beli Sekarang via ${product.platform || 'Shopee'}</span> 
            <i class="fas fa-hand-point-right pointing-icon" style="font-size: 1.1rem;"></i>
        </a>
    `;
    modal.style.display = 'flex';
}

const closeModalBtn = document.querySelector('.close-modal');
if (closeModalBtn) {
    closeModalBtn.onclick = () => {
        const modal = document.getElementById('productModal');
        if (modal) modal.style.display = 'none';
    };
}

window.onclick = (e) => {
    const modal = document.getElementById('productModal');
    if (e.target === modal) modal.style.display = 'none';
};

// NAVBAR SCROLL & MOBILE MENU TOGGLE
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    if (window.scrollY > 30) {
        navbar.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
    } else {
        navbar.style.boxShadow = "none";
    }
});

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.onclick = (e) => {
        e.stopPropagation();
        navLinks.style.display = (navLinks.style.display === 'flex') ? 'none' : 'flex';
    };

    navLinks.querySelectorAll('a').forEach(link => {
        link.onclick = () => {
            if (window.innerWidth < 768) {
                navLinks.style.display = 'none';
            }
        };
    });
}

// THEME TOGGLE
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.onclick = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'light');
        }
    };
}

if (localStorage.getItem('theme') === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Inisialisasi awal aplikasi saat DOM siap
document.addEventListener("DOMContentLoaded", () => {
    renderMainCategories();
    filterProducts();
    typeSearchPlaceholder();
});

// --- EFEK MENGETIK PADA SEARCH PLACEHOLDER ---
const searchWords = [
    "Cari produk Shinzui...", 
    "Cari E-Book & Template...", 
    "Cari Kemeja & Fashion...", 
    "Cari Skintific & Skincare...", 
    "Cari Earphone TWS..."
];
let wordIdx = 0;
let charIdx = 0;
let isDeleting = false;

function typeSearchPlaceholder() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    const currentWord = searchWords[wordIdx];
    
    if (isDeleting) {
        searchInput.setAttribute('placeholder', currentWord.substring(0, charIdx - 1));
        charIdx--;
    } else {
        searchInput.setAttribute('placeholder', currentWord.substring(0, charIdx + 1));
        charIdx++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIdx === currentWord.length) {
        typeSpeed = 2000; 
        isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % searchWords.length;
        typeSpeed = 500;
    }

    setTimeout(typeSearchPlaceholder, typeSpeed);
}

// --- PENGELOLAAN MUSIK LATAR (AUTO-PLAY & AUTO-STOP) ---
const bgMusic = document.getElementById('bgMusic');

if (bgMusic) {
    bgMusic.volume = 0.5;

    const startAudio = () => {
        bgMusic.play().then(() => {
            window.removeEventListener('click', startAudio);
            window.removeEventListener('touchstart', startAudio);
            window.removeEventListener('scroll', startAudio);
        }).catch(err => {
            // Mengabaikan penolakan kebijakan pemutaran otomatis browser
        });
    };

    window.addEventListener('click', startAudio);
    window.addEventListener('touchstart', startAudio);
    window.addEventListener('scroll', startAudio, { once: true });

    window.addEventListener('beforeunload', () => {
        bgMusic.pause();
        bgMusic.currentTime = 0;
    });
}
