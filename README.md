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

## Компоненты модели данных (бизнес-логика):

### 1. AppState - Класс является моделью для управления состоянием проекта

#### Свойства:

- `catalog: ProductModel[]` - Каталог товаров.
- `basket: ProductModel[] = []` - Товары в корзине.
- `order: IOrder` - Данные о заказе.
- `preview: string | null` - ID товара для предпросмотра.
- `formErrors: FormErrors` - Ошибки в форме

### Медоты класса:

- `clearBasket()` - Очищает корзину и генерирует события об изменении.
- `basketChange()` - Генерирует события об изменении состояния корзины.
- `clearOrder()` - Очищает данные формы заказа.
- `setCatalog(items: IProduct[])` - Устанавливает каталог товаров.
- `setPreview(item: IProduct)` - Устанавливает предпросмотр товара.
- `addProductBasket(item: ProductModel)` - Добавляет товар в корзину.
- `removeProductBasket(item: ProductModel)` - Удаления товара с корзины.
- `getTotal()` - Вернуть общую сумму заказов.
- `setOrderField(field: keyof IOrderDelivery, value: TPayment)` - Устанавливает поле заказа и проверяет валидность.
- `setContactField(field: keyof IOrderContacts, value: string)` - Устанавливает поля контакта и проверяет валидность.
- `validateOrder()` - Валидация Заказа.
- `validateContact()` - Валидация контактов.
- `validateEmail(email: string)` - Валидация поля email.
- `validatePhone(phone: string)` - Валидация поля телефон.
- `updateFormErrors(errors: FormErrors)` - Обновляет ошибки формы и генерирует соответствующие события

### Interface:

```
// Состояние приложения
export interface IAppState {
	catalog: IProduct[]; // Каталог с товарами
	basket: IProduct[]; // Корзина с таварами
	preview: string | null; // ID продукта для предпросмотра
	order: IOrder | null; // Информация о заказе
	orderDelivery: IOrderDelivery; // Форма заказа
	orderContacts: IOrderContacts; // Контактная форма
}
```

### 2. WebLarekApi - Расширяет базовый класс Api

#### Свойства:

- `cdn(string)` — ссылка для загрузки изображений продуктов.

#### Конструктор:

- `cdn: string` — ссылка для загрузки изображений продуктов.
- `baseUrl: string` — базовая ссылка на API.
- `options?: RequestInit` — список настроек запроса.

```
constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

```

### Медоты класса:

- `getProductsList(): Promise<IProduct[]>` - Получить с сервера все продукты.
- `getProductId(id: string): Promise<IProduct>` - Получить определенный продукт по ID.
- `orderProduct(order: IOrder): Promise<IOrderResult>` - Отправка на сервер заказа.

### Interface:

```
export interface IWebLarekApi {
	getProductsList: () => Promise<IProduct[]>;
	getProductId: (id: string) => Promise<IProduct>;
	orderProduct: (order: IOrder) => Promise<IOrderResult>;
}
```

---

## Общие компоненты представления

### 1. Класс Modal - для отображения элемента модального окна, открытия, закрытия, управления его содержимым. Наследуется от класса Component`<IModal>`.

#### Конструктор класса:

`constructor(container: HTMLElement, protected events: IEvents)` - принимает контейнер для модального окна и объект для управления событиями.

#### Методы класса:

- `set content(value: HTMLElement)` - Задает содержимое модального окна.
- `open()` - Открывает модальное окно.
- `close()` - Закрывает модальное окно.
- `closeEsc(evt: KeyboardEvent)` - Закрывает модальное окно при нажати ESC.
- `render(data: IModal): HTMLElement` - Рендерит модальное окно.

#### Interface:

```
export interface IModal {
	content: HTMLElement; // содержимое модального окна.
}
```

### 2. Класс Form - Класс, предназначенный для формирования и управления формами. Наследуется от класса Component`<IFormState>`.

#### Конструктор класса:

