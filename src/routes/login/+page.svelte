<script lang="ts">
	import type { PageData } from './$types';
	import { user } from '$lib/stores/userStore';
	import { signin } from '$lib/firebase/auth';
	import { goto } from '$app/navigation';

	export let data: PageData;

	$: if ($user) {
		goto('/');
	}
	// $: console.log("login page user status:", $user);
</script>

<div class="main">
	<h2>Login / Register</h2>
	<div class="buttons">
		<button on:click={signin}>Login/Register (Google)</button>
	</div>
	<div>
		<a href="/">home</a>
	</div>
</div>

<style>
	.main {
		padding-top: 30px;
		text-align: center;
	}

	.buttons {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-top: 30px;
		padding: 0 10px;
	}

	button {
		padding: 5px 0;
		font-size: 20px;
	}
</style>
