export type FormErrors = Partial<Record<keyof IOrder, string>>;
export type TPayment = 'card' | 'cash';

export interface ICardDate {
	id: string;
	description: string | string[];
	image: string;
	title: string;
	category: string;
	price: number | null;
}
export interface ICard extends ICardDate {
	index?: string;
	buttonName?: string;
}
export interface IAppState {
	catalog: ICard[];
	basket: ICard[];
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
	formErrors: FormErrors;
}

export interface IOrder extends IOrderDelivery, IOrderContacts {
	total?: number;
	items?: string[];
}

export interface IOrderDelivery {
	payment: TPayment;
	address: string;
}

export interface IOrderContacts {
	email: string;
	phone: string;
}

export interface IOrderResult {
	id: string;
	total: number;
}
