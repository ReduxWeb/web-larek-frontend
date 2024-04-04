# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

---

## Документация к проекту "WEB-LAREK":

Архитектура приложения:

Приложение построено на основе паттерна MVP (Model-View-Presenter) и состоит из трех основных слоев:

- `Модель (Model)` - отвечает за хранение и обработку данных.
- `Представление (View) ` - отвечает за отображение данных и взаимодействие с пользователем.
- `Презентер (Presenter)` - связывает Модель и Представление, обрабатывает логику приложения и реагирует на события от Представления..

---

## Интерфейсы (Interfaces):

Интерфейсы определяют структуру данных, используемых в приложении. WEB-LAREK использует следующие интерфейсы:

### 1. IProduct - Описание продукта с сервера

#### Описание:

- `id` - ID Продукта.
- `description` - Описание продукта.
- `image` - Картинка продукта.
- `title` - Название продукта.
- `category` - Категория продукта.
- `price` - Цена продукта

```
interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}
```

### 2. ICard - Описание карточки товара

#### Описание:

- `index` - Индекс карточки.
- `buttonName` - Название кнопки.

```
interface ICard extends IProduct {
	index?: string;
	buttonName?: string;
}
```

### 3. IModal - Интерфейс модальное окно

#### Описание:

- `content` - Cодержимое модального окна.

```
interface IModal {
	content: HTMLElement;
}
```

### 4. IWebLarekApi - Методы для API приложения

#### Описание:

- `getProductsList: () => Promise<IProduct[]>` - Получить с сервера все продукты.
- `getProductId: (id: string) => Promise<IProduct>` - Получить определенный продукт по ID.
- `orderProduct: (order: IOrder) => Promise<IOrderResult>` - Отправка на сервер заказа.

```
interface IWebLarekApi {
	getProductsList: () => Promise<IProduct[]>;
	getProductId: (id: string) => Promise<IProduct>;
	orderProduct: (order: IOrder) => Promise<IOrderResult>;
}
```

### 5. IAppState - Интерфейс Состояние приложения

#### Описание:

- `catalog` - Каталог с товарами.
- `basket` - Корзина с таварами.
- `preview` - ID продукта для предпросмотра
- `order` - Информация о заказе.
- `orderDelivery` - Форма заказа.
- `orderContacts` - Контактная форма.

```
interface IAppState {
	catalog: IProduct[];
	basket: string[];
	preview: string | null;
	order: IOrder | null;
	orderDelivery: IOrderDelivery;
	orderContacts: IOrderContacts;
}
```

### 6. IOrderDelivery - Интерфейс для формы заказа

#### Описание:

- `payment` - Способы оплаты.
- `address` - Адрес доставки.

```
interface IOrderDelivery {
	payment: TPayment;
	address: string;
}
```

### 7. IOrderContacts - Интерфейс контактной информации

#### Описание:

- `email` - Электронная почта.
- `phone` - Номер телефона.

```
interface IOrderContacts {
	email: string;
	phone: string;
}
```

### 8. IOrderResult - Ответ сервера на заказ

#### Описание:

- `id` - ID заказа.
- `total` - Cумма заказа.

```
interface IOrderResult {
	id: string;
	total: number;
}
```

### 9. ISuccess - Отображения успешного заказа

#### Описание:

- `total` - Общая сумма.

```
interface ISuccess {
    total: number;
}
```

### 10. IBasket - Данные для отображения корзиной

#### Описание:

- `items` - Элементы в корзине.
- `total` - Общая сумма.
- `selected` - Установка выбранных товаров в корзине.

```
interface IBasket {
	items: HTMLElement[];
	total: number;
	selected: string[];
}
```

### 11.IPage - Интерфейс для данных страницы

#### Описание:

- `counter` - Cчетчик товара.
- `catalog` - Карточки товаров.
- `locked` - Блокировка страницы.

```
interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}
```

### 12.IFormState - Интерфейс состояние формы

#### Описание:

- `valid` - Валидность формы true | false.
- `errors` - Ошибки в форме.

```
interface IFormState {
	valid: boolean;
	errors: string[];
}
```

### 13. IActions - Интерфейс для действий пользователя

#### Описание:

- `onClick: (evt: MouseEvent) => void` - Обработчик клика

```
interface IActions {
	onClick: (evt: MouseEvent) => void;
}
```

### 14. ISuccessActions - Интерфейс для действий на странице успешной операции

#### Описание:

- `onClick: () => void` - Обработчик клика

```
interface ISuccessActions {
	onClick: () => void;
}
```

### 15. IOrder - Интерфейс для данных заказа

#### Описание:

- `total` - Общая стоимость.
- `items` - Список ID товаров.

```
interface IOrder extends IOrderDelivery, IOrderContacts {
	total: number;
	items: string[];
}
```

---

## Базовый код:

### 1. API - Это базовый класс, который отвечает за работу с сервером.

#### Конструктор класса:

- `baseUrl: string` - принимает `URL`.
- `options: RequestInit` - опции для доступа к различным параметрам.

#### Методы класса:

- `handleResponse(response: Response): Promise<object>` - обрабатывает ответ от сервера
- `get(uri: string)` - для получения данных с сервера
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - для отправки данных на сервер

### 2. EventEmitter - Наблюдатель.

- `on` - установить обработчик на событие
- `off` - снять обработчик с события
- `emit` - инициировать событие с данными
- `onAll` - слушать все события
- `offAll` - сбросить все обработчики
- `trigger` - создает коллбек триггер, генерирующий событие при вызов

### 3. Component - Является основой для компонентов проекта.

#### Конструктор класса:

- `constructor(protected readonly container: HTMLElement)` - принимает DOM элемент для работы в дочерних компонентах

#### Методы класса:

- `toggleClass(element: HTMLElement, className: string, force?: boolean)` - используем для переключения класса компонента
- `setText(element: HTMLElement, value: unknown)` - устанавливает текстовое содержимое
- `setDisabled(element: HTMLElement, state: boolean)` - определяет нужна блокировка или нет
- `setHidden(element: HTMLElement)` - скрывает элемент
- `setVisible(element: HTMLElement)` - показывает элемент удаляя свойство display = 'none'
- `setImage(element: HTMLImageElement, src: string, alt?: string)` - устанавливает изображение с альтернативным текстом.
- `render(data?: Partial<T>): HTMLElement` - возвращает корневой DOM-элемент.

---
