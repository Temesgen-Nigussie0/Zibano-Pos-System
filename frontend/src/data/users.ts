import { User } from '../types';

export interface MockUser extends User {
  password: string;
}

export const users: MockUser[] = [
  {
    id: 'u1',
    name: 'Zibano Owner',
    email: 'owner@zibano.demo',
    role: 'owner',
    password: 'ZibanoOwner123!',
  },
  {
    id: 'u2',
    name: 'Sara',
    email: 'cashier@zibano.demo',
    role: 'cashier',
    password: 'ZibanoCashier123!',
  },
];
