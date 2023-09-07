export interface Item {
	id: string;
	name: string;
	checked: boolean;
	category: string;
	description?: string;
	quantity?: string;
}

export type NewItem = Omit<Item, 'id'>;
export type ItemChecked = Pick<Item, 'checked' | 'id'>;

export interface Category {
	name: string;
	id: string;
	items: string[];
}

export type NewCategory = Omit<Category, 'id'>;

// export function isCategory(object: Category | Item): object is Category {
// 	return (object as Category).items !== undefined;
// }
