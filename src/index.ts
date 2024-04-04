//Стили проекта
import './scss/styles.scss';

import { WebLarekApi } from './components/WebLarekApi';
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';

// События и API
const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Получение и отображение списка продуктов при загрузке страницы
api
	.getProductsList()
	.then((data) => {
		console.log(data);
	})
	.catch((err) => {
		console.error('Ошибка при загрузке списка продуктов:', err);
	});
