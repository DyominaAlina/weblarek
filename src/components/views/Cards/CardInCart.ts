import { ensureElement } from "../../../utils/utils";
import { ProductCard, IProductCard } from "./ProductCard";

export interface ICardInCartActions {
  onClick?: () => void;
}

export interface ICardInCart extends IProductCard {
  id: string;
  index: number;
}

export class CardInCart extends ProductCard<ICardInCart> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor (container: HTMLElement, actions?: ICardInCartActions) {
    super (container);
    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if (actions?.onClick) {
      this.deleteButton.addEventListener('click', actions.onClick);
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }
  set index (value: number) {
    this.indexElement.textContent = String(value);
  }
}