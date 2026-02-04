export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[]; // Support for multiple images
  specification?: string; // e.g., "100 ml", "75 g"
  ingredients: string[];
  category: 'soap' | 'oil' | 'shampoo';
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  mobile: string;
  email?: string;
  address: string;
  city: string;
  pincode: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'pay_later';
  createdAt: Date;
}

export interface CheckoutFormData {
  customerName: string;
  mobile: string;
  address: string;
  city: string;
  pincode: string;
}
