// querySelectors
const clueSpan = document.querySelector('#clue');
const countSpan = document.querySelector('#count');
const scoreSpan = document.querySelector('#score');
const highScoreSpan = document.querySelector('#highScore');
const answerInput = document.querySelector('#answer');
const answerBtn = document.querySelector('#btn');
const modal = document.querySelector('#modal');
const modalMessage = document.querySelector('#message');

// strings
const nextStr = 'Next Clue →';
const answerStr = 'Answer!';

//starting lives
let lives = 3;

// current score
let currentScore = 0;

// questions array
const questionsArr = [];

// rot13 decoder
function rot13(message) {
	return message.replace(/[a-z]/gi, letter =>
		String.fromCharCode(
			letter.charCodeAt(0) + (letter.toLowerCase() <= 'm' ? 13 : -13)
		)
	);
}

// retrieve high score from localStorage
let highScore = JSON.parse(localStorage.getItem('highScore'));
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
	scoreSpan.innerText = currentScore;
	answerInput.value = '';
	answerInput.removeAttribute('aria-invalid');
	for (let i = 1; i <= 3; i++) {
		document.getElementById(i).removeAttribute('style');
	}
	while (pastClueIds.length > 0) {
		pastClueIds.pop();
	}
	answerBtn.innerText = answerStr;
	getClue();
};

// game over logic
const gameOver = () => {
	if (!highScore || currentScore > highScore) {
		localStorage.setItem('highScore', JSON.stringify(currentScore));
		highScore = currentScore;
		highScoreSpan.innerText = highScore;
		modalMessage.innerText = 'New High Score!';
	} else {
		modalMessage.innerText = 'Play Again!';
	}
	openModal(modal);
	resetGameState();
};

// inform the player there are no more clues
const outOfClues = () => {
	modalMessage.innerText = 'Holy cow, you solved all the clues!';

	openModal(modal);
	resetGameState();
};

// get clue and write to DOM
const getClue = async () => {
	if (questionsArr.length === pastClueIds.length) {
		outOfClues();
	} else {
		const index = chooseClue(questionsArr.length);

		pastClueIds.push(index);

		question.clue = rot13(questionsArr[index].clue);
		question.answer = rot13(questionsArr[index].answer);

		clueSpan.innerText = question.clue;
		countSpan.innerText = `${question.answer.length} Letters`;
	}
};

// get data and start the game
const startGame = async () => {
	const rsp = await fetch('./res/clues.json');
	const data = await rsp.json();

	for (let i = 0; i < data.length; i++) {
		questionsArr.push(data[i]);
	}

	getClue();
};

// button click logic
answerBtn.addEventListener('click', () => {
	event.preventDefault();
	clueSpan.classList.remove('animate__animated', 'animate__fadeIn');

	if (answerBtn.innerText === nextStr) {
		answerBtn.innerText = answerStr;
		answerInput.removeAttribute('aria-invalid');
		clueSpan.classList.add('animate__animated', 'animate__fadeIn');
		answerInput.classList.remove(
			'animate__animated',
			'animate__heartBeat',
			'animate__headShake'
		);
		answerInput.value = '';
		getClue();
		return;
	}

	// determine if answer is correct
	// & display feedback
	if (answerInput.value.toLowerCase() === question.answer) {
		answerInput.setAttribute('aria-invalid', 'false');
		answerInput.classList.add('animate__animated', 'animate__heartBeat');
		currentScore++;
		scoreSpan.innerText = currentScore;
	} else {
		answerInput.setAttribute('aria-invalid', 'true');
		answerInput.classList.add('animate__animated', 'animate__headShake');
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
	answerBtn.innerText = nextStr;
	countSpan.removeAttribute('style');
});

// indicate to user when they meet/exceed character count
answerInput.addEventListener('input', () => {
	countSpan.classList.remove('animate__animated', 'animate__bounce');
	if (answerInput.value.length > question.answer.length) {
		countSpan.setAttribute('style', 'color: red');
		countSpan.classList.add('animate__animated', 'animate__bounce');
	} else if (answerInput.value.length === question.answer.length) {
		countSpan.setAttribute('style', 'color: green');
	} else {
		countSpan.removeAttribute('style');
	}
});
