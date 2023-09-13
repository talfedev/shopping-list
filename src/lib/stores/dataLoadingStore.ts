import { writable } from "svelte/store";

export const dataLoading = writable({
    items: true,
    categories: true,
    lists: true,
});