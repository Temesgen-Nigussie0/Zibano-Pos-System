import { Product } from '../types';
import { products as initialProducts } from '../data/products';
import { delay } from '../utils/formatters';

// In-memory store initialized from product data
let productsStore: Product[] = [...initialProducts];

export const productService = {
  async getAll(): Promise<Product[]> {
    await delay(200);
    return [...productsStore];
  },

  async getByCategory(categoryId: string): Promise<Product[]> {
    await delay(150);
    if (categoryId === 'popular') {
      const popularIds = [
        'p2',  // Special Ful
        'p3',  // Chechebesa w/ Honey
        'p19', // Chicken Wrap
        'p15', // Boche's Steak Sandwich
        'p23', // Tibs
        'p50', // Macchiato
        'p33', // Iced Latte
        'p47', // Spris Juice
        'p30', // Beef Sambusa
        'p48', // Croissant
        'p13', // Pancake
        'p22', // Club Sandwich
        'p24', // Tibs Firfir
        'p28', // Pasta with Meat
        'p42', // Avocado
      ];
      const popularList = productsStore.filter((p) => p.popular && p.available);
      return popularList.sort((a, b) => {
        const aIndex = popularIds.indexOf(a.id);
        const bIndex = popularIds.indexOf(b.id);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return 0;
      });
    }
    // Merge cold-drinks, juice, hot-drinks, cakes under a single "Drinks" tab display
    if (categoryId === 'drinks') {
      return productsStore.filter((p) =>
        ['cold-drinks', 'juice', 'hot-drinks', 'cakes'].includes(p.categoryId)
      );
    }
    return productsStore.filter((p) => p.categoryId === categoryId);
  },

  async search(query: string): Promise<Product[]> {
    await delay(100);
    const q = query.toLowerCase().trim();
    if (!q) return productsStore.filter((p) => p.available);
    return productsStore.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  },

  async getById(id: string): Promise<Product | null> {
    await delay(100);
    return productsStore.find((p) => p.id === id) || null;
  },

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    await delay(300);
    const index = productsStore.findIndex((p) => p.id === id);
    if (index === -1) return null;
    productsStore[index] = { ...productsStore[index], ...updates };
    return productsStore[index];
  },

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    await delay(400);
    const newProduct: Product = {
      ...product,
      id: `p-${Date.now()}`,
    };
    productsStore.push(newProduct);
    return newProduct;
  },

  async toggleAvailability(id: string): Promise<Product | null> {
    await delay(200);
    const index = productsStore.findIndex((p) => p.id === id);
    if (index === -1) return null;
    productsStore[index] = {
      ...productsStore[index],
      available: !productsStore[index].available,
    };
    return productsStore[index];
  },

  async togglePopular(id: string): Promise<Product | null> {
    await delay(200);
    const index = productsStore.findIndex((p) => p.id === id);
    if (index === -1) return null;
    productsStore[index] = {
      ...productsStore[index],
      popular: !productsStore[index].popular,
    };
    return productsStore[index];
  },
};
