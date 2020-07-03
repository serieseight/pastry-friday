<svelte:head>
	{#if pastryTime}
		<title>🥐🥐🥐 Time!</title>
	{:else}
		<title>🥐 - 0{d}:{h.toString().padStart(2, '0')}:{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}</title>
	{/if}
</svelte:head>

<h1>The time is</h1>

<div>
	{#if pastryTime}
		<p>
			<span>🥐🥐🥐🥐🥐🥐🥐🥐</span>
			<span>🥐🥐🥐🥐🥐🥐🥐🥐</span>
			<b>¡PASTRY TIME!</b>
			<span>🥐🥐🥐🥐🥐🥐🥐🥐</span>
			<span>🥐🥐🥐🥐🥐🥐🥐🥐</span>
		</p>
	{:else}
		<p>
			🥐 minus
			<span class:o={!d}>0{d} days</span>
			<span class:o={!h}>{h.toString().padStart(2, '0')} hours</span>
			<span class:o={!m}>{m.toString().padStart(2, '0')} minutes</span>
			{s.toString().padStart(2, '0')} seconds
		</p>
	{/if}
</div>

<footer>
	<h2>Pastry Friday</h2>
	<p>
		<b>starts</b>
		<button type="button" on:click={startdown}>←</button>
		<span>{formattedStart}</span>
		<button type="button" on:click={startup}>→</button>
	</p>

	<p>
		<b>ends</b>
		<button type="button" on:click={enddown}>←</button>
		<span>{formattedEnd}</span>
		<button type="button" on:click={endup}>→</button>
	</p>
</footer>

<script>
	import {onMount} from 'svelte'

	let now = new Date()
	let nextFriday = new Date()
	let start = 8
	let end = 17

	$: {
		let days = (7 - (now.getDay() - 5)) % 7
		if (days === 0 && now.getHours() > end) days = 7
		nextFriday.setDate(now.getDate() + days)
		nextFriday.setHours(start)
		nextFriday.setMinutes(0)
		nextFriday.setSeconds(0)
	}

	$: pastryCountdown = nextFriday.getTime() - now.getTime()
	$: pastryTime = pastryCountdown < 1000
	$: s = Math.floor((pastryCountdown / 1000) % 60)
	$: m = Math.floor((pastryCountdown / (1000 * 60)) % 60)
	$: h = Math.floor((pastryCountdown / (1000 * 60 * 60)) % 24)
	$: d = Math.floor((pastryCountdown / (1000 * 60 * 60 * 24)))
	$: formattedStart = `${start.toString().padStart(2, '0')}:00`
	$: formattedEnd = `${end.toString().padStart(2, '0').replace('00', '12')}:00`

	const startdown = () => start = Math.max(start - 1, 0)
	const startup = () => start = Math.min(start + 1, end - 1, 24)
	const enddown = () => end = Math.max(end - 1, start + 1)
	const endup = () => end = Math.min(end + 1, 24)

	onMount(() => {
		let frame

		(function loop() {
			frame = requestAnimationFrame(loop)
			now = new Date()
		}())

		return () => cancelAnimationFrame(frame)
	})
</script>

<style>
	h1 {font-size: max(7vh, 0.9rem); margin: 0;}
	div p {margin: 0; font-size: max(5vh, 0.9rem); display: flex; flex-direction: column; align-items: center;}
	.o {opacity: 0.2}
	footer {font-size: max(2vh, 0.9rem); display: flex; width: 100%; position: fixed; bottom: 0; justify-content: center; align-items: center;}
	footer p {display: flex; align-items: center; padding: 0.5vh 2vh;}
	footer span {width: max(6.5vh, 3rem); text-align: center;}
	footer b {font-weight: normal; margin-right: 0.5vh;}
	h2 {font-size: inherit;}
	button {font-size: inherit;}
</style>