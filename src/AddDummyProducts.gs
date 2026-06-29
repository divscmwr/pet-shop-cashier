/**
 * Add dummy products for testing
 */
function addDummyProducts() {
  const products = [
    // Makanan
    { name: 'Royal Canin Adult 10kg', category: 'Makanan', price: 450000, stock: 25 },
    { name: 'Whiskas Adult 1.2kg', category: 'Makanan', price: 55000, stock: 50 },
    { name: 'Me-O Persicat 1.5kg', category: 'Makanan', price: 48000, stock: 40 },
    { name: 'Pro Plan Puppy 3kg', category: 'Makanan', price: 285000, stock: 20 },
    { name: 'Pedigree DentaStix 12pk', category: 'Makanan', price: 85000, stock: 35 },
    { name: 'Friskies Wet Food 80g', category: 'Makanan', price: 15000, stock: 100 },
    { name: 'SmartHeart Gold 1kg', category: 'Makanan', price: 35000, stock: 60 },
    { name: 'Dog Food Premium 5kg', category: 'Makanan', price: 220000, stock: 15 },

    // Aksesoris
    { name: 'Kalung Kucing Bell', category: 'Aksesoris', price: 25000, stock: 50 },
    { name: 'Tempat Makan Stainless S', category: 'Aksesoris', price: 45000, stock: 30 },
    { name: 'Tempat Makan Stainless M', category: 'Aksesoris', price: 65000, stock: 25 },
    { name: 'Sisir Kucing Premium', category: 'Aksesoris', price: 35000, stock: 40 },
    { name: 'Mainan Bola Kucing', category: 'Aksesoris', price: 20000, stock: 60 },
    { name: 'Tali Lesen 1.5m', category: 'Aksesoris', price: 55000, stock: 35 },
    { name: 'Tempat Tidur Dogbed M', category: 'Aksesoris', price: 185000, stock: 15 },
    { name: 'Kandang Kucing Portable', category: 'Aksesoris', price: 275000, stock: 10 },
    { name: 'Scratching Post 50cm', category: 'Aksesoris', price: 125000, stock: 20 },

    // Obat-Obatan
    { name: 'OB Plus 100ml', category: 'Obat-Obatan', price: 85000, stock: 40 },
    { name: 'Drontal Plus Dewormer', category: 'Obat-Obatan', price: 65000, stock: 50 },
    { name: 'Frontline Plus Kucing', category: 'Obat-Obatan', price: 145000, stock: 30 },
    { name: 'Otto Anti Kutu 100ml', category: 'Obat-Obatan', price: 95000, stock: 35 },
    { name: 'Virbac Eye Clean', category: 'Obat-Obatan', price: 55000, stock: 45 },
    { name: 'Minyak Kayu Putih Vet', category: 'Obat-Obatan', price: 25000, stock: 60 },
    { name: 'Betadine Solution', category: 'Obat-Obatan', price: 35000, stock: 50 },
    { name: 'Vitamin E Pet 100ml', category: 'Obat-Obatan', price: 75000, stock: 40 },

    // Grooming
    { name: 'Shampoo Kucing 200ml', category: 'Grooming', price: 65000, stock: 45 },
    { name: 'Shampoo Anjing 200ml', category: 'Grooming', price: 70000, stock: 40 },
    { name: 'Dry Shampoo Spray 150ml', category: 'Grooming', price: 55000, stock: 50 },
    { name: 'Sisir Sisir Jumbo', category: 'Grooming', price: 28000, stock: 35 },
    { name: 'Gunting Kuku Pet', category: 'Grooming', price: 45000, stock: 30 },
    { name: 'Tisu Basah Pet 80s', category: 'Grooming', price: 28000, stock: 70 },
    { name: 'Parfum Pet 100ml', category: 'Grooming', price: 75000, stock: 25 },
    { name: 'Conditioner Kucing 150ml', category: 'Grooming', price: 58000, stock: 35 }
  ];

  const sheet = getSheet(SHEET_PRODUCTS);
  if (!sheet) {
    return { success: false, message: 'Products sheet not found' };
  }

  // Add each product
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const id = generateId('PRD');
    const createdAt = new Date();
    sheet.appendRow([id, p.name, p.category, p.price, p.stock, createdAt]);
  }

  return { success: true, message: 'Added ' + products.length + ' dummy products' };
}
