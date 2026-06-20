import { ensureElement } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants";
import { ProductCard, IProductCard } from "./ProductCard";

export interface ICardDescriptionActions {
  onClick?: () => void;
}

export interface ICardDescription extends IProductCard {
  category: string;
  image: string;
  description: string;
  buttonText: string;
  disabled: boolean;
}

type CategoryKey = keyof typeof categoryMap;

export class CardDescription extends ProductCard<ICardDescription> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor (container: HTMLElement, actions?: ICardDescriptionActions) {
    super(container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (actions?.onClick) {
      this.buttonElement.addEventListener('click', actions.onClick);
    }
  }
  
  set category (value: string) {
    this.categoryElement.textContent = value;

    Object.keys(categoryMap).forEach((key) => {
      this.categoryElement.classList.toggle(
        categoryMap [key as CategoryKey], 
        key === value
      );
    })
  }
  set image(value: string) {
    this.setImage(this.imageElement, value, this.titleElement.textContent || '');
  }
  set description(value: string) {
    this.descriptionElement.textContent = value;
  }
  set buttonText (value: string) {
    this.buttonElement.textContent = value;
  }
  set disabled (value: boolean) {
    this.buttonElement.disabled = value;
  }
}