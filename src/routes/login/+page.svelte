<script lang="ts">
	import type { PageData } from './$types';
	import { user } from '$lib/stores/userStore';
	import { language } from '$lib/stores/allStores';
	import { languages } from '$lib/languages';
	import { signin, createUser, passwordSignin } from '$lib/firebase/auth';
	import { goto } from '$app/navigation';

	export let data: PageData;

	$: if ($user) {
		goto('/');
	}

	const pageFields = {
		email: '',
		password: ''
	}
	
	const handleSignin = () => {
		passwordSignin(pageFields.email, pageFields.password);

		//clear fields
		pageFields.email = '';
		pageFields.password = '';
	}

	const handleRegister = () => {
		createUser(pageFields.email, pageFields.password);

		//clear fields
		pageFields.email = '';
		pageFields.password = '';
	}

</script>

<div class="main">
	<h2>{languages.content.signin[$language]} / {languages.content.signup[$language]}</h2>
	<div class="buttons">
		<input class:rtl={$language === 'he'} bind:value={pageFields.email} type="email" placeholder={languages.content.email[$language]}>
		<input class:rtl={$language === 'he'} bind:value={pageFields.password} type="password" placeholder={languages.content.password[$language]}>
		<button on:click={handleSignin}>{languages.buttons.signin[$language]}</button>
		<button on:click={handleRegister}>{languages.buttons.signup[$language]}</button>
		<button class="google" on:click={signin}>{languages.buttons.googleSignin[$language]}</button>
	</div>
	<!-- <div>
		<a href="/">home</a>
	</div> -->
</div>

<style>
	.main {
		padding-top: 30px;
		text-align: center;
		max-width: 400px;
		margin: 0 auto;
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
		border: 1px solid black;
		border-radius: 2px;
	}

	.google {
		color: white;
		background-color: rgb(255, 100, 100);
		border: 1px solid black;
	}

	input {
		font-size: 1rem;
		padding: 5px;
	}

	.rtl {
		direction: rtl;
	}
</style>