`constructor(protected container: HTMLFormElement, protected events: IEvents)` - принимает контейнер формы и объект для управления событиями.

#### Методы класса:

- `onInputChange(field: keyof T, value: string)` - Обработчик событий ввода, который генерирует события изменения для каждого поля в форме.
- `set valid(value: boolean)` - Контролирует активность кнопки отправки в зависимости от валидности формы.
- `set errors(value: string)` - Устанавливает и отображает ошибки валидации формы.
- `render(state: Partial<T> & IFormState)` - Отображает состояние формы, устанавливая ее валидность, обрабатывая ошибки и устанавливая значения полей

#### Interface:

```
// Cостояние формы
export interface IFormState {
	valid: boolean;
	errors: string[];
}
```

---

## Компоненты представления:

### 1. Класс Page - управляет основными элементами интерфейса страницы. Наследуется от класса Component`<IPage>`.

#### Свойства класса:

- `_counter` - Элемент счетчика корзины.
- `_catalog` - Контейнер для элементов каталога продуктов.
- `_wrapper` - Обертка страницы.
- `_basket` - Элемент корзины.

#### Конструктор класса:

`constructor(container: HTMLElement, protected events: IEvents)`- Инициализирует элементы страницы и назначает обработчики событий.

#### Методы класса:

- `set counter(value: number)` - уставливает счетчик товаров в корзине.
- `set catalog(items: HTMLElement[])` - Заполняет каталог продуктов.
- `set locked(value: boolean)` - Управляет блокировкой страницы.

#### Interface:

```
export interface IPage {
	counter: number; // Cчетчик товара
	catalog: HTMLElement[]; // Карточки товаров.
	locked: boolean; // Блокировка страницы
}
```

### 2. Класс Card - Класс предназначенный для отображения и управления карточками товара. Наследуется от класса Component`<ICard>`.

#### Свойства класса:

- `_title` - Название товара.
- `_description` - Описание товара.
- `_category` - Категория товара.
- `_image` - Картинка товара.
- `_price` - Цена товара.
- `_index` - Индекс товара.
- `_button` - Кнопка товара.
- `_buttonName` - Значения кнопки товара.

#### Конструктор класса:

`constructor(container: HTMLElement, actions?: IActions)` - Инициализирует элементы карточки и устанавливает обработчики событий для кнопок.

#### Медоты класса:

- `set/get id` - управляет индификатором карточки.
- `set/get title` - управляет названием товара.
- `set description `- устанавливает описание товара.
- `set/get price` - управляет ценой товара.
- `set image` - устанавливает изображение товара.
- `set buttonName` - устанавливает значение кнопки.
- `set/get category` - управляет категорией и ее цветом.
- `disableButton` - если цена не указана, то код проверяет это и делает кнопку покупки неактивной.

#### Interface:

```
export interface ICard extends IProduct {
	index?: string;
	buttonName?: string;
}
```

### 3. Класс Basket(Корзина) - Класс для отображения и управления компонентом корзина. Наследуется от класса Component`<IBasket>`.

Обеспечивает отображение товаров, управление и общей стоимостью.

#### Свойства класса:

- `_list` - Список товаров в корзине.
- `_total` - Отображения общей стоимости товаров.
- `_button` - Кнопка перехода к оформлению заказа.

#### Конструктор класса:

`constructor(container: HTMLElement, protected events: EventEmitter)` - Инициализирует элементы управления корзины и подписывается на события.

#### Методы класса

- `set items(items: HTMLElement[])` - Устанавливаем данные в корзину.
- `set total(total: number)` - Устанавливаем общую сумму товаров в корзине.
- `set selected(items: number)` - Отключием кнопку оформления заказа если корзина пустая.

#### Interface:

```
// Данные для отображения корзиный
export interface IBasket {
	items: HTMLElement[];
	total: number;
	selected: number;
}
```

### 4. Класс OrderDelivery - отображения и управления формой заказа. Наследуется от класса Component`<IOrderDelivery>`.

