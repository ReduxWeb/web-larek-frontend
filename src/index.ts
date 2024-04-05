//Стили проекта
import './scss/styles.scss';

import { WebLarekApi } from './components/WebLarekApi';
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import {
	AppState,
	ProductModel,
	CatalogChangeEvent,
} from './components/AppState';
import { Card } from './components/Card';
import { Modal } from './components/common/Modal';
import { Page } from './components/Page';
import { ensureElement, cloneTemplate } from './utils/utils';

// События и API
const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Все шаблоны
const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events); // Страница
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events); // Модалка

// Переиспользуемые части интерфейса

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on<CatalogChangeEvent>('catalog:changen', () => {
	page.catalog = appData.catalog.map((item) => {
		const { title, image, price, category } = item;
		const card = new Card('card', cloneTemplate(catalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title,
			image,
			price,
			category,
		});
	});
});

// Открыть лот
events.on('card:select', (item: ProductModel) => {
	appData.setPreview(item);
});

// Открыть  продукт
events.on('preview:changed', (item: ProductModel) => {
	const cardPreview = new Card('card', cloneTemplate(previewTemplate), {
		onClick: () => {
			events.emit('card:toggle', item);
		},
	});
	modal.render({
		content: cardPreview.render({
			title: item.title,
			description: item.description,
			image: item.image,
			price: item.price,
			category: item.category,
			buttonName:
				appData.basket.indexOf(item) < 0 ? 'Купить' : 'Удалить из корзины',
		}),
	});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Получение и отображение списка продуктов при загрузке страницы
api
	.getProductsList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error('Ошибка при загрузке списка продуктов:', err);
	});
