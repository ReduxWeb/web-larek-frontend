import { Model } from './base/Model';
import {
	ICard,
	IAppState,
	IOrder,
	IOrderDelivery,
	IOrderContacts,
	FormErrors,
	TPayment,
} from '../types';

export type CatalogChangeEvent = {
	catalog: ICard[];
};

export class AppState extends Model<IAppState> {
	basket: ICard[] = [];
	catalog: ICard[];
	loading: boolean;
	order: IOrder = {
		payment: 'online',
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};
	preview: string | null;
	formErrors: FormErrors = {};

	clearBasket() {
		this.basket = [];
		this.basketChange();
	}
	// Очищает данные формы заказа
	clearOrder() {
		this.order = {
			payment: 'online',
			address: '',
			email: '',
			phone: '',
			total: 0,
			items: [],
		};
	}

	basketChange() {
		this.emitChanges('basket:change', this.basket); // события измения корзины
	}

	setCatalog(cards: ICard[]) {
		this.catalog = cards;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(preview: ICard) {
		this.preview = preview.id;
		this.emitChanges('preview:changed', preview);
	}

	addToCardBasket(card: ICard) {
		if (this.basket.indexOf(card) < 0) {
			this.basket.push(card);
			this.basketChange(); // вызываем  события об изменении состояния корзины
		}
	}

	deleteCardBasket(card: ICard) {
		this.basket = this.basket.filter((basketItem) => basketItem.id != card.id);
		this.basketChange();
	}

	// Устанавливает поле заказа и проверяет валидность
	setOrderField(field: keyof IOrderDelivery, value: TPayment) {
		this.order[field] = value;
		this.validateOrderForm();
	}

	// Устанавливает поля контакта и проверяет валидность
	setContactField(field: keyof IOrderContacts, value: string) {
		this.order[field] = value;
		this.validateContactForm();
	}
	// Валидация Заказа
	validateOrderForm() {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Поле "Адрес" обязательно для заполнения';
		}
		this.updateFormErrors(errors);
	}

	// Валидация контактов
	validateContactForm() {
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

	getTotal() {
		return this.basket.reduce((acc, item) => acc + item.price, 0);
	}
}
