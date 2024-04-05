import {
	IAppState,
	IProduct,
	IOrder,
	FormErrors,
	IOrderContacts,
	TPayment,
	IOrderDelivery,
} from '../types';
import { Model } from './base/Model';

// Тип события для обновления каталога
export type CatalogChangeEvent = {
	catalog: ProductModel[];
};

// Класс ProductModel - представляющий отдельный товар
export class ProductModel extends Model<IProduct> {
	id: string; // ID Продукта
	description: string; // Описание продукта
	image: string; // Картинка продукта
	title: string; // Название продукта
	category: string; // Категория продукта
	price: number | null; // Цена продукта
}

// Класс AppState - управляющий состоянием приложения
export class AppState extends Model<IAppState> {
	catalog: ProductModel[]; // Каталог товаров
	basket: ProductModel[] = []; // Товары в корзине
	order: IOrder = {
		// Данные о заказе
		payment: 'cash',
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};
	preview: string | null; // ID товара для предпросмотра
	formErrors: FormErrors = {}; // Ошибки в форме

	// Очищает корзину и генерирует события об изменении
	clearBasket() {
		this.basket = []; // Очищаем корзину
		this.basketChange(); // вызываем  события об изменении состояния корзины
	}

	// Генерирует события об изменении состояния корзины
	private basketChange() {
		this.emitChanges('counter:changed', this.basket); // события изменения счетчика
		this.emitChanges('basket:changed', this.basket); // события измения корзины
	}

	// Очищает данные формы заказа
	clearOrder() {
		this.order = {
			payment: 'cash',
			address: '',
			email: '',
			phone: '',
			total: 0,
			items: [],
		};
	}

	// Устанавливает каталог товаров
	setCatalog(items: IProduct[]) {
		this.catalog = items.map((item) => new ProductModel(item, this.events));
		this.emitChanges('catalog:changen', { catalog: this.catalog });
	}

	// Устанавливает предпросмотр товара
	setPreview(item: IProduct) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	// Добавляет товар в корзину только если его там нет
	addProductBasket(item: ProductModel) {
		if (this.basket.indexOf(item) < 0) {
			this.basket.push(item);
			this.basketChange(); // вызываем  события об изменении состояния корзины
		}
	}

	// Удаления товара с корзины
	removeProductBasket(item: ProductModel) {
		this.basket = this.basket.filter((it) => it != item);
		this.basketChange(); // вызываем  события об изменении состояния корзины
	}

	//Вернуть общую сумму заказов
	getTotal() {
		return this.basket.reduce((acc, item) => acc + item.price, 0);
	}

	// Устанавливает поле заказа и проверяет валидность
	setOrderField(field: keyof IOrderDelivery, value: TPayment) {
		this.order[field] = value;
		this.validateOrder();
	}

	// Устанавливает поля контакта и проверяет валидность
	setContactField(field: keyof IOrderContacts, value: string) {
		this.order[field] = value;
		this.validateContact();
	}

	// Валидация Заказа
	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Поле "Адрес" обязательно для заполнения';
		}
		this.updateFormErrors(errors);
	}

	// Валидация контактов
	validateContact() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		} else if (!this.validateEmail(this.order.email)) {
			errors.email = 'Неверный формат email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!this.validatePhone(this.order.phone)) {
			errors.phone = 'Неверный формат телефона';
		}
		this.updateFormErrors(errors); // Вызываем обновление ошибки формы и генерируем соответствующие события
	}

	// Валидация поля email
	validateEmail(email: string) {
		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
		return emailRegex.test(email);
	}

	// Валидация поля телефон
	validatePhone(phone: string) {
		const phoneRegex = /^\+[0-9]{10,15}$/;
		return phoneRegex.test(phone);
	}

	// Обновляет ошибки формы и генерирует соответствующие события
	private updateFormErrors(errors: FormErrors) {
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		if (Object.keys(errors).length === 0) {
			this.events.emit('order:ready', this.order);
		}
	}
}
