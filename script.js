const button = document.querySelector('#button');
const mute = document.querySelector('#mute');
const audioElement = document.querySelector('#audio');

function audioMute() {
	audioElement.muted = !audioElement.muted;
	if (audioElement.muted) mute.innerHTML = '🔊';
	else mute.innerHTML = '🔇';
}

// disabled the button when the audio is playing
function toggleButton() {
	button.disabled = !button.disabled;
	if (button.disabled) {
		button.textContent = 'Playing...';
		mute.disabled = false;
	} else {
		button.textContent = 'Tell me a joke';
		mute.disabled = true;
	}
}

// paassing Joke to VoiceRSS API
function tellMe(joke) {
	const jokeString = joke.trim().replace(/ /g, '%20');
	VoiceRSS.speech({
		key: 'aae23756be8e419e98e022e521c5111f',
		src: jokeString,
		hl: 'en-ca',
		v: 'Linda',
		r: 1,
		c: 'mp3',
		f: '44khz_16bit_stereo',
		ssml: false,
	});
}

// Get Jokes from Joke API
async function getJokes() {
	const apiUrl = 'https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,sexist,explicit';

	try {
		const data = await (await fetch(apiUrl)).json();
		const joke = data.setup ? `${data.setup}... ${data.delivery}` : data.joke;

		// disabled the button while the audio is playing
		if (VoiceRSS) {
			tellMe(joke);
			if (joke) toggleButton();
		}
	} catch (error) {
		console.log('whoops', error);
	}
}

button.addEventListener('click', getJokes);
mute.addEventListener('click', audioMute);

// enabled the button when the audio playback is done
audioElement.addEventListener('ended', toggleButton);
