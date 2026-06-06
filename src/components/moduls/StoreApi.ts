import { IApi, ApiProductListResponse, OrderRequest, OrderResponse } from '../../types';

export class StoreApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

 getProductList(): Promise<ApiProductListResponse> {
  return this.api.get<ApiProductListResponse>('/product/');
  }

  createOrder(order: OrderRequest): Promise<OrderResponse> {
  return this.api.post<OrderResponse>('/order/', order);
  }
}