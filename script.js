// querySelectors
const clueSpan = document.querySelector('#clue');
const countSpan = document.querySelector('#count');
const scoreSpan = document.querySelector('#score');
const highScoreSpan = document.querySelector('#highScore');
const answerInput = document.querySelector('#answer');
const answerBtn = document.querySelector('#btn');

// current score
let currentScore = 0;

// global question object
const question = {
	clue: '',
	answer: ''
};

// array of used clue ids
const pastClueIds = [];

// select clue index and check if it's been used yet
const chooseClue = num => {
	let loop = true;
	let index;

	while (loop) {
		index = Math.floor(Math.random() * (num - 0) + 0);
		if (!pastClueIds.includes(index)) {
			loop = false;
		}
	}

	return index;
};

// get clue and write to DOM
const getClue = async () => {
	const rsp = await fetch('./clues.json');
	const data = await rsp.json();

	const index = chooseClue(data.length);

	pastClueIds.push();

	console.log(index);

	question.clue = data[index].clue;
	question.answer = data[index].answer;

	clueSpan.innerText = question.clue;
	countSpan.innerText = `${question.answer.length} Letters`;
};

getClue();

// button click logic
answerBtn.addEventListener('click', () => {
	if (answerBtn.innerText === 'Next Clue') {
		answerBtn.innerText = 'Answer!';
		answerInput.removeAttribute('aria-invalid');
		answerInput.value = '';
		getClue();
		return;
	}

	// determine if answer is correct
	// & display feedback
	if (answerInput.value.toLowerCase() === question.answer) {
		answerInput.setAttribute('aria-invalid', 'false');
		currentScore++;
		scoreSpan.innerText = currentScore;
		answerBtn.innerText = 'Next Clue';
	} else {
		answerInput.setAttribute('aria-invalid', 'true');
	}
});
