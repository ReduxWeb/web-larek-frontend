import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { IBasket } from '../../types';

// Класс корзина в разработке
export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
	}
}
