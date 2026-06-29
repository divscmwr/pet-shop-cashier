# Pet Shop Cashier MVP - Specification

## 1. Project Overview
- **Project Name**: Pet Shop Cashier (Kasir Petshop)
- **Project Type**: Web Application (Google Apps Script)
- **Core Functionality**: Point-of-Sale (POS) system for pet shop with product management, transaction processing, and receipt generation
- **Target Users**: Pet shop cashiers and owners

## 2. Technology Stack
- **Backend**: Google Apps Script ( GAS )
- **Database**: Google Sheets (Spreadsheet)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Font**: Google Fonts (Plus Jakarta Sans)
- **Icons**: Lucide Icons

## 3. Features

### 3.1 Product Management
- Add new products (name, category, price, stock)
- Edit existing products
- Delete products
- Categories: Makanan, Aksesoris, Obat-Obatan, Grooming

### 3.2 Transaction (Penjualan)
- Select products and quantities
- Real-time total calculation
- Apply discounts (percentage or fixed)
- Payment method selection (Cash, QRIS, Debit)
- Auto-generate transaction ID

### 3.3 Receipt
- Generate printable receipt
- Display: transaction ID, date, items, totals, payment method

### 3.4 Dashboard
- Today's sales summary
- Transaction count
- Total revenue

## 4. UI/UX Design Direction

### Visual Style
- Modern, clean, and professional
- Card-based layout
- Soft shadows and rounded corners
- Pet-friendly color scheme (warm tones)

### Color Scheme
- Primary: #6366F1 (Indigo)
- Secondary: #F59E0B (Amber)
- Background: #F8FAFC (Light gray)
- Text: #1E293B (Dark slate)
- Success: #10B981 (Emerald)
- Danger: #EF4444 (Red)

### Layout
- Sidebar navigation (Dashboard, Products, Transaction, History)
- Main content area with responsive grid
- Modal dialogs for forms
- Toast notifications for feedback

## 5. Data Structure

### Products Sheet
| Column | Type | Description |
|--------|------|-------------|
| ID | String | Product ID (auto) |
| Name | String | Product name |
| Category | String | Category |
| Price | Number | Unit price |
| Stock | Number | Available stock |
| CreatedAt | DateTime | Creation timestamp |

### Transactions Sheet
| Column | Type | Description |
|--------|------|-------------|
| ID | String | Transaction ID |
| Date | DateTime | Transaction date |
| Items | String | JSON of items |
| Subtotal | Number | Before discount |
| Discount | Number | Discount amount |
| Total | Number | Final total |
| PaymentMethod | String | Payment method |
| CreatedAt | DateTime | Creation timestamp |

## 6. API Endpoints (GAS)

- `GET /exec?action=getProducts` - Fetch all products
- `POST /exec` with `action=addProduct` - Add product
- `POST /exec` with `action=updateProduct` - Update product
- `POST /exec` with `action=deleteProduct` - Delete product
- `GET /exec?action=getTransactions` - Fetch transactions
- `POST /exec` with `action=createTransaction` - Create transaction
- `GET /exec?action=getDashboard` - Get dashboard data
