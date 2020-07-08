<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>

<section>
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
				<span class:o={!d && !h}>{h.toString().padStart(2, '0')} hours</span>
				<span class:o={!d && !h && !m}>{m.toString().padStart(2, '0')} minutes</span>
				{s.toString().padStart(2, '0')} seconds
			</p>
		{/if}
	</div>
</section>

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
		if (days === 0 && now.getHours() >= end) days = 7
		nextFriday.setDate(now.getDate() + days)
		nextFriday.setHours(start)
		nextFriday.setMinutes(0)
		nextFriday.setSeconds(0)
		nextFriday = nextFriday
	}

	$: pastryCountdown = nextFriday.getTime() - now.getTime()
	$: pastryTime = pastryCountdown < 1000
	$: s = Math.floor((pastryCountdown / 1000) % 60)
	$: m = Math.floor((pastryCountdown / (1000 * 60)) % 60)
	$: h = Math.floor((pastryCountdown / (1000 * 60 * 60)) % 24)
	$: d = Math.floor((pastryCountdown / (1000 * 60 * 60 * 24)))
	$: formattedStart = `${start.toString().padStart(2, '0')}:00`
	$: formattedEnd = `${end.toString().padStart(2, '0').replace('00', '12')}:00`

	$: title = pastryTime
		? `🥐🥐🥐 TIME!!!`
		: `🥐 minus 0${d}:${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`

	$: description = pastryTime
		? `
	🥐🎉🥐🎉🥐🎉🥐🎉🥐
	🥐🎉🥐🎉🥐🎉🥐🎉🥐
	🥐🎉🥐🎉🥐🎉🥐🎉🥐
	🥐🎉🥐🎉🥐🎉🥐🎉🥐
	🥐🎉🥐🎉🥐🎉🥐🎉🥐
	🥐🎉🥐🎉🥐🎉🥐🎉🥐
`
		: `
	🥐 Get ready for your pastry in:
	⏱️ ${d} day${d === 1 ? '' : 's'}
	⏱️ ${h} hour${h === 1 ? '' : 's'}
	⏱️ ${m} minute${m === 1 ? '' : 's'}
	⏱️ ${s} second${s === 1 ? '' : 's'}
`

	const startdown = () => start = Math.max(start - 1, 0)
	const startup = () => start = Math.min(start + 1, end - 1, 24)
	const enddown = () => end = Math.max(end - 1, start + 1)
	const endup = () => end = Math.min(end + 1, 24)

	onMount(() => {
		let interval = setInterval(() => now = new Date(), 1000)

		return () => clearInterval(interval)
	})
</script>

<style>
	section {display: flex; flex-direction: column; align-items: center; justify-content: center; flex-grow: 1;}
	h1 {font-size: max(7vh, 0.9rem); margin: 0;}
	div p {margin: 0; font-size: max(5vh, 0.9rem); display: flex; flex-direction: column; align-items: center;}
	.o {opacity: 0.2}
	footer {font-size: max(2vh, 0.9rem); display: flex; width: 100%; justify-content: center; align-items: center;}
	footer p {display: flex; align-items: center; padding: 2vh; margin: 0;}
	footer span {width: max(6.5vh, 3rem); text-align: center;}
	footer b {font-weight: normal; margin-right: 0.5vh;}
	h2 {font-size: inherit; margin: 0; padding: 2vh;}
	button {font-size: inherit;}
	@media (max-width: 800px) {
		footer {flex-direction: column;}
		h2 {padding: 0.5vh;}
		footer p {padding: 1vh;}
	}
</style>