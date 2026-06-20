import { IEvents } from '../base/Events';
import { Product } from '../../types';

export class Cart {
  protected selectedProducts: Product[];

  constructor(protected events: IEvents, selectedProducts: Product[] = []) {
    this.selectedProducts = selectedProducts;
  }

  getProductsList(): Product[] {
    return this.selectedProducts;
  }

  addProduct(product: Product): void {
    this.selectedProducts.push(product);
    this.events.emit('cart:changed');
  }

  deleteProduct(id: string): void {
    this.selectedProducts = this.selectedProducts.filter(
      (item) => item.id !== id
    );
    this.events.emit('cart:changed');
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
    this.events.emit('cart:changed');
  }
}