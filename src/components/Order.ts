import { Form } from './common/Form';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { IOrderDelivery, IOrderContacts, TPayment } from '../types';

// Интерфейс для действий пользователя
interface IActions {
	onClick: (evt: MouseEvent) => void; // Обработчик клика
}

// Класс  управляет формой заказа
export class OrderDeliveryForm extends Form<IOrderDelivery> {
	protected _buttonCard: HTMLButtonElement;
	protected _buttonCash: HTMLButtonElement;
	private _paymentMethod: TPayment = 'card';

	constructor(container: HTMLFormElement, events: IEvents, actions?: IActions) {
		super(container, events);

		this._buttonCard = ensureElement<HTMLButtonElement>(
			'button[name="card"]',
			container
		);
		this._buttonCash = ensureElement<HTMLButtonElement>(
			'button[name="cash"]',
			this.container
		);

		// Устанавливаем начальное состояние кнопок
		this.toggleButton(this._paymentMethod);

		// Назначение обработчиков событий для кнопок
		if (actions?.onClick) {
			this._buttonCard.addEventListener('click', actions.onClick);
			this._buttonCash.addEventListener('click', actions.onClick);
		}
	}

	// Установка текущего способа оплаты
	setPaymentMethod(method: TPayment) {
		this._paymentMethod = method;
		this.toggleButton(method);
	}

	// Переключение способа оплаты
	toggleButton(method: TPayment) {
		this._buttonCard.classList.toggle('button_alt-active', method === 'card');
		this._buttonCash.classList.toggle('button_alt-active', method === 'cash');
	}

	// Сбрасывает способ оплаты к значению по умолчанию
	resetPaymentMethod() {
		this._buttonCard.classList.add('button_alt-active');
		this._buttonCash.classList.remove('button_alt-active');
	}

	// Установка адреса доставки
	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}

// // Класс  управляет формой контактов
export class OrderContactsForm extends Form<IOrderContacts> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