Класс включает в себя элементы управления для выбора способа оплаты и ввода адреса доставки

#### Свойства класса:

- `_buttonCard` - Кнопка выбора оплаты картой.
- `_buttonCash` - Кнопка оплаты наличными.

#### Конструктор класса:

`constructor(container: HTMLFormElement, events: IEvents, actions?: IActions)` - Инициализирует элементы управления формы и устанавливает обработчики событий.

#### Методы класса:

- `toggleStateButton(target: HTMLElement)` - Переключает активное состояние кнопок способа оплаты;
- `set address(value: string)` - Установка адреса доставки.

#### Interface:

```
export interface IOrderDelivery {
	payment: TPayment; // Способы оплаты
	address: string; // Адрес доставки
}
```

### 5. Класс OrderContact - управляет формой контактов. Наследуется от класса Component`<OrderContact>`.

#### Конструктор класса:

`constructor(container: HTMLFormElement, events: IEvents)` - принимает контейнер формы доставки и объект для управления событиями.

#### Методы класса:

- `set phone(value: string)` - Установка номера телефона.
- `set email(value: string)` - Установка адреса электронной почты.

#### Interface:

```
export interface IOrderContacts {
	email: string; // Электронная почта
	phone: string; // Номер телефона
}
```

### 6. Класс Success - отображающим сообщение об успешной операции. Наследуется от класса Component`<ISuccess>`.

#### Свойства класса:

- `_closeButton` - Кнопка закрытия модального окна.
- `_total` Элемент для отображения итоговой информации

#### Конструктор класса:

`constructor(container: HTMLElement, action?: ISuccessActions)` - Инициализирует элементы интерфейса и назначает обработчики событий.

#### Методы класса:

- `set total(value: string)` - Установка текста итоговой информации.

#### Interface:

```
//Данные для отображения успешного заказа
export interface ISuccess {
	total: number;
}
```

---

## Взаимодействие компонентов:

Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

### Список всех событий:

- `modal:open` - открытие модального окна
- `modal:close` - закрытие модального окна
- `catalog:changen` - изменение каталога товаров
- `card:select` - выбор карточки для отображения в модальном окне
- `card:add`: - добавление карточки в корзину
- `card:remove` - удаление карточки из корзины
- `preview:changed` - открытие окна карточки
- `basket:open` - открыть корзину
- `basket:changed` - изменение корзины
- `counter:changed` - обновление счетчика
- `order:open` - открытие модального окна адреса доставки
- `order:submit` - отправка формы доставки
- `contacts:submit` - отправка формы контактов
- `formErrors:changen` - ошибки

## Ключевые типы данных:

```
// тип, описывающий ошибки валидации форм
export type FormErrors = Partial<Record<keyof IOrder, string>>;
export type TPayment = 'cash' | 'card';



// interface для описание продукта с  сервера
export interface IProduct {
	id: string; // ID Продукта
	description: string; // Описание продукта
	image: string; // Картинка продукта
	title: string; // Название продукта
	category: string; // Категория продукта
	price: number | null; // Цена продукта
}

// Состояние приложения
export interface IAppState {
	catalog: IProduct[]; // Каталог с товарами
	basket: IProduct[]; // Корзина с таварами
	preview: string | null; // ID продукта для предпросмотра
	order: IOrder | null; // Информация о заказе
	orderDelivery: IOrderDelivery; // Форма заказа
	orderContacts: IOrderContacts; // Контактная форма
}

// Карточка товара
export interface ICard extends IProduct {
	index?: string;
	buttonName?: string;
}

export interface IOrder extends IOrderDelivery, IOrderContacts {
	total: number; // Общая стоимость
	items: string[]; // Список ID товаров
}

export interface IOrderDelivery {
	payment: TPayment; // Способы оплаты
	address: string; // Адрес доставки
}

export interface IOrderContacts {
	email: string; // Электронная почта
	phone: string; // Номер телефона
}

// Ответ сервера на заказ
export interface IOrderResult {
	id: string;
	total: number;
}

```
