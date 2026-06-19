import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Forms, IForms } from "./Forms";

export interface IFormOrder extends IForms {
  payment: 'card' | 'cash' | '';
  address: string;
}

export class FormOrder extends Forms<IFormOrder> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor ( events: IEvents, container: HTMLElement) {
    super(events, container);
    this.cardButton = ensureElement<HTMLButtonElement>('button[mane="card"]', this.container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.cardButton.addEventListener('click', () => {
      this.events.emit('orger.payment:change', {
        field: 'payment',
        value: 'card',
      });
    });

    this.cashButton.addEventListener('click', () => {
      this.events.emit('orger.payment:change', {
        field: 'payment',
        value: 'cash',
      });
    });
  }

  set payment(value: 'card' | 'cash' | '') {
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }
  
  set address (value: string) {
    this.addressInput.value = value;
  }

}