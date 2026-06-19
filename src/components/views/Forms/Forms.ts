import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface IForms {
  valid: boolean;
  errors: string;
}

export class Forms<T> extends Component<T & IForms> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor ( protected events: IEvents, container: HTMLElement) {
    super (container);
    this.submitButton = ensureElement<HTMLButtonElement> ('.button[type="submit"]', this.container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;

      this.onInputChange(field,value);
    })

    this.container.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit(`${this.container.getAttribute('name')}:submit`);
    });
  }

  set valid (value:boolean) {
    this.submitButton.disabled = !value;
  }
  set errors (value: string) {
    this.errorsElement.textContent = value;
  }
  
  protected onInputChange(field: string, value: string): void {
    this.events.emit(`${this.container.getAttribute('name')}.${field}:change`, {
      field,
      value,
    });
  }
}