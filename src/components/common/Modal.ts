import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;
	protected _closeEsc: (evt: KeyboardEvent) => void;

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
		this._closeEsc = this.closeEsc.bind(this);
	}

	set content(content: HTMLElement) {
		this._content.replaceChildren(content);
	}

	open(): void {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
		document.addEventListener('keydown', this._closeEsc);
	}

	close(): void {
		this.container.classList.remove('modal_active');
		this.events.emit('modal:close');
		document.removeEventListener('keydown', this._closeEsc);
	}

	closeEsc(evt: KeyboardEvent): void {
		if (evt.key === 'Escape') {
			this.close();
		}
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
