import { ICard } from '../types';
import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { categoryColor } from '../utils/constants';

interface ICardActions {
	onClick: (evt: MouseEvent) => void;
}

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
		actions?: ICardActions
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

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set price(value: number | null) {
		this.setText(
			this._price,
			value ? `${value.toString()} синапсов` : 'Бесценно'
		);
		this.disableButton(value);
	}

	get price(): number {
		return Number(this._price.textContent || '');
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.classList.add(categoryColor[value]);
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set index(value: string) {
		this._index.textContent = value;
	}

	get index(): string {
		return this._index.textContent || '';
	}

	set buttonName(value: string) {
		if (this._button) {
			this._button.textContent = value;
		}
	}
	disableButton(value: number | null) {
		if (!value) {
			if (this._button) {
				this.setDisabled(this._button, true);
			}
		}
	}
}
