export interface LoginData {
    email: string;
    password: string;
}
  
export interface User {
    id: string;
    username: string;
    role: string;
}
  
export interface AuthResponse {
    token: string;
    user: User;
}
export interface RegisterData {
    username: string;
    email: string;
    password: string;
    role: string;
}

export interface Product {
  productId?:string,
  pname: string;
  price: number;
  discount: number;
  images: string[];
  quantity: number;
  category: string;
  vendorId: String;
  description: string;
}

export interface ProductResponse {
  message:string;
  product: Product[];
}

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  productType?: string|null;
}

export interface NavItem {
  label: string;
  icon: any;
  id: string;
}
