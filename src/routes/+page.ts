import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import { user } from '$lib/stores/userStore';
import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
    const currentUser = get(user);
    if(browser) {
        if(currentUser === null) throw redirect(303, "/login");
    }

    return {
        //
    }
}) satisfies PageLoad;