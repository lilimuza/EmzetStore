// ==========================================================================
// --- LOGIKA UTAMA WEBSITE (APLIKASI) ---
// ==========================================================================

let currentMainCat = "Semua";
let currentSubCat = "";

// --------------------------------------------------------------------------
// 1. RENDER KATEGORI UTAMA
// --------------------------------------------------------------------------
function renderMainCategories() {
    const container = document.getElementById('mainCategories');
    if (!container) return;
    container.innerHTML = "";

    if (typeof categoriesData === 'undefined' || !Array.isArray(categoriesData)) return;

    categoriesData.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `cat-chip ${cat.name === currentMainCat ? 'active' : ''}`;
        btn.innerHTML = `${cat.name}`;
        
        btn.onclick = () => {
            currentMainCat = cat.name;
            currentSubCat = ""; // Reset sub-kategori saat kategori utama berganti
            renderMainCategories();
            renderSubCategories(cat);
            filterProducts();
        };
        
        container.appendChild(btn);
    });

    const activeCatObj = categoriesData.find(c => c.name === currentMainCat);
    if (activeCatObj) {
        renderSubCategories(activeCatObj);
    }
}

// --------------------------------------------------------------------------
// 2. RENDER SUB-KATEGORI
// --------------------------------------------------------------------------
function renderSubCategories(catObj) {
    const container = document.getElementById('subCategoriesContainer');
    const subContainer = document.getElementById('subCategories');
    if (!container || !subContainer) return;
    
    // Sembunyikan jika tidak ada sub-kategori atau memilih "Semua"
    if (!catObj || !catObj.subs || catObj.subs.length === 0 || currentMainCat === "Semua") {
        container.style.display = "none";
        subContainer.innerHTML = "";
        return;
    }

    container.style.display = "block";
    subContainer.innerHTML = "";

    // Tombol "Semua" dalam Sub-kategori
    const allSubBtn = document.createElement('button');
    allSubBtn.className = `sub-chip ${currentSubCat === "" ? 'active' : ''}`;
    allSubBtn.innerHTML = `Semua ${catObj.name}`;
    allSubBtn.onclick = () => {
        currentSubCat = "";
        renderSubCategories(catObj);
        filterProducts();
    };
    subContainer.appendChild(allSubBtn);

    // Iterasi item sub-kategori
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

// --------------------------------------------------------------------------
// 3. FILTER & RENDER PRODUK
// --------------------------------------------------------------------------
function filterProducts() {
    if (typeof products === 'undefined' || !Array.isArray(products)) return;
    
    let result = products;
    const searchInputElem = document.getElementById('searchInput');
    const keyword = searchInputElem ? searchInputElem.value.toLowerCase().trim() : "";

    // Filter Kategori Utama
    if (currentMainCat !== "Semua") {
        result = result.filter(p => p.category === currentMainCat);
    }

    // Filter Sub-Kategori
    if (currentSubCat !== "") {
        result = result.filter(p => p.subCategory === currentSubCat);
    }

    // Filter Kata Kunci Pencarian
    if (keyword !== "") {
        result = result.filter(p => 
            (p.name && p.name.toLowerCase().includes(keyword)) || 
            (p.subCategory && p.subCategory.toLowerCase().includes(keyword)) ||
            (p.category && p.category.toLowerCase().includes(keyword)) ||
            (p.platform && p.platform.toLowerCase().includes(keyword))
        );
    }

    renderProducts(result);
}

// --------------------------------------------------------------------------
// 4. RENDER GRID PRODUK
// --------------------------------------------------------------------------
function renderProducts(data) {
    const container = document.getElementById('product-container');
    if (!container) return; 
    container.innerHTML = '';

    // Tampilan jika produk tidak ditemukan
    if (!data || data.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding: 3rem 1rem; color: var(--text-muted);">
                <i class="fas fa-box-open" style="font-size: 2.5rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
                <p>Produk tidak ditemukan atau segera diluncurkan...</p>
            </div>`;
        return;
    }

    data.forEach(product => {
        // Badge Penjual / Toko
        let shopBadgeHTML = '';
        if (product.shopBadge === "Shopee Mall") {
            shopBadgeHTML = `<span class="shopee-mall-badge">Mall | Ori</span>`;
        } else if (product.shopBadge === "Star+") {
            shopBadgeHTML = `<span class="shopee-star-plus-badge">Star+</span>`;
        } else if (product.shopBadge === "Star") {
            shopBadgeHTML = `<span class="shopee-star-badge">Star</span>`;
        }

        // Harga
        let priceHTML = `<span class="current-price">${product.price}</span>`;
        if (product.originalPrice) {
            priceHTML += `<span class="original-price">${product.originalPrice}</span>`;
        }

        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <a href="${product.link}" target="_blank" rel="noopener noreferrer" class="product-img-wrap">
                <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300?text=Gambar+Tidak+Tersedia'">
                <span class="product-badge">${product.badge || 'Rekomendasi'}</span>
            </a>
            <div class="product-body">
                <div>
                    <div class="product-platform">${product.platform || 'Shopee'}</div>
                    <div class="product-title-row">
                        ${shopBadgeHTML}
                        <a href="${product.link}" target="_blank" rel="noopener noreferrer" class="product-title">${product.name}</a>
                    </div>
                    <div class="price-container">
                        ${priceHTML}
                    </div>
                </div>
                
                <!-- TOMBOL AKSI -->
                <div class="product-actions">
                    <button class="btn-detail" onclick="openModal(${product.id})">
                        <i class="fas fa-eye"></i>
                        <span>Detail</span>
                    </button>

                    <a href="${product.link}" target="_blank" rel="noopener noreferrer" class="btn-buy">
                        <span>Beli</span>
                        <div class="arrow-icon-circle">
                            <i class="fas fa-arrow-right"></i>
                        </div>
                    </a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // KARTU PENUTUP (OFFICIAL STORE)
    const shopLinkUrl = typeof getActiveStoreLink === 'function' ? getActiveStoreLink(currentMainCat, currentSubCat) : "#";

    const endCard = document.createElement('div');
    endCard.className = 'product-card end-store-card-pro';

    endCard.innerHTML = `
        <div class="end-store-content-pro">
            <div class="end-store-main-info">
                <div class="end-store-icon-ring">
                    <i class="fas fa-store-alt"></i>
                </div>
                <h3 class="end-store-title">Official Store</h3>
                <p class="end-store-desc">Temukan ribuan produk pilihan langsung di official Store-nya.</p>
            </div>
            
            <a href="${shopLinkUrl}" target="_blank" rel="noopener noreferrer" class="btn-ultimate-teal">
                <span>Selengkapnya</span>
                <div class="arrow-icon-circle">
                    <i class="fas fa-arrow-right"></i>
                </div>
            </a>
        </div>
    `;
    container.appendChild(endCard);
}

// --------------------------------------------------------------------------
// 5. MODAL DETAIL PRODUK
// --------------------------------------------------------------------------
function openModal(id) {
    if (typeof products === 'undefined') return;
    const product = products.find(p => p.id === id);
    const modal = document.getElementById('productModal');
    const body = document.getElementById('modalBody');
    if (!modal || !body || !product) return;

    body.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="modal-img" onerror="this.src='https://via.placeholder.com/300?text=Gambar+Tidak+Tersedia'">
        <span class="product-platform"><i class="fas fa-tag"></i> ${product.platform || 'Shopee'} &bull; ${product.category} (${product.subCategory || 'Umum'})</span>
        <h2 class="modal-title">${product.name}</h2>
        <div class="price-container" style="margin-bottom:0.75rem;">
            <span class="current-price" style="font-size:1.1rem;">${product.price}</span>
            ${product.originalPrice ? `<span class="original-price">${product.originalPrice}</span>` : ''}
        </div>
        <p class="modal-desc">${product.description || 'Silakan cek langsung detail lengkap produk ini melalui tombol di bawah.'}</p>
        
        <a href="${product.link}" target="_blank" rel="noopener noreferrer" class="modal-cta-buy">
            <span>Beli Sekarang via ${product.platform || 'Shopee'}</span> 
            <i class="fas fa-hand-point-right pointing-icon"></i>
        </a>
    `;
    modal.style.display = 'flex';
}

// --------------------------------------------------------------------------
// 6. EFEK MENGETIK PADA SEARCH PLACEHOLDER
// --------------------------------------------------------------------------
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

// --------------------------------------------------------------------------
// 7. INISIALISASI EVENT LISTENERS & DAFTAR EVENT SAAT DOM READY
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // Render Kategori & Produk awal
    renderMainCategories();
    filterProducts();
    typeSearchPlaceholder();

    // Event Input Pencarian & Tombol Cari
    const searchInputElem = document.getElementById('searchInput');
    const searchBtnElem = document.querySelector('.compact-search-btn') || document.querySelector('.search-btn');

    if (searchInputElem) {
        searchInputElem.addEventListener('input', filterProducts);
    }

    if (searchBtnElem) {
        searchBtnElem.onclick = () => {
            filterProducts();
            const productsSection = document.getElementById('products');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
            }
        };
    }

    // Modal Events
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.onclick = () => {
            const modal = document.getElementById('productModal');
            if (modal) modal.style.display = 'none';
        };
    }

    window.addEventListener('click', (e) => {
        const modal = document.getElementById('productModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;
        if (window.scrollY > 30) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.onclick = (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
        };

        navLinks.querySelectorAll('a').forEach(link => {
            link.onclick = () => {
                if (window.innerWidth < 768) {
                    navLinks.classList.remove('active');
                }
            };
        });

        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }

    // Background Music (Safely handling auto-play policy)
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        bgMusic.volume = 0.4;

        const startAudio = () => {
            bgMusic.play().then(() => {
                window.removeEventListener('click', startAudio);
                window.removeEventListener('touchstart', startAudio);
                window.removeEventListener('scroll', startAudio);
            }).catch(() => {});
        };

        window.addEventListener('click', startAudio);
        window.addEventListener('touchstart', startAudio);
        window.addEventListener('scroll', startAudio, { once: true });

        window.addEventListener('beforeunload', () => {
            bgMusic.pause();
            bgMusic.currentTime = 0;
        });
    }
});
