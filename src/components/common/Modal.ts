import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { IModal } from '../../types';

export class Modal extends Component<IModal> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;
	protected _closeEscHandler: (evt: KeyboardEvent) => void;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
		this._closeEscHandler = this.closeEsc.bind(this);
	}

	// Установка контента
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	// Открыть модальное окно
	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
		document.addEventListener('keydown', this._closeEscHandler);
	}

	// Закрыть модальное окно
	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
		document.removeEventListener('keydown', this._closeEscHandler);
	}

	// Закрыть модальное окно на клавишу ESC
	closeEsc(evt: KeyboardEvent) {
		if (evt.key === 'Escape') {
			this.close();
		}
	}

	render(data: IModal): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
