import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CartItem, OrderType, PaymentMethod, Waiter } from '../types';

interface CartContextType {
  items: CartItem[];
  selectedWaiter: Waiter | null;
  orderType: OrderType;
  selectedTable: string | null;
  paymentMethod: PaymentMethod | null;
  amountReceived: string;
  paymentReference: string;
  total: number;
  itemCount: number;
  addItem: (product: { id: string; name: string; price: number; image?: string }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setSelectedWaiter: (waiter: Waiter | null) => void;
  setOrderType: (type: OrderType) => void;
  setSelectedTable: (tableId: string | null) => void;
  setPaymentMethod: (method: PaymentMethod | null) => void;
  setAmountReceived: (amount: string) => void;
  setPaymentReference: (ref: string) => void;
  resetOrder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedWaiter, setSelectedWaiter] = useState<Waiter | null>(null);
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [amountReceived, setAmountReceived] = useState('');
  const [paymentReference, setPaymentReference] = useState('');

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = useCallback((product: { id: string; name: string; price: number; image?: string }) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          unitPrice: product.price, // Price snapshot at time of adding
          quantity: 1,
          subtotal: product.price,
          image: product.image,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity, subtotal: quantity * item.unitPrice }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const resetOrder = useCallback(() => {
    setItems([]);
    setSelectedWaiter(null);
    setOrderType('dine-in');
    setSelectedTable(null);
    setPaymentMethod(null);
    setAmountReceived('');
    setPaymentReference('');
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        selectedWaiter,
        orderType,
        selectedTable,
        paymentMethod,
        amountReceived,
        paymentReference,
        total,
        itemCount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setSelectedWaiter,
        setOrderType,
        setSelectedTable,
        setPaymentMethod,
        setAmountReceived,
        setPaymentReference,
        resetOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
