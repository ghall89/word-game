const clueSpan = document.querySelector('#clue');
const countSpan = document.querySelector('#count');
const answerInput = document.querySelector('#answer');
const answerBtn = document.querySelector('#btn');

// global question object
const question = {
	clue: '',
	answer: ''
};

const getClue = async () => {
	const rsp = await fetch('./clues.json');
	const data = await rsp.json();

	question.clue = data[0].clue;
	question.answer = data[0].answer;

	clueSpan.innerText = question.clue;
	countSpan.innerText = `${question.answer.length} Letters`;
};

getClue();

// button click logic
answerBtn.addEventListener('click', () => {
	if (answerBtn.innerText === 'Next Clue') {
		alert('A thing should happen...');
		return;
	}

	// determine if answer is correct
	// & display feedback
	if (answerInput.value.toLowerCase() === question.answer) {
		answerInput.setAttribute('aria-invalid', 'false');
		answerBtn.innerText = 'Next Clue';
	} else {
		answerInput.setAttribute('aria-invalid', 'true');
	}
});
