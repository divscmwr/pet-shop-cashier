/**
 * Pet Shop Cashier MVP - Google Apps Script Backend
 * Script ID: 1J7jbAozM7KMyiZ4Pw2b3qxt5Wr4jBW10Wpxn6L0Skm1QDH_WBPf90gjx
 * Sheet ID: 1j9eajchKx0l4B5mHiwLT5dvytqFJuWTQRqog-xp0Hp4
 */

// Konfigurasi
const SPREADSHEET_ID = '1j9eajchKx0l4B5mHiwLT5dvytqFJuWTQRqog-xp0Hp4';
const SHEET_PRODUCTS = 'Products';
const SHEET_TRANSACTIONS = 'Transactions';

/**
 * Fungsi untuk mendapatkan instance spreadsheet
 */
function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

/**
 * Fungsi untuk mendapatkan sheet
 */
function getSheet(sheetName) {
  return getSpreadsheet().getSheetByName(sheetName);
}

/**
 * Inisialisasi spreadsheet dengan header jika belum ada
 */
function initializeSheets() {
  const ss = getSpreadsheet();

  // Buat sheet Products jika belum ada
  let productsSheet = ss.getSheetByName(SHEET_PRODUCTS);
  if (!productsSheet) {
    productsSheet = ss.insertSheet(SHEET_PRODUCTS);
    productsSheet.getRange(1, 1, 1, 6).setValues([['ID', 'Name', 'Category', 'Price', 'Stock', 'CreatedAt']]);
    productsSheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    productsSheet.setColumnWidths(1, 6, 120);
  }

  // Buat sheet Transactions jika belum ada
  let transactionsSheet = ss.getSheetByName(SHEET_TRANSACTIONS);
  if (!transactionsSheet) {
    transactionsSheet = ss.insertSheet(SHEET_TRANSACTIONS);
    transactionsSheet.getRange(1, 1, 1, 8).setValues([['ID', 'Date', 'Items', 'Subtotal', 'Discount', 'Total', 'PaymentMethod', 'CreatedAt']]);
    transactionsSheet.getRange(1, 1, 1, 8).setFontWeight('bold');
    transactionsSheet.setColumnWidths(1, 8, 120);
  }

  return 'Sheets initialized successfully';
}

/**
 * Generate ID unik
 */
function generateId(prefix) {
  const timestamp = new Date().getTime().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix + '_' + timestamp + random;
}

/**
 * Parse JSON dengan aman
 */
function safeParseJSON(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}

// ============== PRODUCT FUNCTIONS ==============

/**
 * Ambil semua produk
 */
function getProducts() {
  const sheet = getSheet(SHEET_PRODUCTS);
  if (!sheet) {
    return { success: false, message: 'Products sheet not found' };
  }

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return { success: true, data: [] };
  }

  const headers = data[0];
  const products = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) { // Jika ID ada
      products.push({
        id: data[i][0],
        name: data[i][1],
        category: data[i][2],
        price: parseFloat(data[i][3]) || 0,
        stock: parseInt(data[i][4]) || 0,
        createdAt: data[i][5]
      });
    }
  }

  return { success: true, data: products };
}

/**
 * Tambah produk baru
 */
function addProduct(name, category, price, stock) {
  const sheet = getSheet(SHEET_PRODUCTS);
  if (!sheet) {
    return { success: false, message: 'Products sheet not found' };
  }

  const id = generateId('PRD');
  const createdAt = new Date();

  sheet.appendRow([id, name, category, parseFloat(price), parseInt(stock), createdAt]);

  return {
    success: true,
    message: 'Product added successfully',
    data: { id, name, category, price: parseFloat(price), stock: parseInt(stock), createdAt }
  };
}

/**
 * Update produk
 */
function updateProduct(id, name, category, price, stock) {
  const sheet = getSheet(SHEET_PRODUCTS);
  if (!sheet) {
    return { success: false, message: 'Products sheet not found' };
  }

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.getRange(i + 1, 2, 1, 4).setValues([[name, category, parseFloat(price), parseInt(stock)]]);
      return { success: true, message: 'Product updated successfully' };
    }
  }

  return { success: false, message: 'Product not found' };
}

/**
 * Hapus produk
 */
function deleteProduct(id) {
  const sheet = getSheet(SHEET_PRODUCTS);
  if (!sheet) {
    return { success: false, message: 'Products sheet not found' };
  }

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Product deleted successfully' };
    }
  }

  return { success: false, message: 'Product not found' };
}

// ============== TRANSACTION FUNCTIONS ==============

/**
 * Ambil semua transaksi
 */
