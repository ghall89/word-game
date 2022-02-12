const clueSpan = document.querySelector('#clue');
const answerInput = document.querySelector('#answer');
const answerBtn = document.querySelector('#btn');

const question = {
	clue: 'Brine-cured salmon that is lightly smoked.',
	answer: 'lox'
};

clueSpan.innerText = question.clue;

answerBtn.addEventListener('click', () => {
	if (answerInput.value.toLowerCase() === question.answer) {
		alert('Right!');
	} else {
		alert('Wrong!');
	}
});
