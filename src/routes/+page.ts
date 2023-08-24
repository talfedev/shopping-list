import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { getCategories } from '$lib/firebase/firestore';
import type { PageLoad } from './$types';
import { user } from '$lib/stores/userStore';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
    const currentUser = get(user);
    if(browser) {
        // console.log(currentUser);
        if(currentUser === null) throw redirect(303, "/login");
    }

    return {
        //
    }
}) satisfies PageLoad;