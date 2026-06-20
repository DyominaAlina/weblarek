import { ensureElement } from "../../../utils/utils";
import { ProductCard, IProductCard } from "./ProductCard";
import { categoryMap } from "../../../utils/constants";

export interface ICardActions {
  onClick?: () => void;
}

export interface ICardInGallery extends IProductCard {
  category: string;
  image: string;
}

type CategoryKey = keyof typeof categoryMap;

export class CardInGallery extends ProductCard<ICardInGallery> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor (container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick)
    }
  }

  set category (value: string) {
    this.categoryElement.textContent = value;

    Object.keys(categoryMap).forEach((key) => {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    });
  }
  set image (value: string) {
    this.setImage(this.imageElement, value, this.titleElement.textContent || '')
  }
}