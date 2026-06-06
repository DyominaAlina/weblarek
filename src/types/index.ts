export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface Product {
  id: string;
  title: string;
  image: string;
  category: string;
  price: number | null;
  description: string;
}

export interface Customer {
  payment: 'cash' | 'card' | '';
  address: string;
  email: string;
  phone: string;
}

export type ApiProductListResponse = {
  total: number;
  items: Product[];
};

export type OrderRequest = Customer & {
  items: string[];
  total: number;
};

export type OrderResponse = {
  id: string;
  total: number;
};