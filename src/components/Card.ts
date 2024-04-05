import { Component } from './base/Component';
import { ICard, IActions } from '../types';
import { ensureElement } from '../utils/utils';
import { cardCategory } from '../utils/constants';

// Класс карточки товара
export class Card extends Component<ICard> {
	protected _description: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _price?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _index?: HTMLElement;
	protected _buttonName?: string;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IActions
	) {
		super(container);
		this._index = container.querySelector('.basket__item-index');
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		this._image = container.querySelector(`.${blockName}__image`);
		this._description = container.querySelector(`.${blockName}__text`);
		this._category = container.querySelector(`.${blockName}__category`);
		this._button = container.querySelector(`.${blockName}__button`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	//SET,GET: ID
	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	//SET,GET: title
	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	//SET: description
	set description(value: string) {
		this.setText(this._description, value);
	}

	//SET: image
	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	//SET,GET: price
	set price(value: number | null) {
		this.setText(this._price, value ? `${value.toString()} синапсов` : '');
		this.disableButton(value);
	}

	get price(): number {
		return Number(this._price.textContent || '');
	}

	//SET,GET: category
	set category(value: string) {
		this.setText(this._category, value);
		this._category.classList.add(cardCategory[value]);
	}

	get category(): string {
		return this._category.textContent || '';
	}

	//SET,GET: index
	set index(value: string) {
		this._index.textContent = value;
	}

	get index(): string {
		return this._index.textContent || '';
	}

	//SET buttonName
	set buttonName(value: string) {
		if (this._button) {
			this._button.textContent = value;
		}
	}

	// Метод для отключения кнопки цены
	disableButton(value: number | null) {
		if (!value) {
			if (this._button) {
				this.setDisabled(this._button, true);
			}
		}
	}
}
