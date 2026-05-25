export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  ingredients: string;
  images: string[];
  category?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  telegramUsername?: string;
  deliveryDate: string;
  address: string;
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}
