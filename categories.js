// --- PEMETAAN LINK TOKO RESMI PER SUB-KATEGORI ---
const subCategoryLinks = {
    // Kecantikan
    "Shinzui": "https://s.shopee.co.id/4AynDJME4H",
    "Wardah": "https://s.shopee.co.id/6fg8BwxTLH",
    "Skintific": "https://s.shopee.co.id/5fnb08eKr1",
    "G2G": "https://s.shopee.co.id/8AUvylH17d",
    "Pond's": "https://s.shopee.co.id/2qTPd0nmzY",
    "Citra": "https://s.shopee.co.id/2qTPd0nmzY",
    "Kahf": "https://s.shopee.co.id/Lm4eSn9qH",
    "Glow&Lovely": "https://s.shopee.co.id/2qTPd0nmzY",
    "Vaseline": "https://s.shopee.co.id/2qTPd0nmzY",
    "Makarizo": "https://s.shopee.co.id/2BDix4waSP",
    "Hanasui": "https://s.shopee.co.id/40fNmEa04F",
    
    // Fashion Pria (For Him)
    "Shirt Him": "https://s.shopee.co.id/2LX9AJCJpB",
    "T-Shirt": "https://s.shopee.co.id/6L3HvlMvDM",
    "Polo Shirt": "https://s.shopee.co.id/6L3HvlMvDM",
    "Sweater & Hoodie": "https://s.shopee.co.id/8V7mVqceFH",
    "Cardigan": "https://shopee.co.id/link_cardigan",
    "Blazer": "https://shopee.co.id/link_blazer",
    "Jaket Bomber": "https://shopee.co.id/link_jaket_bomber",
    "Jaket Denim": "https://shopee.co.id/link_jaket_denim",
    "Jaket Kulit": "https://shopee.co.id/link_jaket_kulit",
    "Parka/Anorak": "https://shopee.co.id/link_parka_anorak",
    "Vest": "https://shopee.co.id/link_vest",
    "KoKo": "https://shopee.co.id/link_baju_koko",
    "Batik": "https://shopee.co.id/link_batik",
    "Surjan/Beskap": "https://shopee.co.id/link_surjan_beskap",

    // Fashion Wanita (For Her)
    "Shirt Her": "https://s.shopee.co.id/8KoMJkX04G",
    "Tunic": "https://s.shopee.co.id/8KoMJkX04G",
    "Dress": "https://s.shopee.co.id/8KoMJkX04G",
    "Jumpsuit": "https://shopee.co.id/link_jumpsuit",
    "Skirt": "https://shopee.co.id/link_skirt",
    "Pants": "https://shopee.co.id/link_pants",
    "Outwear Kasual": "https://shopee.co.id/link_outwear_kasual",

    // Minuman & Digital
    "Kopi": "https://collshp.com/kopidukasi",
    "Worksheet": "https://lynk.id/yakinbeli",
    "E-Book": "https://lynk.id/yakinbeli"
};

// --- DATA KATEGORI UTAMA & SUB-KATEGORI ---
const categoriesData = [
    {
        name: "Semua",
        subs: []
    },
    {
        name: "Kecantikan",
        subs: ["Shinzui", "Wardah", "Skintific", "G2G", "Pond's", "Citra", "Kahf", "Glow&Lovely", "Vaseline", "Makarizo", "Hanasui"]
    },
    {
        name: "For Him",
        subs: ["Shirt Him", "T-Shirt", "Polo Shirt", "Sweater & Hoodie"]
    },
    {
        name: "For Her",
        subs: ["Shirt Her", "Tunic", "Dress"]
    },
    {
        name: "Minuman",
        subs: ["Kopi"]
    },
    {
        name: "Produk Digital",
        subs: ["Worksheet", "E-Book"]
    }
];

// --- HELPER UNTUK MENGAMBIL LINK SECARA DINAMIS ---
function getActiveStoreLink(currentMainCat, currentSubCat) {
    // 1. Jika sub-kategori dipilih dan memiliki link di subCategoryLinks, gunakan itu
    if (currentSubCat && subCategoryLinks[currentSubCat]) {
        return subCategoryLinks[currentSubCat];
    }
    
    // 2. Jika tidak ada sub-kategori, ambil link dari sub-kategori pertama di kategori utama tersebut
    const catObj = categoriesData.find(c => c.name === currentMainCat);
    if (catObj && catObj.subs && catObj.subs.length > 0) {
        for (let sub of catObj.subs) {
            if (subCategoryLinks[sub]) {
                return subCategoryLinks[sub];
            }
        }
    }
    
    // 3. Fallback default jika kosong
    return "https://shopee.co.id";
}