import './scss/styles.scss';
import { Catalog } from './components/moduls/Catalog';
import { Cart } from './components/moduls/Cart';
import { Purchase } from './components/moduls/Purchase';
import { StoreApi } from './components/moduls/StoreApi';
import { Api } from './components/base/Api';
import { apiProducts } from './utils/data';

// Проверка Catalog
const catalogModel = new Catalog();

catalogModel.saveProductList(apiProducts.items);

console.log('Массив товаров из каталога:', catalogModel.getProductList());

const firstProduct = apiProducts.items[0];
catalogModel.saveCard(firstProduct);

console.log('Выбранная карточка товара:', catalogModel.getCard());
console.log(
  'Товар по id:',
  catalogModel.getProduct(firstProduct.id)
);


// Проверка Cart
const cartModel = new Cart();

cartModel.addProduct(apiProducts.items[0]);
cartModel.addProduct(apiProducts.items[1]);

console.log('Товары в корзине:', cartModel.getProductsList());
console.log('Количество товаров в корзине:', cartModel.getCountProducts());
console.log('Общая стоимость товаров в корзине:', cartModel.getCostProducts());
console.log(
  'Проверка наличия товара в корзине:',
  cartModel.isAdded(apiProducts.items[0].id)
);

cartModel.deleteProduct(apiProducts.items[0].id);

console.log('Корзина после удаления товара:', cartModel.getProductsList());
console.log('Количество после удаления:', cartModel.getCountProducts());
console.log('Стоимость после удаления:', cartModel.getCostProducts());

cartModel.cleaningCart();

console.log('Корзина после очистки:', cartModel.getProductsList());


// Проверка Purchase
const purchaseModel = new Purchase();

console.log('Начальные данные покупателя:', purchaseModel.getPurchase());
console.log('Ошибки пустой формы:', purchaseModel.verificationPurchase());

purchaseModel.savePurchase({
  payment: 'card',
  address: 'Naaldwijk, South Holland, NL',
});

console.log('Данные после первого шага формы:', purchaseModel.getPurchase());
console.log(
  'Ошибки после заполнения оплаты и адреса:',
  purchaseModel.verificationPurchase()
);

purchaseModel.savePurchase({
  email: 'test@example.com',
  phone: '+31612345678',
});

console.log('Полные данные покупателя:', purchaseModel.getPurchase());
console.log(
  'Ошибки после полного заполнения формы:',
  purchaseModel.verificationPurchase()
);

purchaseModel.cleaningPurchase();

console.log('Данные покупателя после очистки:', purchaseModel.getPurchase());


// Проверка слоя коммуникации
const baseApi = new Api(import.meta.env.VITE_API_ORIGIN);
const storeApi = new StoreApi(baseApi);

storeApi
  .getProductList()
  .then((result) => {
    catalogModel.saveProductList(result.items);
    console.log('Каталог, полученный с сервера и сохранённый в модель:', catalogModel.getProductList());
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров с сервера:', error);
  });