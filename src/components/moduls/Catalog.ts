import { Product } from '../../types';

export class Catalog {
  protected productList: Product[];
  protected product: Product;

  constructor(productList: Product[] = [], product: Product) {
    this.productList = productList;
    this.product = product;
  }

  getCard(): Product{
    return this.product;
  }

  saveCard(product: Product): void {
    this.product = product;
  }

  getProduct(id: string): Product | undefined {
    return this.productList.find((item) => item.id === id);
  }

  getProductList(): Product[] {
    return this.productList;
  }

  saveProductList(products: Product[]): void {
    this.productList = products;
  }
}