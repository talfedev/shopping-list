import { user } from '$lib/stores/userStore';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
// import type { Item } from "$lib/types/myTypes"; // <-- update or delete

export const load = (async ({params, url}) => {
	const currentUser = get(user);
    if(browser) {
        // console.log(currentUser);
        if(currentUser === null) throw redirect(303, "/login");
    }
	
	const category = {
		name: params.category,
		id: url.searchParams.get("id")
	}
	// console.log("searchParams:", url.searchParams.get("id"));
	
	return {
		category,
	};
}) satisfies PageLoad;