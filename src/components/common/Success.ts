import { Component } from '../base/Component';
import { ensureElement, formatNumber } from '../../utils/utils';

interface ISuccess {
	total: number;
}
interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement; // Кнопка закрытия модального окна
	protected _total: HTMLElement; // отображения итоговой информации

	constructor(container: HTMLElement, actions?: ISuccessActions) {
		super(container);
		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			container
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);

		// обработчик событий для закрытия окна
		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	// Установка текста итоговой информации
	set total(total: number) {
		this.setText(this._total, `Списано ${formatNumber(total)} синапсов`);
	}
}
