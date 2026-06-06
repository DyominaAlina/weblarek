import { Product } from '../../types';

export class Cart {
  protected selectedProducts: Product[];

  constructor(selectedProducts: Product[] = []) {
    this.selectedProducts = selectedProducts;
  }

  getProductsList(): Product[] {
    return this.selectedProducts;
  }

  addProduct(product: Product): void {
    this.selectedProducts.push(product);
  }

  deleteProduct(id: string): void {
    this.selectedProducts = this.selectedProducts.filter(
      (item) => item.id !== id
    );
  }

  getCountProducts(): number {
    return this.selectedProducts.length;
  }

  getCostProducts(): number {
    return this.selectedProducts.reduce((total, item) => {
      return total + (item.price ?? 0);
    }, 0);
  }

  isAdded(id: string): boolean {
    return this.selectedProducts.some((item) => item.id === id);
  }

  cleanCart(): void {
    this.selectedProducts = [];
  }
}