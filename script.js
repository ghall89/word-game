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

	const index = Math.floor(Math.random() * (data.length - 0) + 0);

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
		answerBtn.innerText = 'Next Clue';
	} else {
		answerInput.setAttribute('aria-invalid', 'true');
	}
});
