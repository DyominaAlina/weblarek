import { IApi, ApiProductListResponse, OrderRequest, OrderResponse } from '../../types';
import { CDN_URL } from "../../utils/constants";

export class StoreApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

 async getProductList(): Promise<ApiProductListResponse> {
  const data = await this.api.get<ApiProductListResponse>('/product/');

  return {
      total: data.total,
      items: data.items.map((item) => ({
        ...item,
        image: `${CDN_URL}/${item.image.replace(/^\/+/, '')}`,
      })),
    };
  }

  createOrder(order: OrderRequest): Promise<OrderResponse> {
  return this.api.post<OrderResponse>('/order/', order);
  }
}