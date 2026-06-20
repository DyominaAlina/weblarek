import './scss/styles.scss';

import { Catalog } from './components/moduls/Catalog';
import { Cart } from './components/moduls/Cart';
import { Purchase } from './components/moduls/Purchase';
import { StoreApi } from './components/moduls/StoreApi';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';

import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { Modal } from './components/views/Modal';
import { Basket } from './components/views/Basket';
import { Success } from './components/views/Success';
import { CardInGallery } from './components/views/Cards/CardInGallery';
import { CardInCart } from './components/views/Cards/CardInCart';
import { CardDescription } from './components/views/Cards/CardDescription';
import { FormOrder } from './components/views/Forms/FormOrder';
import { FormContacts } from './components/views/Forms/FormContacts';

import { ensureElement, cloneTemplate } from './utils/utils';
import { API_URL } from './utils/constants';
import { Product, OrderRequest } from './types/index';

// Брокер событий
const events = new EventEmitter();

// Модели
const catalogModel = new Catalog(events);
const cartModel = new Cart(events);
const purchaseModel = new Purchase(events);

// API
const baseApi = new Api(API_URL);
const storeApi = new StoreApi(baseApi);

// Корневые DOM-элементы
const page = ensureElement<HTMLElement>('.page');
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('#modal-container');

// Шаблоны
const cardCatalogTemplate =
  ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate =
  ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate =
  ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate =
  ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate =
  ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate =
  ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate =
  ensureElement<HTMLTemplateElement>('#success');

// View-экземпляры
const headerView = new Header(events, page);
const galleryView = new Gallery(galleryContainer);
const modalView = new Modal(events, modalContainer);

const previewView = new CardDescription(
  cloneTemplate<HTMLElement>(cardPreviewTemplate),
  {
    onClick: () => events.emit('card:action'),
  }
);

const basketView = new Basket(
  events,
  cloneTemplate<HTMLElement>(basketTemplate)
);

const orderView = new FormOrder(
  events,
  cloneTemplate<HTMLFormElement>(orderTemplate)
);

const contactsView = new FormContacts(
  events,
  cloneTemplate<HTMLFormElement>(contactsTemplate)
);

const successView = new Success(
  events,
  cloneTemplate<HTMLElement>(successTemplate)
);

// Создание карточки каталога
const createGalleryCard = (item: Product): HTMLElement => {
  const card = new CardInGallery(
    cloneTemplate<HTMLButtonElement>(cardCatalogTemplate),
    {
      onClick: () => events.emit('card:select', item),
    }
  );

  return card.render({
    title: item.title,
    image: item.image,
    category: item.category,
    price: item.price,
  });
};

// Создание карточки корзины
const createCartCard = (item: Product, index: number): HTMLElement => {
  const card = new CardInCart(
    cloneTemplate<HTMLElement>(cardBasketTemplate),
    {
      onClick: () => events.emit('cart:delete', item),
    }
  );

  return card.render({
    title: item.title,
    price: item.price,
    index,
  });
};

// События моделей
events.on('catalog:changed', () => {
  galleryView.render({
    catalog: catalogModel.getProductList().map(createGalleryCard),
  });
});

events.on('catalog:card-changed', () => {
  const product = catalogModel.getCard();

  if (!product) {
    return;
  }

  previewView.render({
    title: product.title,
    image: product.image,
    category: product.category,
    price: product.price,
    description: product.description,
    buttonText:
      product.price === null
        ? 'Недоступно'
        : cartModel.isAdded(product.id)
        ? 'Удалить из корзины'
        : 'Купить',
    disabled: product.price === null,
  });
});

events.on('cart:changed', () => {
  headerView.render({
    counter: cartModel.getCountProducts(),
  });

  basketView.render({
    items: cartModel.getProductsList().map((item, index) => createCartCard(item, index + 1)),
    total: cartModel.getCostProducts(),
    selected: cartModel.getCountProducts(),
  });

  const product = catalogModel.getCard();

  if (!product) {
    return;
  }

  previewView.render({
    title: product.title,
    image: product.image,
    category: product.category,
    price: product.price,
    description: product.description,
    buttonText:
      product.price === null
        ? 'Недоступно'
        : cartModel.isAdded(product.id)
        ? 'Удалить из корзины'
        : 'Купить',
    disabled: product.price === null,
  });
});

events.on('purchase:changed', () => {
  const purchase = purchaseModel.getPurchase();
  const errors = purchaseModel.verificationPurchase();

  orderView.render({
    payment: purchase.payment,
    address: purchase.address,
    valid: !errors.payment && !errors.address,
    errors: [errors.payment, errors.address].filter(Boolean).join('; '),
  });

  contactsView.render({
    email: purchase.email,
    phone: purchase.phone,
    valid: !errors.email && !errors.phone,
    errors: [errors.email, errors.phone].filter(Boolean).join('; '),
  });
});

// События представлений
events.on('card:select', (item: Product) => {
  catalogModel.saveCard(item);
  modalView.content = previewView.render();
  modalView.open();
});

events.on('card:action', () => {
  const product = catalogModel.getCard();

  if (!product || product.price === null) {
    return;
  }

  if (cartModel.isAdded(product.id)) {
    cartModel.deleteProduct(product.id);
  } else {
    cartModel.addProduct(product);
  }
});

events.on('basket:open', () => {
  modalView.content = basketView.render();
  modalView.open();
});

events.on('cart:delete', (item: Product) => {
  cartModel.deleteProduct(item.id);
});

events.on('basket:submit', () => {
  modalView.content = orderView.render();
  modalView.open();
});

events.on('order.payment:change', (data: {value: string }) => {
  purchaseModel.savePurchase({
    payment: data.value as 'card' | 'cash',
  });
});

events.on('order.address:change', (data: {value: string }) => {
  purchaseModel.savePurchase({
    address: data.value,
  });
});

events.on('order:submit', () => {
  modalView.content = contactsView.render();
  modalView.open();
});

events.on('contacts.email:change', (data: {value: string }) => {
  purchaseModel.savePurchase({
    email: data.value,
  });
});

events.on('contacts.phone:change', (data: {value: string }) => {
  purchaseModel.savePurchase({
    phone: data.value,
  });
});

events.on('contacts:submit', () => {
  const purchase = purchaseModel.getPurchase();

  const order: OrderRequest = {
    ...purchase,
    items: cartModel.getProductsList().map((item) => item.id),
    total: cartModel.getCostProducts(),
  };

  storeApi
    .createOrder(order)
    .then((result) => {
      successView.render({ total: result.total });
      cartModel.cleanCart();
      purchaseModel.cleaningPurchase();
      modalView.content = successView.render();
      modalView.open();
    })
    .catch((error) => {
      console.error('Ошибка отправки заказа:', error);
    });
});

events.on('success:close', () => {
  modalView.close();
});

// Инициализация приложения
storeApi
  .getProductList()
  .then((result) => {
    catalogModel.saveProductList(result.items);
    purchaseModel.cleaningPurchase();
    cartModel.cleanCart();
  })
  .catch((error) => {
    console.error('Ошибка инициализации приложения:', error);
  });