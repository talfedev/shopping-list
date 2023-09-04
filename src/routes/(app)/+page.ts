import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import { user } from '$lib/stores/userStore';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
    const currentUser = get(user);
    if(currentUser === null) throw redirect(303, "/login");

    return {
        //
    }
}) satisfies PageLoad;