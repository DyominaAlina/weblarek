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

// Текущий шаг оформления
let currentStep: 'order' | 'contacts' | null = null;

// Создание карточки каталога
const createGalleryCard = (item: Product): HTMLElement => {
  const card = new CardInGallery(
    cloneTemplate<HTMLButtonElement>(cardCatalogTemplate),
    {
      onClick: () => events.emit('card:select', item),
    }
  );

  return card.render({
    id: item.id,
    title: item.title,
    image: item.image,
    category: item.category,
    price: item.price,
  });
};

// Создание подробной карточки
const createPreviewCard = (item: Product): HTMLElement => {
  const isInCart = cartModel.isAdded(item.id);
  const isDisabled = item.price === null;

  const card = new CardDescription(
    cloneTemplate<HTMLElement>(cardPreviewTemplate),
    {
      onClick: () => events.emit('card:action', item),
    }
  );

  return card.render({
    id: item.id,
    title: item.title,
    image: item.image,
    category: item.category,
    price: item.price,
    description: item.description,
    buttonText: isDisabled
      ? 'Недоступно'
      : isInCart
      ? 'Удалить из корзины'
      : 'Купить',
    disabled: isDisabled,
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
    id: item.id,
    title: item.title,
    price: item.price,
    index,
  });
};

// Открытие корзины
const openBasket = (): void => {
  const basket = cloneTemplate<HTMLElement>(basketTemplate);
  const basketList = ensureElement<HTMLElement>('.basket__list', basket);
  const basketPrice = ensureElement<HTMLElement>('.basket__price', basket);
  const basketButton = ensureElement<HTMLButtonElement>('.basket__button', basket);

  const items = cartModel.getProductsList();
  const cards = items.map((item, index) => createCartCard(item, index + 1));

  basketList.replaceChildren(...cards);
  basketPrice.textContent = `${cartModel.getCostProducts()} синапсов`;
  basketButton.disabled = items.length === 0;

  basketButton.addEventListener('click', () => {
    events.emit('basket:submit');
  });

  modalView.content = basket;
  modalView.open();
};

// Открытие формы заказа
const openOrderForm = (): void => {
  const formOrder = new FormOrder(
    events,
    cloneTemplate<HTMLFormElement>(orderTemplate)
  );

  const purchase = purchaseModel.getPurchase();
  const errors = purchaseModel.verificationPurchase();

  modalView.content = formOrder.render({
    payment: purchase.payment,
    address: purchase.address,
    valid: !errors.payment && !errors.address,
    errors: [errors.payment, errors.address].filter(Boolean).join('; '),
  });

  modalView.open();
};

// Открытие формы контактов
const openContactsForm = (): void => {
  const formContacts = new FormContacts(
    events,
    cloneTemplate<HTMLFormElement>(contactsTemplate)
  );

  const purchase = purchaseModel.getPurchase();
  const errors = purchaseModel.verificationPurchase();

  modalView.content = formContacts.render({
    email: purchase.email,
    phone: purchase.phone,
    valid: !errors.email && !errors.phone,
    errors: [errors.email, errors.phone].filter(Boolean).join('; '),
  });

  modalView.open();
};

// Открытие окна успешного заказа
const openSuccessModal = (total: number): void => {
  const success = cloneTemplate<HTMLElement>(successTemplate);
  const description = ensureElement<HTMLElement>(
    '.order-success__description',
    success
  );
  const closeButton = ensureElement<HTMLButtonElement>(
    '.order-success__close',
    success
  );

  description.textContent = `Списано ${total} синапсов`;

  closeButton.addEventListener('click', () => {
    modalView.close();
  });

  modalView.content = success;
  modalView.open();
};

// События моделей
events.on('catalog:changed', () => {
  galleryView.render({
    catalog: catalogModel.getProductList().map(createGalleryCard),
  });
});

events.on('catalog:card-changed', () => {
  const product = catalogModel.getCard();

  if (product) {
    modalView.content = createPreviewCard(product);
    modalView.open();
  }
});

events.on('cart:changed', () => {
  headerView.render({
    counter: cartModel.getCountProducts(),
  });

  const selectedProduct = catalogModel.getCard();

  if (selectedProduct) {
    modalView.content = createPreviewCard(selectedProduct);
  }
});

events.on('purchase:changed', () => {
  if (currentStep === 'order') {
    openOrderForm();
  }

  if (currentStep === 'contacts') {
    openContactsForm();
  }
});

// События представлений
events.on('card:select', (item: Product) => {
  catalogModel.saveCard(item);
});

events.on('card:action', (item: Product) => {
  if (item.price === null) {
    return;
  }

  if (cartModel.isAdded(item.id)) {
    cartModel.deleteProduct(item.id);
  } else {
    cartModel.addProduct(item);
  }
});

events.on('basket:open', () => {
  openBasket();
});

events.on('cart:delete', (item: Product) => {
  cartModel.deleteProduct(item.id);
  openBasket();
});

events.on('basket:submit', () => {
  currentStep = 'order';
  openOrderForm();
});

events.on('order.payment:change', (data: { field: string; value: string }) => {
  purchaseModel.savePurchase({
    payment: data.value as 'card' | 'cash',
  });
});

events.on('order.address:change', (data: { field: string; value: string }) => {
  purchaseModel.savePurchase({
    address: data.value,
  });
});

events.on('order:submit', () => {
  currentStep = 'contacts';
  openContactsForm();
});

events.on('contacts.email:change', (data: { field: string; value: string }) => {
  purchaseModel.savePurchase({
    email: data.value,
  });
});

events.on('contacts.phone:change', (data: { field: string; value: string }) => {
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
      currentStep = null;
      cartModel.cleanCart();
      purchaseModel.cleaningPurchase();
      openSuccessModal(result.total);
    })
    .catch((error) => {
      console.error('Ошибка отправки заказа:', error);
    });
});

events.on('modal:close', () => {
  currentStep = null;
});


// Инициализация приложения
storeApi
  .getProductList()
  .then((result) => {
    catalogModel.saveProductList(result.items);
  })
  .catch((error) => {
    console.error('Ошибка инициализации приложения:', error);
  });