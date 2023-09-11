<script>
	import '../app.css';
	import { languages } from '$lib/languages';
	import { language } from '$lib/stores/allStores';
</script>

<h1>{languages.content.title[$language]}</h1>
<slot />

<style lang="scss">
	h1 {
		// background-color: rgb(81, 81, 255);
		text-align: center;
		background-color: rgb(51, 51, 51);
		color: white;
		padding: 5px 0;
	}

	@media print {
		h1 {
			display: none;
		}
	}
</style>
