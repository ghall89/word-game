// querySelectors
const clueSpan = document.querySelector('#clue');
const countSpan = document.querySelector('#count');
const scoreSpan = document.querySelector('#score');
const highScoreSpan = document.querySelector('#highScore');
const answerInput = document.querySelector('#answer');
const answerBtn = document.querySelector('#btn');
const modal = document.getElementsByTagName('dialog');

//starting lives
let lives = 3;

// current score
let currentScore = 0;

// retrieve high score from localStorage
const highScore = JSON.parse(localStorage.getItem('highScore'));
if (highScore) {
	highScoreSpan.innerText = highScore;
}

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

// resets game to initial state and begins new game
const resetGameState = () => {
	currentScore = 0;
	lives = 3;
	answerInput.value = '';
	answerInput.removeAttribute('aria-invalid');
	for (let i = 1; i <= 3; i++) {
		document.getElementById(i).removeAttribute('style');
	}

	getClue();
};

// game over logic
const gameOver = () => {
	if (highScore && currentScore > highScore) {
		localStorage.setItem('highScore', JSON.stringify(currentScore));
		highScoreSpan.innerText = currentScore;
	}
	alert('Game Over');
	resetGameState();
	// modal.removeProperty('closed');
	// modal.setProperty('open');
};

// get clue and write to DOM
const getClue = async () => {
	const rsp = await fetch('./clues.json');
	const data = await rsp.json();

	const index = chooseClue(data.length);

	pastClueIds.push(index);

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
		if (lives >= 1) {
			document.getElementById(lives).style.animation =
				'lose-life 0.5s linear 1 forwards';
		}
		lives = lives - 1;
		if (lives === 0) {
			setTimeout(() => {
				gameOver();
			}, 1000);
		}
	}
});
