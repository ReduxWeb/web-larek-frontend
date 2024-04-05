// тип, описывающий ошибки валидации форм
export type FormErrors = Partial<Record<keyof IOrder, string>>;
export type TPayment = 'cash' | 'card';

export interface IWebLarekApi {
	getProductsList: () => Promise<IProduct[]>;
	getProductId: (id: string) => Promise<IProduct>;
	orderProduct: (order: IOrder) => Promise<IOrderResult>;
}

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
// Интерфейс для модальных окон, управляющий отображением контента.
export interface IModal {
	content: HTMLElement; // содержимое модального окна.
}

export interface IPage {
	counter: number; // Cчетчик товара
	catalog: HTMLElement[]; // Карточки товаров.
	locked: boolean; // Блокировка страницы
}

//Данные для отображения успешного заказа
export interface ISuccess {
	total: number;
}
// Cостояние формы
export interface IFormState {
	valid: boolean;
	errors: string[];
}
// Данные для отображения корзиный
export interface IBasket {
	items: HTMLElement[];
	total: number;
	selected: number;
}

// Интерфейс для действий пользователя
export interface IActions {
	onClick: (evt: MouseEvent) => void; // Обработчик клика
}

// Интерфейс для действий на странице успешной операции
export interface ISuccessActions {
	onClick: () => void; // Обработчик клика
}
