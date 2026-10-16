// ============================================
// ZIBANO POS — Type Definitions
// ============================================

export type UserRole = 'owner' | 'cashier';

export type OrderType = 'dine-in' | 'take-away';

export type PaymentMethod = 'cash' | 'telebirr' | 'cbe' | 'bank-transfer' | 'other';

export type SaleStatus = 'completed' | 'voided';

export type VoidReason =
  | 'wrong-order'
  | 'wrong-quantity'
  | 'customer-cancelled'
  | 'duplicate-sale'
  | 'other';

// ---- Users ----

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
}

// ---- Products ----

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  image: string;
  description: string;
  available: boolean;
  popular: boolean;
}

// ---- Categories ----

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  active: boolean;
  sortOrder: number;
}

// ---- Waiters ----

export interface Waiter {
  id: string;
  name: string;
  phone?: string;
  active: boolean;
  avatar?: string;
}

// ---- Tables ----

export interface CafeTable {
  id: string;
  number: number;
  active: boolean;
}

// ---- Cart ----

export interface CartItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  image?: string;
}

// ---- Sales ----

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  orderNumber: string;
  waiterId: string;
  waiterName: string;
  cashierId: string;
  cashierName: string;
  orderType: OrderType;
  tableId?: string;
  tableNumber?: number;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  amountReceived?: number;
  changeGiven?: number;
  items: SaleItem[];
  total: number;
  createdAt: string; // ISO string
  status: SaleStatus;
  voidedBy?: string;
  voidedAt?: string;
  voidReason?: VoidReason;
  voidReasonText?: string;
}

// ---- Dashboard ----

export interface KPIData {
  totalSales: number;
  totalOrders: number;
  averageOrder: number;
  itemsSold: number;
  salesChange: number;
  ordersChange: number;
  averageChange: number;
  itemsChange: number;
}

export interface CategorySalesData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface PaymentBreakdown {
  method: PaymentMethod;
  label: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface WaiterPerformance {
  waiterId: string;
  waiterName: string;
  orders: number;
  revenue: number;
}

export interface SalesChartPoint {
  label: string;
  sales: number;
  orders: number;
}

// ---- Filters ----

export type DateRange = 'today' | 'yesterday' | 'week' | 'month' | 'custom';

export interface SalesFilter {
  dateRange: DateRange;
  paymentMethod?: PaymentMethod | 'all';
  waiterId?: string | 'all';
  status?: SaleStatus | 'all';
  search?: string;
}
