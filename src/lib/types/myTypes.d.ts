export interface Item {
    category: string;
    checked: boolean;
    description?: string;
    name: string;
    quantity?: number;
    id: string;
}

export type NewItem = Omit<Item, "id">;

export interface Category {
    name: string;
    id: string;
}

export type NewCategory = Omit<Category, "id">;