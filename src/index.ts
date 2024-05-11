import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Card } from './components/Card';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { OrderDeliveryForm, OrderContactsForm } from './components/Order';
import { Success } from './components/common/Success';
import { WebLarekApi } from './components/WebLarekApi';
import { cloneTemplate, ensureElement } from './utils/utils';
import { PaymentMethod } from './utils/constants';
import { AppState, CatalogChangeEvent } from './components/AppData';
import { ICard, IOrderContacts, IOrderDelivery, TPayment } from './types';

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll((event) => {
	console.log(event.eventName, event.data);
});

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderDeliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderDelivery = new OrderDeliveryForm(
	cloneTemplate(orderDeliveryTemplate),
	events,
	{
		onClick: (evt: Event) => events.emit('payment:changed', evt.target),
	}
);
const orderContacts = new OrderContactsForm(
	cloneTemplate(contactTemplate),
	events
);
const successModal = new Success(cloneTemplate(successTemplate), {
	onClick: () => modal.close(),
});

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const { title, image, price, category } = item;
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title,
			image,
			category,
			price,
		});
	});
	page.counter = appData.getBasketItemsCount();
});

// Открыть лот
events.on('card:select', (item: ICard) => {
	appData.setPreview(item);
});

// Открыть  продукт
events.on('preview:changed', (item: ICard) => {
	const cardPreview = new Card('card', cloneTemplate(previewTemplate), {
		onClick: () => {
			events.emit('card:toggle', item);
		},
	});
	//console.log(appData.basket.indexOf(item));
	modal.render({
		content: cardPreview.render({
			title: item.title,
			description: item.description,
			image: item.image,
			price: item.price,
			category: item.category,
			buttonName:
				appData.basket.indexOf(item) < 0 ? 'В корзину' : 'Удалить из корзины',
		}),
	});
});

events.on('card:toggle', (item: ICard) => {
	if (appData.basket.indexOf(item) < 0) {
		events.emit('card:add', item);
	} else {
		events.emit('card:delete', item);
	}
});

// Добавления товара в корзину
events.on('card:add', (item: ICard) => {
	appData.addToCardBasket(item);
	modal.close();
});

// Удаление товара из корзины
events.on('card:delete', (item: ICard) => {
	appData.deleteCardBasket(item);
	modal.close();
});

// Открытие корзины
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Обновление корзины
events.on('basket:change', () => {
	page.counter = appData.getBasketItemsCount(); // Обновление счетчика
	basket.items = appData.basket.map((item, index) => {
		const basketCardItem = new Card('card', cloneTemplate(basketCardTemplate), {
			onClick: () => appData.deleteCardBasket(item),
		});
		return basketCardItem.render({
			title: item.title,
			price: item.price,
			index: String(index + 1),
		});
	});
	basket.total = appData.getTotal();
});

// Открыть форму заказа
events.on('order:open', () => {
	modal.render({
		content: orderDelivery.render({
			payment: 'card',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Смена способа оплаты заказа
events.on('payment:changed', (target: HTMLElement) => {
	const paymentMethod = target.getAttribute('name') as TPayment;
	orderDelivery.setPaymentMethod(paymentMethod);
	appData.order.payment = PaymentMethod[paymentMethod] as TPayment;
	console.log(appData.order.payment);
});

// Открытие формы контактов
events.on('order:submit', () => {
	console.log(appData.order);
	appData.order.total = appData.getTotal(); // Записываем в состояние сумму
	modal.render({
		content: orderContacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Оформление заказа
events.on('contacts:submit', () => {
	api
		.order({
			...appData.order,
			items: appData.basket.map((item) => item.id),
			total: appData.getTotal(),
		})
		.then((result) => {
			appData.clearBasket(); // Очищаем корзину
			appData.clearOrder(); // Очищаем форму заказа
			modal.render({
				content: successModal.render({
					total: result.total,
				}),
			});
			orderDelivery.resetPaymentMethod();
		})
		.catch((err) => {
			console.error('Ошибка при оформлении заказа:', err);
		});
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderDelivery>) => {
	const { address, payment } = errors;
	orderDelivery.valid = !address && !payment;
	orderDelivery.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});

events.on('formErrors:change', (errors: Partial<IOrderContacts>) => {
	const { email, phone } = errors;
	orderContacts.valid = !email && !phone;
	orderContacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// Изменение полей доставки
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderDelivery; value: TPayment }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Изменение полей контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderContacts; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.lockScroll = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.lockScroll = false;
});

// Проверка Api
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.log('Ошибка получение товаров с сервера' + err);
	});
