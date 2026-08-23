export interface Category {
  id: number;
  name: string;
  item_count: number;
  image_url: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  has_half_portion?: boolean;
  half_portion_price?: number;
  has_sizes?: boolean;
  size_small_price?: number;
  size_medium_price?: number;
  size_large_price?: number;
  weight: string;
  calories: string;
  ingredients: string;
  image_url: string;
}

export interface Order {
  id: string;
  created_at: string;
  total_price: number;
  items: any;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  branch?: string;
}
