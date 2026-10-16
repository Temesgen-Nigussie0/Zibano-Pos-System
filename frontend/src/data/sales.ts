import { Sale } from '../types';

// Helper to generate dates relative to today
function daysAgo(days: number, hour: number, minute: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const initialSales: Sale[] = [
  // ============ TODAY ============
  {
    id: 's1', orderNumber: '#0184', waiterId: 'w1', waiterName: 'Hana',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't3', tableNumber: 3,
    paymentMethod: 'cash', amountReceived: 6500, changeGiven: 260,
    items: [
      { productId: 'p19', productName: 'Chicken Wrap', quantity: 6, unitPrice: 950, subtotal: 5700 },
      { productId: 'p50', productName: 'Macchiato', quantity: 2, unitPrice: 130, subtotal: 260 },
      { productId: 'p32', productName: 'French Fries', quantity: 1, unitPrice: 280, subtotal: 280 },
    ],
    total: 6240, createdAt: daysAgo(0, 8, 15), status: 'completed',
  },
  {
    id: 's2', orderNumber: '#0185', waiterId: 'w2', waiterName: 'Meron',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'telebirr', paymentReference: 'TXN-839201',
    items: [
      { productId: 'p33', productName: 'Iced Latte', quantity: 2, unitPrice: 160, subtotal: 320 },
      { productId: 'p45', productName: 'Special Juice', quantity: 1, unitPrice: 400, subtotal: 400 },
    ],
    total: 720, createdAt: daysAgo(0, 8, 42), status: 'completed',
  },
  {
    id: 's3', orderNumber: '#0186', waiterId: 'w3', waiterName: 'Abel',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't1', tableNumber: 1,
    paymentMethod: 'cash', amountReceived: 1500, changeGiven: 50,
    items: [
      { productId: 'p1', productName: 'Fasting Ful', quantity: 2, unitPrice: 400, subtotal: 800 },
      { productId: 'p50', productName: 'Macchiato', quantity: 3, unitPrice: 130, subtotal: 390 },
      { productId: 'p66', productName: 'Tea', quantity: 1, unitPrice: 60, subtotal: 60 },
    ],
    total: 1250, createdAt: daysAgo(0, 9, 5), status: 'completed',
  },
  {
    id: 's4', orderNumber: '#0187', waiterId: 'w4', waiterName: 'Sara',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't5', tableNumber: 5,
    paymentMethod: 'cbe', paymentReference: 'REF-4421',
    items: [
      { productId: 'p18', productName: 'Beef Wrap', quantity: 2, unitPrice: 700, subtotal: 1400 },
      { productId: 'p34', productName: 'Mocha Latte', quantity: 2, unitPrice: 180, subtotal: 360 },
      { productId: 'p30', productName: 'Beef Sambusa', quantity: 3, unitPrice: 250, subtotal: 750 },
    ],
    total: 2510, createdAt: daysAgo(0, 9, 30), status: 'completed',
  },
  {
    id: 's5', orderNumber: '#0188', waiterId: 'w1', waiterName: 'Hana',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'cash', amountReceived: 6000, changeGiven: 300,
    items: [
      { productId: 'p19', productName: 'Chicken Wrap', quantity: 6, unitPrice: 950, subtotal: 5700 },
    ],
    total: 5700, createdAt: daysAgo(0, 10, 12), status: 'completed',
  },
  {
    id: 's6', orderNumber: '#0189', waiterId: 'w5', waiterName: 'Dawit',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't2', tableNumber: 2,
    paymentMethod: 'telebirr', paymentReference: 'TXN-839205',
    items: [
      { productId: 'p23', productName: 'Tibs', quantity: 1, unitPrice: 700, subtotal: 700 },
      { productId: 'p50', productName: 'Macchiato', quantity: 1, unitPrice: 130, subtotal: 130 },
      { productId: 'p37', productName: 'Soft Drink', quantity: 2, unitPrice: 70, subtotal: 140 },
    ],
    total: 970, createdAt: daysAgo(0, 10, 45), status: 'completed',
  },
  {
    id: 's7', orderNumber: '#0190', waiterId: 'w2', waiterName: 'Meron',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't4', tableNumber: 4,
    paymentMethod: 'cash', amountReceived: 2000, changeGiven: 520,
    items: [
      { productId: 'p26', productName: 'Pasta with Tomato', quantity: 1, unitPrice: 580, subtotal: 580 },
      { productId: 'p55', productName: 'Cafe Latte', quantity: 1, unitPrice: 180, subtotal: 180 },
      { productId: 'p42', productName: 'Avocado', quantity: 2, unitPrice: 300, subtotal: 600 },
      { productId: 'p39', productName: 'Water', quantity: 2, unitPrice: 60, subtotal: 120 },
    ],
    total: 1480, createdAt: daysAgo(0, 11, 20), status: 'completed',
  },
  {
    id: 's8', orderNumber: '#0191', waiterId: 'w3', waiterName: 'Abel',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'telebirr', paymentReference: 'TXN-839210',
    items: [
      { productId: 'p50', productName: 'Macchiato', quantity: 4, unitPrice: 130, subtotal: 520 },
      { productId: 'p48', productName: 'Croissant', quantity: 4, unitPrice: 280, subtotal: 1120 },
    ],
    total: 1640, createdAt: daysAgo(0, 11, 55), status: 'completed',
  },
  {
    id: 's9', orderNumber: '#0192', waiterId: 'w1', waiterName: 'Hana',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't6', tableNumber: 6,
    paymentMethod: 'cash', amountReceived: 500, changeGiven: 70,
    items: [
      { productId: 'p31', productName: 'Lentil Sambusa', quantity: 2, unitPrice: 180, subtotal: 360 },
      { productId: 'p66', productName: 'Tea', quantity: 1, unitPrice: 60, subtotal: 60 },
      { productId: 'p49', productName: 'Mini Cakes', quantity: 1, unitPrice: 90, subtotal: 90 },
    ],
    total: 510, createdAt: daysAgo(0, 12, 10), status: 'voided',
    voidedBy: 'u1', voidedAt: daysAgo(0, 12, 25), voidReason: 'wrong-order',
  },
  {
    id: 's10', orderNumber: '#0193', waiterId: 'w4', waiterName: 'Sara',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't7', tableNumber: 7,
    paymentMethod: 'cash', amountReceived: 7500, changeGiven: 160,
    items: [
      { productId: 'p19', productName: 'Chicken Wrap', quantity: 6, unitPrice: 950, subtotal: 5700 },
      { productId: 'p14', productName: 'Special Wrap', quantity: 1, unitPrice: 850, subtotal: 850 },
      { productId: 'p33', productName: 'Iced Latte', quantity: 2, unitPrice: 160, subtotal: 320 },
      { productId: 'p43', productName: 'Mango', quantity: 1, unitPrice: 350, subtotal: 350 },
      { productId: 'p39', productName: 'Water', quantity: 2, unitPrice: 60, subtotal: 120 },
    ],
    total: 7340, createdAt: daysAgo(0, 12, 40), status: 'completed',
  },
  {
    id: 's11', orderNumber: '#0194', waiterId: 'w5', waiterName: 'Dawit',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'telebirr', paymentReference: 'TXN-839215',
    items: [
      { productId: 'p9', productName: 'Fetira with Eggs', quantity: 1, unitPrice: 450, subtotal: 450 },
      { productId: 'p50', productName: 'Macchiato', quantity: 1, unitPrice: 130, subtotal: 130 },
    ],
    total: 580, createdAt: daysAgo(0, 13, 5), status: 'completed',
  },
  {
    id: 's12', orderNumber: '#0195', waiterId: 'w1', waiterName: 'Hana',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't8', tableNumber: 8,
    paymentMethod: 'cbe', paymentReference: 'REF-4430',
    items: [
      { productId: 'p28', productName: 'Pasta with Meat', quantity: 2, unitPrice: 720, subtotal: 1440 },
      { productId: 'p58', productName: 'Cappuccino', quantity: 2, unitPrice: 180, subtotal: 360 },
      { productId: 'p32', productName: 'French Fries', quantity: 1, unitPrice: 280, subtotal: 280 },
    ],
    total: 2080, createdAt: daysAgo(0, 13, 35), status: 'completed',
  },
  {
    id: 's13', orderNumber: '#0196', waiterId: 'w2', waiterName: 'Meron',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't1', tableNumber: 1,
    paymentMethod: 'cash', amountReceived: 1000, changeGiven: 370,
    items: [
      { productId: 'p7', productName: 'Eggs with Tomato Sauce', quantity: 1, unitPrice: 350, subtotal: 350 },
      { productId: 'p67', productName: 'Mint Tea', quantity: 1, unitPrice: 80, subtotal: 80 },
      { productId: 'p39', productName: 'Water', quantity: 3, unitPrice: 60, subtotal: 180 },
    ],
    total: 610, createdAt: daysAgo(0, 14, 10), status: 'completed',
  },
  {
    id: 's14', orderNumber: '#0197', waiterId: 'w3', waiterName: 'Abel',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'other',
    items: [
      { productId: 'p12', productName: 'Croissant Sandwich', quantity: 1, unitPrice: 650, subtotal: 650 },
      { productId: 'p56', productName: 'Caramel Latte', quantity: 1, unitPrice: 220, subtotal: 220 },
    ],
    total: 870, createdAt: daysAgo(0, 14, 37), status: 'completed',
  },

  // ============ YESTERDAY ============
  {
    id: 's15', orderNumber: '#0175', waiterId: 'w1', waiterName: 'Hana',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't2', tableNumber: 2,
    paymentMethod: 'cash', amountReceived: 2000, changeGiven: 100,
    items: [
      { productId: 'p19', productName: 'Chicken Wrap', quantity: 2, unitPrice: 950, subtotal: 1900 },
    ],
    total: 1900, createdAt: daysAgo(1, 8, 30), status: 'completed',
  },
  {
    id: 's16', orderNumber: '#0176', waiterId: 'w2', waiterName: 'Meron',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'telebirr', paymentReference: 'TXN-838100',
    items: [
      { productId: 'p1', productName: 'Fasting Ful', quantity: 1, unitPrice: 400, subtotal: 400 },
      { productId: 'p50', productName: 'Macchiato', quantity: 2, unitPrice: 130, subtotal: 260 },
    ],
    total: 660, createdAt: daysAgo(1, 9, 15), status: 'completed',
  },
  {
    id: 's17', orderNumber: '#0177', waiterId: 'w4', waiterName: 'Sara',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't5', tableNumber: 5,
    paymentMethod: 'cash', amountReceived: 1500, changeGiven: 280,
    items: [
      { productId: 'p24', productName: 'Tibs Firfir', quantity: 1, unitPrice: 650, subtotal: 650 },
      { productId: 'p33', productName: 'Iced Latte', quantity: 1, unitPrice: 160, subtotal: 160 },
      { productId: 'p30', productName: 'Beef Sambusa', quantity: 1, unitPrice: 250, subtotal: 250 },
      { productId: 'p39', productName: 'Water', quantity: 2, unitPrice: 60, subtotal: 120 },
    ],
    total: 1180, createdAt: daysAgo(1, 10, 0), status: 'completed',
  },
  {
    id: 's18', orderNumber: '#0178', waiterId: 'w3', waiterName: 'Abel',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't3', tableNumber: 3,
    paymentMethod: 'cbe', paymentReference: 'REF-4415',
    items: [
      { productId: 'p22', productName: 'Club Sandwich', quantity: 2, unitPrice: 650, subtotal: 1300 },
      { productId: 'p60', productName: 'Cafe Mocha', quantity: 2, unitPrice: 230, subtotal: 460 },
      { productId: 'p45', productName: 'Special Juice', quantity: 1, unitPrice: 400, subtotal: 400 },
    ],
    total: 2160, createdAt: daysAgo(1, 11, 20), status: 'completed',
  },
  {
    id: 's19', orderNumber: '#0179', waiterId: 'w5', waiterName: 'Dawit',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'cash', amountReceived: 500, changeGiven: 220,
    items: [
      { productId: 'p32', productName: 'French Fries', quantity: 1, unitPrice: 280, subtotal: 280 },
    ],
    total: 280, createdAt: daysAgo(1, 12, 5), status: 'completed',
  },
  {
    id: 's20', orderNumber: '#0180', waiterId: 'w1', waiterName: 'Hana',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't4', tableNumber: 4,
    paymentMethod: 'telebirr', paymentReference: 'TXN-838115',
    items: [
      { productId: 'p27', productName: 'Pasta with Vegetable', quantity: 1, unitPrice: 680, subtotal: 680 },
      { productId: 'p55', productName: 'Cafe Latte', quantity: 1, unitPrice: 180, subtotal: 180 },
    ],
    total: 860, createdAt: daysAgo(1, 12, 40), status: 'completed',
  },
  {
    id: 's21', orderNumber: '#0181', waiterId: 'w2', waiterName: 'Meron',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't6', tableNumber: 6,
    paymentMethod: 'cash', amountReceived: 2000, changeGiven: 510,
    items: [
      { productId: 'p18', productName: 'Beef Wrap', quantity: 1, unitPrice: 700, subtotal: 700 },
      { productId: 'p50', productName: 'Macchiato', quantity: 1, unitPrice: 130, subtotal: 130 },
      { productId: 'p41', productName: 'Papaya', quantity: 1, unitPrice: 250, subtotal: 250 },
      { productId: 'p49', productName: 'Mini Cakes', quantity: 4, unitPrice: 90, subtotal: 360 },
    ],
    total: 1440, createdAt: daysAgo(1, 13, 15), status: 'completed',
  },
  {
    id: 's22', orderNumber: '#0182', waiterId: 'w4', waiterName: 'Sara',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'telebirr', paymentReference: 'TXN-838120',
    items: [
      { productId: 'p13', productName: 'Pancake', quantity: 2, unitPrice: 400, subtotal: 800 },
      { productId: 'p59', productName: 'Hot Chocolate', quantity: 2, unitPrice: 200, subtotal: 400 },
    ],
    total: 1200, createdAt: daysAgo(1, 14, 30), status: 'completed',
  },
  {
    id: 's23', orderNumber: '#0183', waiterId: 'w3', waiterName: 'Abel',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't7', tableNumber: 7,
    paymentMethod: 'cash', amountReceived: 500, changeGiven: 240,
    items: [
      { productId: 'p50', productName: 'Macchiato', quantity: 2, unitPrice: 130, subtotal: 260 },
    ],
    total: 260, createdAt: daysAgo(1, 15, 10), status: 'voided',
    voidedBy: 'u1', voidedAt: daysAgo(1, 15, 20), voidReason: 'duplicate-sale',
  },

  // ============ 2 DAYS AGO ============
  {
    id: 's24', orderNumber: '#0170', waiterId: 'w1', waiterName: 'Hana',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't1', tableNumber: 1,
    paymentMethod: 'cash', amountReceived: 2000, changeGiven: 530,
    items: [
      { productId: 'p2', productName: 'Special Ful', quantity: 1, unitPrice: 550, subtotal: 550 },
      { productId: 'p4', productName: 'Chechebesa Eggs & Yoghurt', quantity: 1, unitPrice: 450, subtotal: 450 },
      { productId: 'p50', productName: 'Macchiato', quantity: 2, unitPrice: 130, subtotal: 260 },
      { productId: 'p39', productName: 'Water', quantity: 3, unitPrice: 60, subtotal: 180 },
    ],
    total: 1440, createdAt: daysAgo(2, 8, 45), status: 'completed',
  },
  {
    id: 's25', orderNumber: '#0171', waiterId: 'w2', waiterName: 'Meron',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'telebirr', paymentReference: 'TXN-837050',
    items: [
      { productId: 'p19', productName: 'Chicken Wrap', quantity: 1, unitPrice: 950, subtotal: 950 },
      { productId: 'p33', productName: 'Iced Latte', quantity: 1, unitPrice: 160, subtotal: 160 },
    ],
    total: 1110, createdAt: daysAgo(2, 9, 30), status: 'completed',
  },
  {
    id: 's26', orderNumber: '#0172', waiterId: 'w5', waiterName: 'Dawit',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't8', tableNumber: 8,
    paymentMethod: 'cash', amountReceived: 1000, changeGiven: 350,
    items: [
      { productId: 'p25', productName: 'Fasting Firfir', quantity: 1, unitPrice: 480, subtotal: 480 },
      { productId: 'p73', productName: 'Qeshir', quantity: 1, unitPrice: 80, subtotal: 80 },
      { productId: 'p49', productName: 'Mini Cakes', quantity: 1, unitPrice: 90, subtotal: 90 },
    ],
    total: 650, createdAt: daysAgo(2, 10, 15), status: 'completed',
  },
  {
    id: 's27', orderNumber: '#0173', waiterId: 'w4', waiterName: 'Sara',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't3', tableNumber: 3,
    paymentMethod: 'cbe', paymentReference: 'REF-4405',
    items: [
      { productId: 'p16', productName: 'Tuna Wrap', quantity: 1, unitPrice: 750, subtotal: 750 },
      { productId: 'p29', productName: 'Pasta with Tuna', quantity: 1, unitPrice: 780, subtotal: 780 },
      { productId: 'p33', productName: 'Iced Latte', quantity: 2, unitPrice: 160, subtotal: 320 },
    ],
    total: 1850, createdAt: daysAgo(2, 12, 0), status: 'completed',
  },
  {
    id: 's28', orderNumber: '#0174', waiterId: 'w3', waiterName: 'Abel',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'cash', amountReceived: 500, changeGiven: 10,
    items: [
      { productId: 'p6', productName: 'Beef & Eggs', quantity: 1, unitPrice: 400, subtotal: 400 },
      { productId: 'p49', productName: 'Mini Cakes', quantity: 1, unitPrice: 90, subtotal: 90 },
    ],
    total: 490, createdAt: daysAgo(2, 13, 20), status: 'completed',
  },

  // ============ 3 DAYS AGO ============
  {
    id: 's29', orderNumber: '#0165', waiterId: 'w1', waiterName: 'Hana',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't2', tableNumber: 2,
    paymentMethod: 'cash', amountReceived: 3000, changeGiven: 380,
    items: [
      { productId: 'p14', productName: 'Special Wrap', quantity: 1, unitPrice: 850, subtotal: 850 },
      { productId: 'p19', productName: 'Chicken Wrap', quantity: 1, unitPrice: 950, subtotal: 950 },
      { productId: 'p45', productName: 'Special Juice', quantity: 1, unitPrice: 400, subtotal: 400 },
      { productId: 'p50', productName: 'Macchiato', quantity: 3, unitPrice: 130, subtotal: 390 },
      { productId: 'p49', productName: 'Mini Cakes', quantity: 3, unitPrice: 90, subtotal: 270 },
    ],
    total: 2860, createdAt: daysAgo(3, 9, 0), status: 'completed',
  },
  {
    id: 's30', orderNumber: '#0166', waiterId: 'w2', waiterName: 'Meron',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'telebirr', paymentReference: 'TXN-836020',
    items: [
      { productId: 'p50', productName: 'Macchiato', quantity: 2, unitPrice: 130, subtotal: 260 },
      { productId: 'p48', productName: 'Croissant', quantity: 2, unitPrice: 280, subtotal: 560 },
    ],
    total: 820, createdAt: daysAgo(3, 10, 30), status: 'completed',
  },
  {
    id: 's31', orderNumber: '#0167', waiterId: 'w5', waiterName: 'Dawit',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't4', tableNumber: 4,
    paymentMethod: 'cash', amountReceived: 1000, changeGiven: 120,
    items: [
      { productId: 'p10', productName: 'Fetira with Honey', quantity: 1, unitPrice: 350, subtotal: 350 },
      { productId: 'p70', productName: 'Honey Ginger Tea', quantity: 1, unitPrice: 140, subtotal: 140 },
      { productId: 'p44', productName: 'Watermelon', quantity: 1, unitPrice: 300, subtotal: 300 },
      { productId: 'p39', productName: 'Water', quantity: 1, unitPrice: 60, subtotal: 60 },
    ],
    total: 850, createdAt: daysAgo(3, 11, 45), status: 'completed',
  },
  {
    id: 's32', orderNumber: '#0168', waiterId: 'w3', waiterName: 'Abel',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't6', tableNumber: 6,
    paymentMethod: 'cbe', paymentReference: 'REF-4398',
    items: [
      { productId: 'p23', productName: 'Tibs', quantity: 2, unitPrice: 700, subtotal: 1400 },
      { productId: 'p50', productName: 'Macchiato', quantity: 2, unitPrice: 130, subtotal: 260 },
      { productId: 'p32', productName: 'French Fries', quantity: 1, unitPrice: 280, subtotal: 280 },
    ],
    total: 1940, createdAt: daysAgo(3, 13, 10), status: 'completed',
  },

  // ============ 4-6 DAYS AGO ============
  {
    id: 's33', orderNumber: '#0160', waiterId: 'w4', waiterName: 'Sara',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't5', tableNumber: 5,
    paymentMethod: 'cash', amountReceived: 2000, changeGiven: 470,
    items: [
      { productId: 'p3', productName: 'Chechebesa w/ Honey', quantity: 2, unitPrice: 380, subtotal: 760 },
      { productId: 'p50', productName: 'Macchiato', quantity: 2, unitPrice: 130, subtotal: 260 },
      { productId: 'p46', productName: 'Milk Shack', quantity: 1, unitPrice: 450, subtotal: 450 },
    ],
    total: 1470, createdAt: daysAgo(4, 9, 20), status: 'completed',
  },
  {
    id: 's34', orderNumber: '#0161', waiterId: 'w1', waiterName: 'Hana',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'telebirr', paymentReference: 'TXN-835010',
    items: [
      { productId: 'p18', productName: 'Beef Wrap', quantity: 1, unitPrice: 700, subtotal: 700 },
      { productId: 'p33', productName: 'Iced Latte', quantity: 2, unitPrice: 160, subtotal: 320 },
    ],
    total: 1020, createdAt: daysAgo(4, 11, 0), status: 'completed',
  },
  {
    id: 's35', orderNumber: '#0155', waiterId: 'w2', waiterName: 'Meron',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't1', tableNumber: 1,
    paymentMethod: 'cash', amountReceived: 1500, changeGiven: 220,
    items: [
      { productId: 'p17', productName: 'Veggie Wrap', quantity: 1, unitPrice: 550, subtotal: 550 },
      { productId: 'p20', productName: 'Avocado Wrap', quantity: 1, unitPrice: 600, subtotal: 600 },
      { productId: 'p72', productName: 'Green Tea', quantity: 1, unitPrice: 80, subtotal: 80 },
      { productId: 'p49', productName: 'Mini Cakes', quantity: 1, unitPrice: 90, subtotal: 90 },
    ],
    total: 1320, createdAt: daysAgo(5, 10, 15), status: 'completed',
  },
  {
    id: 's36', orderNumber: '#0156', waiterId: 'w5', waiterName: 'Dawit',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't7', tableNumber: 7,
    paymentMethod: 'cbe', paymentReference: 'REF-4385',
    items: [
      { productId: 'p28', productName: 'Pasta with Meat', quantity: 1, unitPrice: 720, subtotal: 720 },
      { productId: 'p65', productName: 'Americano', quantity: 1, unitPrice: 150, subtotal: 150 },
    ],
    total: 870, createdAt: daysAgo(5, 12, 30), status: 'completed',
  },
  {
    id: 's37', orderNumber: '#0150', waiterId: 'w3', waiterName: 'Abel',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'cash', amountReceived: 1000, changeGiven: 110,
    items: [
      { productId: 'p1', productName: 'Fasting Ful', quantity: 1, unitPrice: 400, subtotal: 400 },
      { productId: 'p11', productName: 'Egg Omelet', quantity: 1, unitPrice: 350, subtotal: 350 },
      { productId: 'p67', productName: 'Mint Tea', quantity: 1, unitPrice: 80, subtotal: 80 },
      { productId: 'p49', productName: 'Mini Cakes', quantity: 1, unitPrice: 90, subtotal: 90 },
    ],
    total: 920, createdAt: daysAgo(6, 9, 45), status: 'completed',
  },
  {
    id: 's38', orderNumber: '#0151', waiterId: 'w1', waiterName: 'Hana',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't8', tableNumber: 8,
    paymentMethod: 'telebirr', paymentReference: 'TXN-833005',
    items: [
      { productId: 'p19', productName: 'Chicken Wrap', quantity: 2, unitPrice: 950, subtotal: 1900 },
      { productId: 'p34', productName: 'Mocha Latte', quantity: 2, unitPrice: 180, subtotal: 360 },
      { productId: 'p43', productName: 'Mango', quantity: 2, unitPrice: 350, subtotal: 700 },
    ],
    total: 2960, createdAt: daysAgo(6, 12, 0), status: 'completed',
  },

  // ============ 7-16 DAYS AGO (Full Month Data) ============
  {
    id: 's39', orderNumber: '#0145', waiterId: 'w2', waiterName: 'Meron',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't2', tableNumber: 2,
    paymentMethod: 'cash', amountReceived: 3500, changeGiven: 140,
    items: [
      { productId: 'p19', productName: 'Chicken Wrap', quantity: 3, unitPrice: 950, subtotal: 2850 },
      { productId: 'p50', productName: 'Macchiato', quantity: 4, unitPrice: 130, subtotal: 520 },
    ],
    total: 3360, createdAt: daysAgo(7, 10, 15), status: 'completed',
  },
  {
    id: 's40', orderNumber: '#0146', waiterId: 'w3', waiterName: 'Abel',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'telebirr', paymentReference: 'TXN-832040',
    items: [
      { productId: 'p24', productName: 'Tibs Firfir', quantity: 2, unitPrice: 650, subtotal: 1300 },
      { productId: 'p45', productName: 'Special Juice', quantity: 2, unitPrice: 400, subtotal: 800 },
    ],
    total: 2100, createdAt: daysAgo(7, 13, 30), status: 'completed',
  },
  {
    id: 's41', orderNumber: '#0140', waiterId: 'w4', waiterName: 'Sara',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't4', tableNumber: 4,
    paymentMethod: 'cash', amountReceived: 4000, changeGiven: 220,
    items: [
      { productId: 'p23', productName: 'Tibs', quantity: 4, unitPrice: 700, subtotal: 2800 },
      { productId: 'p33', productName: 'Iced Latte', quantity: 3, unitPrice: 160, subtotal: 480 },
      { productId: 'p50', productName: 'Macchiato', quantity: 3, unitPrice: 130, subtotal: 390 },
      { productId: 'p39', productName: 'Water', quantity: 2, unitPrice: 60, subtotal: 120 },
    ],
    total: 3780, createdAt: daysAgo(8, 11, 0), status: 'completed',
  },
  {
    id: 's42', orderNumber: '#0141', waiterId: 'w1', waiterName: 'Hana',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'cbe', paymentReference: 'REF-4370',
    items: [
      { productId: 'p18', productName: 'Beef Wrap', quantity: 2, unitPrice: 700, subtotal: 1400 },
      { productId: 'p32', productName: 'French Fries', quantity: 2, unitPrice: 280, subtotal: 560 },
    ],
    total: 1960, createdAt: daysAgo(8, 14, 20), status: 'completed',
  },
  {
    id: 's43', orderNumber: '#0135', waiterId: 'w5', waiterName: 'Dawit',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't6', tableNumber: 6,
    paymentMethod: 'cash', amountReceived: 5000, changeGiven: 350,
    items: [
      { productId: 'p19', productName: 'Chicken Wrap', quantity: 4, unitPrice: 950, subtotal: 3800 },
      { productId: 'p46', productName: 'Milk Shack', quantity: 2, unitPrice: 450, subtotal: 900 },
    ],
    total: 4700, createdAt: daysAgo(9, 12, 10), status: 'completed',
  },
  {
    id: 's44', orderNumber: '#0136', waiterId: 'w2', waiterName: 'Meron',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'telebirr', paymentReference: 'TXN-831100',
    items: [
      { productId: 'p1', productName: 'Fasting Ful', quantity: 3, unitPrice: 400, subtotal: 1200 },
      { productId: 'p66', productName: 'Tea', quantity: 3, unitPrice: 60, subtotal: 180 },
    ],
    total: 1380, createdAt: daysAgo(9, 15, 45), status: 'completed',
  },
  {
    id: 's45', orderNumber: '#0130', waiterId: 'w3', waiterName: 'Abel',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't3', tableNumber: 3,
    paymentMethod: 'cash', amountReceived: 3000, changeGiven: 460,
    items: [
      { productId: 'p2', productName: 'Special Ful', quantity: 2, unitPrice: 550, subtotal: 1100 },
      { productId: 'p4', productName: 'Chechebesa Eggs & Yoghurt', quantity: 2, unitPrice: 450, subtotal: 900 },
      { productId: 'p50', productName: 'Macchiato', quantity: 4, unitPrice: 130, subtotal: 520 },
    ],
    total: 2540, createdAt: daysAgo(10, 9, 30), status: 'completed',
  },
  {
    id: 's46', orderNumber: '#0131', waiterId: 'w4', waiterName: 'Sara',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'cbe', paymentReference: 'REF-4355',
    items: [
      { productId: 'p22', productName: 'Club Sandwich', quantity: 3, unitPrice: 650, subtotal: 1950 },
      { productId: 'p43', productName: 'Mango', quantity: 3, unitPrice: 350, subtotal: 1050 },
    ],
    total: 3000, createdAt: daysAgo(10, 13, 15), status: 'completed',
  },
  {
    id: 's47', orderNumber: '#0125', waiterId: 'w1', waiterName: 'Hana',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't1', tableNumber: 1,
    paymentMethod: 'cash', amountReceived: 4500, changeGiven: 180,
    items: [
      { productId: 'p19', productName: 'Chicken Wrap', quantity: 3, unitPrice: 950, subtotal: 2850 },
      { productId: 'p28', productName: 'Pasta with Meat', quantity: 1, unitPrice: 720, subtotal: 720 },
      { productId: 'p55', productName: 'Cafe Latte', quantity: 4, unitPrice: 180, subtotal: 720 },
    ],
    total: 4320, createdAt: daysAgo(11, 11, 40), status: 'completed',
  },
  {
    id: 's48', orderNumber: '#0126', waiterId: 'w5', waiterName: 'Dawit',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'telebirr', paymentReference: 'TXN-830020',
    items: [
      { productId: 'p14', productName: 'Special Wrap', quantity: 2, unitPrice: 850, subtotal: 1700 },
      { productId: 'p34', productName: 'Mocha Latte', quantity: 2, unitPrice: 180, subtotal: 360 },
    ],
    total: 2060, createdAt: daysAgo(11, 14, 50), status: 'completed',
  },
  {
    id: 's49', orderNumber: '#0120', waiterId: 'w2', waiterName: 'Meron',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't7', tableNumber: 7,
    paymentMethod: 'cash', amountReceived: 3500, changeGiven: 310,
    items: [
      { productId: 'p16', productName: 'Tuna Wrap', quantity: 2, unitPrice: 750, subtotal: 1500 },
      { productId: 'p29', productName: 'Pasta with Tuna', quantity: 1, unitPrice: 780, subtotal: 780 },
      { productId: 'p45', productName: 'Special Juice', quantity: 2, unitPrice: 400, subtotal: 800 },
    ],
    total: 3190, createdAt: daysAgo(12, 12, 15), status: 'completed',
  },
  {
    id: 's50', orderNumber: '#0121', waiterId: 'w3', waiterName: 'Abel',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'cbe', paymentReference: 'REF-4340',
    items: [
      { productId: 'p10', productName: 'Fetira with Honey', quantity: 2, unitPrice: 350, subtotal: 700 },
      { productId: 'p70', productName: 'Honey Ginger Tea', quantity: 2, unitPrice: 140, subtotal: 280 },
    ],
    total: 980, createdAt: daysAgo(12, 16, 0), status: 'completed',
  },
  {
    id: 's51', orderNumber: '#0115', waiterId: 'w4', waiterName: 'Sara',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't5', tableNumber: 5,
    paymentMethod: 'cash', amountReceived: 5000, changeGiven: 260,
    items: [
      { productId: 'p19', productName: 'Chicken Wrap', quantity: 4, unitPrice: 950, subtotal: 3800 },
      { productId: 'p32', productName: 'French Fries', quantity: 2, unitPrice: 280, subtotal: 560 },
      { productId: 'p50', productName: 'Macchiato', quantity: 3, unitPrice: 130, subtotal: 390 },
    ],
    total: 4740, createdAt: daysAgo(13, 10, 45), status: 'completed',
  },
  {
    id: 's52', orderNumber: '#0116', waiterId: 'w1', waiterName: 'Hana',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'telebirr', paymentReference: 'TXN-829090',
    items: [
      { productId: 'p6', productName: 'Beef & Eggs', quantity: 2, unitPrice: 400, subtotal: 800 },
      { productId: 'p49', productName: 'Mini Cakes', quantity: 4, unitPrice: 90, subtotal: 360 },
    ],
    total: 1160, createdAt: daysAgo(13, 14, 10), status: 'completed',
  },
  {
    id: 's53', orderNumber: '#0110', waiterId: 'w5', waiterName: 'Dawit',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't2', tableNumber: 2,
    paymentMethod: 'cash', amountReceived: 4000, changeGiven: 140,
    items: [
      { productId: 'p23', productName: 'Tibs', quantity: 3, unitPrice: 700, subtotal: 2100 },
      { productId: 'p27', productName: 'Pasta with Vegetable', quantity: 2, unitPrice: 680, subtotal: 1360 },
      { productId: 'p39', productName: 'Water', quantity: 4, unitPrice: 60, subtotal: 240 },
    ],
    total: 3860, createdAt: daysAgo(14, 11, 20), status: 'completed',
  },
  {
    id: 's54', orderNumber: '#0111', waiterId: 'w2', waiterName: 'Meron',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'cbe', paymentReference: 'REF-4325',
    items: [
      { productId: 'p18', productName: 'Beef Wrap', quantity: 2, unitPrice: 700, subtotal: 1400 },
      { productId: 'p48', productName: 'Croissant', quantity: 3, unitPrice: 280, subtotal: 840 },
    ],
    total: 2240, createdAt: daysAgo(14, 15, 30), status: 'completed',
  },
  {
    id: 's55', orderNumber: '#0105', waiterId: 'w3', waiterName: 'Abel',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't4', tableNumber: 4,
    paymentMethod: 'cash', amountReceived: 3500, changeGiven: 230,
    items: [
      { productId: 'p3', productName: 'Chechebesa w/ Honey', quantity: 3, unitPrice: 380, subtotal: 1140 },
      { productId: 'p59', productName: 'Hot Chocolate', quantity: 3, unitPrice: 200, subtotal: 600 },
      { productId: 'p41', productName: 'Papaya', quantity: 3, unitPrice: 250, subtotal: 750 },
    ],
    total: 2490, createdAt: daysAgo(15, 9, 15), status: 'completed',
  },
  {
    id: 's56', orderNumber: '#0106', waiterId: 'w4', waiterName: 'Sara',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'telebirr', paymentReference: 'TXN-828010',
    items: [
      { productId: 'p19', productName: 'Chicken Wrap', quantity: 2, unitPrice: 950, subtotal: 1900 },
      { productId: 'p33', productName: 'Iced Latte', quantity: 2, unitPrice: 160, subtotal: 320 },
    ],
    total: 2220, createdAt: daysAgo(15, 13, 40), status: 'completed',
  },
  {
    id: 's57', orderNumber: '#0101', waiterId: 'w1', waiterName: 'Hana',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'dine-in', tableId: 't8', tableNumber: 8,
    paymentMethod: 'cash', amountReceived: 5000, changeGiven: 420,
    items: [
      { productId: 'p19', productName: 'Chicken Wrap', quantity: 3, unitPrice: 950, subtotal: 2850 },
      { productId: 'p24', productName: 'Tibs Firfir', quantity: 1, unitPrice: 650, subtotal: 650 },
      { productId: 'p50', productName: 'Macchiato', quantity: 4, unitPrice: 130, subtotal: 520 },
    ],
    total: 4580, createdAt: daysAgo(16, 12, 0), status: 'completed',
  },
  {
    id: 's58', orderNumber: '#0102', waiterId: 'w5', waiterName: 'Dawit',
    cashierId: 'u2', cashierName: 'Sara', orderType: 'take-away',
    paymentMethod: 'telebirr', paymentReference: 'TXN-827050',
    items: [
      { productId: 'p17', productName: 'Veggie Wrap', quantity: 2, unitPrice: 550, subtotal: 1100 },
      { productId: 'p60', productName: 'Cafe Mocha', quantity: 2, unitPrice: 230, subtotal: 460 },
    ],
    total: 1560, createdAt: daysAgo(16, 15, 10), status: 'completed',
  },
];
