import { IApi, ApiProductListResponse, OrderRequest, OrderResponse } from '../../types';

export class StoreApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProductList(): Promise<ApiProductListResponse> {
  return this.api.get<ApiProductListResponse>('/api/weblarek/product/');
  }

  createOrder(order: OrderRequest): Promise<OrderResponse> {
  return this.api.post<OrderResponse>('/api/weblarek/order/', order);
  }
}