import { Sale, SaleItem, SaleStatus, VoidReason, DateRange, SalesChartPoint } from '../types';
import { initialSales } from '../data/sales';
import { delay, isToday, isYesterday, isThisWeek, isThisMonth } from '../utils/formatters';

// In-memory store — simulates database
let salesStore: Sale[] = [...initialSales];
let nextOrderNum = 198; // Continues from highest mock order number

function filterByDateRange(sales: Sale[], range: DateRange): Sale[] {
  switch (range) {
    case 'today':
      return sales.filter((s) => isToday(s.createdAt));
    case 'yesterday':
      return sales.filter((s) => isYesterday(s.createdAt));
    case 'week':
      return sales.filter((s) => isThisWeek(s.createdAt));
    case 'month':
      return sales.filter((s) => isThisMonth(s.createdAt));
    default:
      return sales;
  }
}

export const salesService = {
  async getAll(): Promise<Sale[]> {
    await delay(300);
    return [...salesStore].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getFiltered(filters: {
    dateRange?: DateRange;
    paymentMethod?: string;
    waiterId?: string;
    status?: string;
    search?: string;
  }): Promise<Sale[]> {
    await delay(200);
    let filtered = [...salesStore];

    if (filters.dateRange && filters.dateRange !== 'custom') {
      filtered = filterByDateRange(filtered, filters.dateRange);
    }

    if (filters.paymentMethod && filters.paymentMethod !== 'all') {
      if (filters.paymentMethod === 'cbe') {
        filtered = filtered.filter((s) => s.paymentMethod === 'cbe' || s.paymentMethod === 'bank-transfer');
      } else {
        filtered = filtered.filter((s) => s.paymentMethod === filters.paymentMethod);
      }
    }

    if (filters.waiterId && filters.waiterId !== 'all') {
      filtered = filtered.filter((s) => s.waiterId === filters.waiterId);
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((s) => s.status === filters.status);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.orderNumber.toLowerCase().includes(q) ||
          s.waiterName.toLowerCase().includes(q) ||
          s.items.some((item) => item.productName.toLowerCase().includes(q))
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getById(id: string): Promise<Sale | null> {
    await delay(150);
    return salesStore.find((s) => s.id === id) || null;
  },

  async create(saleData: {
    waiterId: string;
    waiterName: string;
    cashierId: string;
    cashierName: string;
    orderType: 'dine-in' | 'take-away';
    tableId?: string;
    tableNumber?: number;
    paymentMethod: string;
    paymentReference?: string;
    amountReceived?: number;
    changeGiven?: number;
    items: SaleItem[];
    total: number;
  }): Promise<Sale> {
    await delay(500);
    nextOrderNum++;
    const newSale: Sale = {
      id: `s-${Date.now()}`,
      orderNumber: `#${String(nextOrderNum).padStart(4, '0')}`,
      ...saleData,
      paymentMethod: saleData.paymentMethod as Sale['paymentMethod'],
      createdAt: new Date().toISOString(),
      status: 'completed',
    };
    salesStore = [newSale, ...salesStore];
    return newSale;
  },

  async voidSale(
    id: string,
    reason: VoidReason,
    voidedBy: string,
    reasonText?: string
  ): Promise<Sale | null> {
    await delay(400);
    const index = salesStore.findIndex((s) => s.id === id);
    if (index === -1) return null;

    salesStore[index] = {
      ...salesStore[index],
      status: 'voided' as SaleStatus,
      voidedBy,
      voidedAt: new Date().toISOString(),
      voidReason: reason,
      voidReasonText: reasonText,
    };
    return salesStore[index];
  },

  async getStats(dateRange: DateRange = 'today') {
    await delay(200);
    const sales = filterByDateRange(salesStore, dateRange);
    const completed = sales.filter((s) => s.status === 'completed');

    const totalSales = completed.reduce((sum, s) => sum + s.total, 0);
    const totalOrders = completed.length;
    const averageOrder = totalOrders > 0 ? totalSales / totalOrders : 0;
    const itemsSold = completed.reduce(
      (sum, s) => sum + s.items.reduce((isum, item) => isum + item.quantity, 0),
      0
    );

    // Calculate comparison with previous period
    let prevRange: DateRange;
    if (dateRange === 'today') prevRange = 'yesterday';
    else prevRange = dateRange;

    const prevSales = dateRange === 'today'
      ? filterByDateRange(salesStore, 'yesterday').filter((s) => s.status === 'completed')
      : completed;
    const prevTotal = prevSales.reduce((sum, s) => sum + s.total, 0);
    const salesChange = prevTotal > 0 ? ((totalSales - prevTotal) / prevTotal) * 100 : 0;

    return {
      totalSales,
      totalOrders,
      averageOrder: Math.round(averageOrder),
      itemsSold,
      salesChange: Math.round(salesChange * 10) / 10,
      ordersChange: 0,
      averageChange: 0,
      itemsChange: 0,
    };
  },

  async getCategorySales(dateRange: DateRange = 'today') {
    await delay(200);
    const sales = filterByDateRange(salesStore, dateRange).filter((s) => s.status === 'completed');
    const categoryMap: Record<string, number> = {};

    // Map product IDs to categories
    const productCategoryMap: Record<string, string> = {
      // Breakfast
      p1: 'Breakfast', p2: 'Breakfast', p3: 'Breakfast', p4: 'Breakfast', p5: 'Breakfast',
      p6: 'Breakfast', p7: 'Breakfast', p8: 'Breakfast', p9: 'Breakfast', p10: 'Breakfast',
      p11: 'Breakfast', p12: 'Breakfast', p13: 'Breakfast',
      // Wraps
      p14: 'Wraps & Sandwiches', p15: 'Wraps & Sandwiches', p16: 'Wraps & Sandwiches',
      p17: 'Wraps & Sandwiches', p18: 'Wraps & Sandwiches', p19: 'Wraps & Sandwiches',
      p20: 'Wraps & Sandwiches', p21: 'Wraps & Sandwiches', p22: 'Wraps & Sandwiches',
      // Ethiopian
      p23: 'Ethiopian Dish', p24: 'Ethiopian Dish', p25: 'Ethiopian Dish',
      // Pasta
      p26: 'Pasta', p27: 'Pasta', p28: 'Pasta', p29: 'Pasta',
      // Snacks
      p30: 'Snacks', p31: 'Snacks', p32: 'Snacks',
      // Cold Drinks
      p33: 'Drinks', p34: 'Drinks', p35: 'Drinks', p36: 'Drinks',
      p37: 'Drinks', p38: 'Drinks', p39: 'Drinks',
      // Juice
      p40: 'Drinks', p41: 'Drinks', p42: 'Drinks', p43: 'Drinks',
      p44: 'Drinks', p45: 'Drinks', p46: 'Drinks', p47: 'Drinks',
      // Cakes
      p48: 'Cakes', p49: 'Cakes',
      // Hot Drinks
      p50: 'Drinks', p51: 'Drinks', p52: 'Drinks', p53: 'Drinks', p54: 'Drinks',
      p55: 'Drinks', p56: 'Drinks', p57: 'Drinks', p58: 'Drinks', p59: 'Drinks',
      p60: 'Drinks', p61: 'Drinks', p62: 'Drinks', p63: 'Drinks', p64: 'Drinks',
      p65: 'Drinks', p66: 'Drinks', p67: 'Drinks', p68: 'Drinks', p69: 'Drinks',
      p70: 'Drinks', p71: 'Drinks', p72: 'Drinks', p73: 'Drinks', p74: 'Drinks', p75: 'Drinks',
    };

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const cat = productCategoryMap[item.productId] || 'Other';
        categoryMap[cat] = (categoryMap[cat] || 0) + item.subtotal;
      });
    });

    const colors = ['#4A2C22', '#6B4436', '#8A6252', '#A68070', '#C4A594', '#DCC8BB'];
    const grandTotal = Object.values(categoryMap).reduce((s, v) => s + v, 0);

    return Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], i) => ({
        name,
        value,
        percentage: grandTotal > 0 ? Math.round((value / grandTotal) * 100) : 0,
        color: colors[i % colors.length],
      }));
  },

  async getPaymentBreakdown(dateRange: DateRange = 'today') {
    await delay(150);
    const sales = filterByDateRange(salesStore, dateRange).filter((s) => s.status === 'completed');
    const methodMap: Record<string, { amount: number; count: number }> = {};

    sales.forEach((s) => {
      const methodKey = s.paymentMethod === 'bank-transfer' ? 'cbe' : s.paymentMethod;
      if (!methodMap[methodKey]) {
        methodMap[methodKey] = { amount: 0, count: 0 };
      }
      methodMap[methodKey].amount += s.total;
      methodMap[methodKey].count += 1;
    });

    const total = Object.values(methodMap).reduce((s, v) => s + v.amount, 0);
    const labels: Record<string, string> = {
      cash: 'Cash',
      telebirr: 'Telebirr',
      cbe: 'CBE',
      'bank-transfer': 'CBE',
      other: 'Other',
    };

    return Object.entries(methodMap).map(([method, data]) => ({
      method: method as Sale['paymentMethod'],
      label: labels[method] || method,
      amount: data.amount,
      percentage: total > 0 ? Math.round((data.amount / total) * 100) : 0,
      count: data.count,
    }));
  },

  async getTopProducts(dateRange: DateRange = 'today', limit = 5) {
    await delay(200);
    const sales = filterByDateRange(salesStore, dateRange).filter((s) => s.status === 'completed');
    const productMap: Record<string, { name: string; quantity: number; revenue: number }> = {};

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (!productMap[item.productId]) {
          productMap[item.productId] = { name: item.productName, quantity: 0, revenue: 0 };
        }
        productMap[item.productId].quantity += item.quantity;
        productMap[item.productId].revenue += item.subtotal;
      });
    });

    return Object.entries(productMap)
      .sort((a, b) => b[1].quantity - a[1].quantity || b[1].revenue - a[1].revenue)
      .slice(0, limit)
      .map(([id, data]) => ({ productId: id, ...data }));
  },

  async getWaiterPerformance(dateRange: DateRange = 'today') {
    await delay(150);
    const sales = filterByDateRange(salesStore, dateRange).filter((s) => s.status === 'completed');
    const waiterMap: Record<string, { name: string; orders: number; revenue: number }> = {};

    sales.forEach((s) => {
      if (!waiterMap[s.waiterId]) {
        waiterMap[s.waiterId] = { name: s.waiterName, orders: 0, revenue: 0 };
      }
      waiterMap[s.waiterId].orders += 1;
      waiterMap[s.waiterId].revenue += s.total;
    });

    return Object.entries(waiterMap)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .map(([id, data]) => ({ waiterId: id, waiterName: data.name, orders: data.orders, revenue: data.revenue }));
  },

  async getLast7DaysChartData(): Promise<SalesChartPoint[]> {
    await delay(150);
    const completedSales = salesStore.filter((s) => s.status === 'completed');
    const result: SalesChartPoint[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const year = d.getFullYear();
      const month = d.getMonth();
      const date = d.getDate();

      const daySales = completedSales.filter((s) => {
        const sDate = new Date(s.createdAt);
        return (
          sDate.getFullYear() === year &&
          sDate.getMonth() === month &&
          sDate.getDate() === date
        );
      });

      const total = daySales.reduce((sum, s) => sum + s.total, 0);
      const orders = daySales.length;

      const weekday = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayLabel = i === 0 ? 'Today' : `${weekday} ${d.getDate()}`;

      result.push({
        label: dayLabel,
        sales: total,
        orders,
      });
    }

    return result;
  },

  async getMonthChartData(): Promise<SalesChartPoint[]> {
    await delay(150);
    const completedSales = salesStore.filter((s) => s.status === 'completed');
    const result: SalesChartPoint[] = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();

    for (let day = 1; day <= currentDay; day++) {
      const d = new Date(currentYear, currentMonth, day);

      const daySales = completedSales.filter((s) => {
        const sDate = new Date(s.createdAt);
        return (
          sDate.getFullYear() === currentYear &&
          sDate.getMonth() === currentMonth &&
          sDate.getDate() === day
        );
      });

      const total = daySales.reduce((sum, s) => sum + s.total, 0);
      const orders = daySales.length;

      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      const dayLabel = `${monthName} ${day}`;

      result.push({
        label: dayLabel,
        sales: total,
        orders,
      });
    }

    return result;
  },

  async getSalesChartData(dateRange: DateRange = 'today') {
    await delay(200);
    const sales = filterByDateRange(salesStore, dateRange).filter((s) => s.status === 'completed');

    if (dateRange === 'today' || dateRange === 'yesterday') {
      // Hourly breakdown
      const hourMap: Record<number, { sales: number; orders: number }> = {};
      for (let h = 7; h <= 22; h++) {
        hourMap[h] = { sales: 0, orders: 0 };
      }
      sales.forEach((s) => {
        const hour = new Date(s.createdAt).getHours();
        if (hourMap[hour]) {
          hourMap[hour].sales += s.total;
          hourMap[hour].orders += 1;
        }
      });
      return Object.entries(hourMap).map(([h, data]) => ({
        label: `${String(h).padStart(2, '0')}:00`,
        sales: data.sales,
        orders: data.orders,
      }));
    } else {
      // Daily breakdown for week/month
      const dayMap: Record<string, { sales: number; orders: number }> = {};
      sales.forEach((s) => {
        const day = new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!dayMap[day]) dayMap[day] = { sales: 0, orders: 0 };
        dayMap[day].sales += s.total;
        dayMap[day].orders += 1;
      });
      return Object.entries(dayMap)
        .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
        .map(([day, data]) => ({
          label: day,
          sales: data.sales,
          orders: data.orders,
        }));
    }
  },
};
