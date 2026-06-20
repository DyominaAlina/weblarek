import { IEvents } from '../base/Events';
import { Product } from '../../types';

export class Catalog {
  protected productList: Product[];
  protected product: Product | null;

  constructor(protected events: IEvents, productList: Product[] = [], product: Product | null = null) {
    this.productList = productList;
    this.product = product;
  }

  getCard(): Product | null{
    return this.product;
  }

  saveCard(product: Product): void {
    this.product = product;
    this.events.emit('catalog:card-changed', this.product);
  }

  getProduct(id: string): Product | undefined {
    return this.productList.find((item) => item.id === id);
  }

  getProductList(): Product[] {
    return this.productList;
  }

  saveProductList(products: Product[]): void {
    this.productList = products;
    this.events.emit('catalog:changed');
  }
}