import { Customer } from '../../types';

export class Purchase {
  protected purchase: Customer;

  constructor(
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
  }

  verificationPurchase(): {
    payment: string;
    address: string;
    email: string;
    phone: string;
  } {
    const errors = {
      payment: '',
      address: '',
      email: '',
      phone: '',
    };

    if (!this.purchase.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }

    if (!this.purchase.address.trim()) {
      errors.address = 'Необходимо указать адрес доставки';
    }

    if (!this.purchase.email.trim()) {
      errors.email = 'Необходимо указать email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.purchase.email)) {
      errors.email = 'Некорректный формат email';
    }

    if (!this.purchase.phone.trim()) {
      errors.phone = 'Необходимо указать номер телефона';
    } else if (!/^\+?[0-9\s\-()]{10,18}$/.test(this.purchase.phone)) {
      errors.phone = 'Некорректный формат телефона';
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
  }
}