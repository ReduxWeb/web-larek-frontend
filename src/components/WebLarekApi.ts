import { ICardDate, IOrder, IOrderResult } from '../types';
import { Api, ApiListResponse } from './base/api';

interface IWebLarekApi {
	getProductList(): Promise<ICardDate[]>;
	order(order: IOrder): Promise<IOrderResult>;
}

export class WebLarekApi extends Api implements IWebLarekApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}
	// Получить с сервера все продукты
	getProductList(): Promise<ICardDate[]> {
		return this.get('/product').then((data: ApiListResponse<ICardDate>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	// Отправка заказа на сервер
	order(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
