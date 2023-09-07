import type { Category, Item } from "./myTypes";

export function isCategory(object: Category | Item): object is Category {
	return (object as Category).items !== undefined;
}