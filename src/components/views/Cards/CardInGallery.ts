import { ensureElement } from "../../../utils/utils";
import { ProductCard, IProductCard } from "./ProductCard";

export interface ICardActions {
  onClick?: () => void;
}

export interface ICardInGallery extends IProductCard {
  category: string;
  image: string;
}

const categoryMap = {
  "софт-скил": "card__category_soft",
  "хард-скил": "card__category_hard",
  "другое": "card__category_other",
  "дополнительное": "card__category_additional",
  "кнопка": "card__category_button",
};

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

  set id (value: string) {
    this.container.dataset.id = value;
  }
  set category (value: string) {
    this.categoryElement.textContent = value;
    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    }
  }
  set image (value: string) {
    this.setImage(this.imageElement, value, this.titleElement.textContent || '')
  }
}