function getTransactions() {
  const sheet = getSheet(SHEET_TRANSACTIONS);
  if (!sheet) {
    return { success: false, message: 'Transactions sheet not found' };
  }

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return { success: true, data: [] };
  }

  const transactions = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      const items = safeParseJSON(data[i][2]) || [];
      transactions.push({
        id: data[i][0],
        date: data[i][1],
        items: items,
        subtotal: parseFloat(data[i][3]) || 0,
        discount: parseFloat(data[i][4]) || 0,
        total: parseFloat(data[i][5]) || 0,
        paymentMethod: data[i][6],
        createdAt: data[i][7]
      });
    }
  }

  return { success: true, data: transactions.reverse() };
}

/**
 * Buat transaksi baru
 */
function createTransaction(itemsJson, subtotal, discount, total, paymentMethod) {
  const sheet = getSheet(SHEET_TRANSACTIONS);
  if (!sheet) {
    return { success: false, message: 'Transactions sheet not found' };
  }

  const id = generateId('TRX');
  const date = new Date();
  const items = safeParseJSON(itemsJson) || [];

  // Kurangi stok produk
  const productsSheet = getSheet(SHEET_PRODUCTS);
  if (productsSheet) {
    const productData = productsSheet.getDataRange().getValues();

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      for (let j = 1; j < productData.length; j++) {
        if (productData[j][0] === item.id) {
          const newStock = Math.max(0, parseInt(productData[j][4]) - item.quantity);
          productsSheet.getRange(j + 1, 5).setValue(newStock);
          break;
        }
      }
    }
  }

  sheet.appendRow([id, date, itemsJson, parseFloat(subtotal), parseFloat(discount), parseFloat(total), paymentMethod, date]);

  return {
    success: true,
    message: 'Transaction created successfully',
    data: { id, date, items, subtotal: parseFloat(subtotal), discount: parseFloat(discount), total: parseFloat(total), paymentMethod }
  };
}

/**
 * Ambil data dashboard
 */
function getDashboard() {
  const transactionsSheet = getSheet(SHEET_TRANSACTIONS);
  const productsSheet = getSheet(SHEET_PRODUCTS);

  let todaySales = 0;
  let todayCount = 0;
  let totalRevenue = 0;
  let productCount = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Hitung transaksi
  if (transactionsSheet) {
    const data = transactionsSheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      const transactionDate = new Date(data[i][1]);
      transactionDate.setHours(0, 0, 0, 0);

      const total = parseFloat(data[i][5]) || 0;
      totalRevenue += total;

      if (transactionDate.getTime() === today.getTime()) {
        todaySales += total;
        todayCount++;
      }
    }
  }

  // Hitung produk
  if (productsSheet) {
    const productData = productsSheet.getDataRange().getValues();
    productCount = Math.max(0, productData.length - 1);
  }

  return {
    success: true,
    data: {
      todaySales: todaySales,
      todayCount: todayCount,
      totalRevenue: totalRevenue,
      productCount: productCount
    }
  };
}

// ============== WEB APP HANDLER ==============

/**
 * Handler utama untuk GET requests
 * Juga menangani POST-like actions via query parameters
 */
function doGet(e) {
  const action = e.parameter.action;
  let result;

  // Handle all actions including POST-like ones via GET parameters
  switch (action) {
    case 'getProducts':
      result = getProducts();
      break;
    case 'getTransactions':
      result = getTransactions();
      break;
    case 'getDashboard':
      result = getDashboard();
      break;
    case 'initialize':
      result = initializeSheets();
      break;
    // POST-like actions via GET parameters
    case 'addProduct':
      result = addProduct(
        e.parameter.name,
        e.parameter.category,
        e.parameter.price,
        e.parameter.stock
      );
      break;
    case 'updateProduct':
      result = updateProduct(
        e.parameter.id,
        e.parameter.name,
        e.parameter.category,
        e.parameter.price,
        e.parameter.stock
      );
      break;
    case 'deleteProduct':
      result = deleteProduct(e.parameter.id);
      break;
    case 'createTransaction':
      result = createTransaction(
        e.parameter.items,
        e.parameter.subtotal,
        e.parameter.discount,
        e.parameter.total,
        e.parameter.paymentMethod
      );
      break;
    default:
      result = { success: false, message: 'Invalid action' };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handler utama untuk POST requests
 */
function doPost(e) {
  let postData;

  try {
    postData = JSON.parse(e.postData.contents);
  } catch (err) {
    // Fallback untuk form data
    postData = e.parameter;
  }

  const action = postData.action;
  let result;

  switch (action) {
    case 'addProduct':
      result = addProduct(postData.name, postData.category, postData.price, postData.stock);
      break;
    case 'updateProduct':
      result = updateProduct(postData.id, postData.name, postData.category, postData.price, postData.stock);
      break;
    case 'deleteProduct':
      result = deleteProduct(postData.id);
      break;
    case 'createTransaction':
      result = createTransaction(postData.items, postData.subtotal, postData.discount, postData.total, postData.paymentMethod);
      break;
    default:
      result = { success: false, message: 'Invalid action' };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
