export interface Product {
  id: string;
  productId: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  imageUrl: string;
  stock: number;
  featured: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface OrderResponse {
  id: string;
  success: boolean;
  message: string;
}

export interface ProductsApiResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductFilters {
  search?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "name_asc" | "newest";
  page?: number;
  pageSize?: number;
}
