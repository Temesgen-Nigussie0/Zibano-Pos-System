import { Waiter } from '../types';
import { waiters as initialWaiters } from '../data/waiters';
import { delay } from '../utils/formatters';

let waitersStore: Waiter[] = [...initialWaiters];

export const waiterService = {
  async getAll(): Promise<Waiter[]> {
    await delay(150);
    return [...waitersStore];
  },

  async getActive(): Promise<Waiter[]> {
    await delay(100);
    return waitersStore.filter((w) => w.active);
  },

  async getById(id: string): Promise<Waiter | null> {
    await delay(100);
    return waitersStore.find((w) => w.id === id) || null;
  },

  async create(data: { name: string; phone?: string }): Promise<Waiter> {
    await delay(300);
    const newWaiter: Waiter = {
      id: `w-${Date.now()}`,
      name: data.name,
      phone: data.phone,
      active: true,
    };
    waitersStore.push(newWaiter);
    return newWaiter;
  },

  async update(id: string, updates: Partial<Waiter>): Promise<Waiter | null> {
    await delay(300);
    const index = waitersStore.findIndex((w) => w.id === id);
    if (index === -1) return null;
    waitersStore[index] = { ...waitersStore[index], ...updates };
    return waitersStore[index];
  },

  async toggleActive(id: string): Promise<Waiter | null> {
    await delay(200);
    const index = waitersStore.findIndex((w) => w.id === id);
    if (index === -1) return null;
    waitersStore[index] = {
      ...waitersStore[index],
      active: !waitersStore[index].active,
    };
    return waitersStore[index];
  },
};
