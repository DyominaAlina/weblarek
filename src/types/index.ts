import { cloneTemplate, ensureElement } from "../utils/utils";
import { EventEmitter } from "../components/base/Events";
import { CardInGallery } from "../components/views/Cards/CardInGallery";
import { CardDescription } from "../components/views/Cards/CardDescription";
import { CardInCart } from "../components/views/Cards/CardInCart";

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface Product {
  id: string;
  title: string;
  image: string;
  category: string;
  price: number | null;
  description: string;
}

export interface Customer {
  payment: 'cash' | 'card' | '';
  address: string;
  email: string;
  phone: string;
}

export type ApiProductListResponse = {
  total: number;
  items: Product[];
};

export type OrderRequest = Customer & {
  items: string[];
  total: number;
};

export type OrderResponse = {
  id: string;
  total: number;
};

export type ValidationErrors = Partial<Record<keyof Customer, string>>;

const events = new EventEmitter();

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");

export const createGalleryCard = (item: Product): HTMLElement => {
  const card = new CardInGallery(
    cloneTemplate<HTMLButtonElement>(cardCatalogTemplate),
    {
      onClick: () => events.emit("card:select", item),
    }
  );

  return card.render(item);
};

const cardPreviewTemplate =
  ensureElement<HTMLTemplateElement>("#card-preview");

export const createPreviewCard = (item: Product): HTMLElement => {
  const card = new CardDescription(
    cloneTemplate<HTMLElement>(cardPreviewTemplate),
    {
      onClick: () => events.emit("card:action", item),
    }
  );

  return card.render({
     ...item,
    buttonText: "В корзину",
    disabled: false,
  });
};

const cardBasketTemplate =
  ensureElement<HTMLTemplateElement>("#card-basket");

export const createCartCard = (item: Product, index: number): HTMLElement => {
  const card = new CardInCart(
    cloneTemplate<HTMLElement>(cardBasketTemplate),
    {
      onClick: () => events.emit("cart:delete", item),
    }
  );

  return card.render({
    id: item.id,
    title: item.title,
    price: item.price,
    index,
  });
};


export { events };