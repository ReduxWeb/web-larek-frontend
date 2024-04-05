import { Form } from './common/Form';
import { IOrderContacts, IOrderDelivery, IActions } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

// Класс OrderDelivery управляет формой заказа
export class OrderDelivery extends Form<IOrderDelivery> {
	protected _buttonCard: HTMLButtonElement;
	protected _buttonCash: HTMLButtonElement;

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

		// Назначение обработчиков событий для кнопок
		if (actions?.onClick) {
			this._buttonCard.addEventListener('click', actions.onClick);
			this._buttonCash.addEventListener('click', actions.onClick);
		}
	}

	toggleStateButton(target: HTMLElement) {
		this._buttonCard.classList.toggle('button_alt-active');
		this._buttonCash.classList.toggle('button_alt-active');
	}

	// Установка адреса доставки
	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}

// Класс OrderContact управляет формой контактов
export class OrderContact extends Form<IOrderContacts> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}
	// Установка номера телефона
	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	// Установка адреса электронной почты
	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
