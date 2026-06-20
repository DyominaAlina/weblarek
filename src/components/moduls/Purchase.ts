import { Customer, ValidationErrors } from '../../types';
import { IEvents } from '../base/Events';

export class Purchase {
  protected purchase: Customer;

  constructor(
    protected events: IEvents,
    purchase: Customer = {
      payment: '',
      address: '',
      email: '',
      phone: '',
    }
  ) {
    this.purchase = purchase;
  }

  getPurchase(): Customer {
    return this.purchase;
  }

  savePurchase(data: Partial<Customer>): void {
    this.purchase = {
      ...this.purchase,
      ...data,
    };
    this.events.emit('purchase:changed');
  }

  verificationPurchase(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!this.purchase.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }

    if (!this.purchase.address.trim()) {
      errors.address = 'Необходимо указать адрес доставки';
    }

    if (!this.purchase.email.trim()) {
      errors.email = 'Необходимо указать email';
    } 

    if (!this.purchase.phone.trim()) {
      errors.phone = 'Необходимо указать номер телефона';
    } 

    return errors;
  }

  cleaningPurchase(): void {
    this.purchase = {
      payment: '',
      address: '',
      email: '',
      phone: '',
    };
    this.events.emit('purchase:changed');
  }
}