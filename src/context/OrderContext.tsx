import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order } from '@/types';
import { supabase } from '@/lib/supabase';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  updatePaymentStatus: (id: string, paymentStatus: Order['paymentStatus']) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch orders from Supabase on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      if (data) {
        // Map Supabase snake_case to camelCase
        const mappedOrders: Order[] = data.map((row: any) => ({
          id: row.id,
          customerName: row.customer_name,
          mobile: row.mobile,
          email: row.email,
          address: row.address,
          city: row.city,
          pincode: row.pincode,
          items: row.items,
          total: row.total,
          status: row.status,
          paymentStatus: row.payment_status,
          createdAt: new Date(row.created_at),
        }));
        setOrders(mappedOrders);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addOrder = async (order: Order) => {
    try {
      // Map camelCase to snake_case for Supabase
      const supabaseOrder = {
        id: order.id,
        customer_name: order.customerName,
        mobile: order.mobile,
        email: order.email || null,
        address: order.address,
        city: order.city,
        pincode: order.pincode,
        items: order.items,
        total: order.total,
        status: order.status,
        payment_status: order.paymentStatus,
        created_at: order.createdAt,
      };

      const { error } = await supabase
        .from('orders')
        .insert([supabaseOrder]);

      if (error) {
        console.error('Error adding order to Supabase:', error);
        return;
      }

      // Update local state
      setOrders((prev) => [order, ...prev]);
    } catch (err) {
      console.error('Error adding order:', err);
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating order status:', error);
        return;
      }

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  const updatePaymentStatus = async (id: string, paymentStatus: Order['paymentStatus']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: paymentStatus })
        .eq('id', id);

      if (error) {
        console.error('Error updating payment status:', error);
        return;
      }

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, paymentStatus } : o))
      );
    } catch (err) {
      console.error('Error updating payment status:', err);
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting order:', error);
        return;
      }

      // Update local state
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, updatePaymentStatus, deleteOrder, isLoading }}>
      {children}
    </OrderContext.Provider>
  );
};
