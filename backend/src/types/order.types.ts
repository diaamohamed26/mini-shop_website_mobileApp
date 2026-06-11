export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id?: string;
  user_id: string;
  items: OrderItem[];
  total_price: number;
}