import { writable } from "svelte/store";
import { browser } from "$app/environment";

let currentlanguage: 'en'|'he'|null = null;

if(browser) {
    currentlanguage = localStorage.getItem('language') as 'en'| 'he' | null;
}
export const language = writable<'en'| 'he'>(currentlanguage || 'en');