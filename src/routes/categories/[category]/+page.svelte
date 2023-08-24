<script lang="ts">
	import type { PageData } from './$types';
	import { items as allItems } from '$lib/stores/itemsStore';
	import { user } from '$lib/stores/userStore';

	export let data: PageData;

	$: items = $allItems.filter(item => item.category === data.category.id);
</script>

<section>
	<div class="back-arrow">
		<a href="/">←</a>
	</div>
	<h2 class="title">{data.category.name}</h2>
	<div class="items">
		{#each items as item}
			{#if !item.checked}
				<p class="item">{item.name}</p>
			{/if}
		{/each}
	</div>
	<p>--------------------</p>
	<div class="items">
		{#each items as item}
			{#if item.checked}
				<p class="item crossed">{item.name}</p>
			{/if}
		{/each}
	</div>
</section>

<style lang="scss">
	section {
		text-align: center;
	}

	.back-arrow {
		text-align: left;
		font-size: 1.5rem;

		a {
			display: inline-block;
			background-color: lightgray;
			padding: 10px 8px;
			text-decoration: none;
			color: black;
		}
	}

	.title {
		margin: 10px 0;
	}

	.items {
		text-align: left;
	}

	.item {
		padding: 5px 10px;
	}

	.crossed {
		text-decoration: line-through;
		color: gray;
	}
</style>
