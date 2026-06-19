import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Forms, IForms } from "./Forms";

export interface IFormContacts extends IForms {
  email: string;
  phone: string;
}

export class FormContacts extends Forms<IFormContacts> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor (events: IEvents, container: HTMLElement) {
    super(events, container);
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
  }

  set email (value: string) {
    this.emailInput.value = value;
  }

  set phone (value: string) {
    this.phoneInput.value = value;
  }
}