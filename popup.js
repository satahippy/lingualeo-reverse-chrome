const loading = document.getElementById('loading');
const input = document.getElementById('input');
const currentConatiner = document.getElementById('current');
const answersConatiner = document.getElementById('answers');
const questionTxt = document.getElementById('question');
const showBtn = document.getElementById('show');
const answerTxt = document.getElementById('answer');
const nextBtn = document.getElementById('next');

const STATE_INIT = 'init';
const STATE_LOADING = 'loading';
const STATE_QUESTION = 'question';
const STATE_ANSWER = 'answer';

let state = STATE_INIT;
let currentQuestion = null;

const stateLoading = () => {
    state = STATE_LOADING;
    show(loading);
    hide(currentConatiner);
};

const stateQuestion = (original, translated) => {
    state = STATE_QUESTION;

    clear(input);
    hide(answerTxt);
    show(showBtn);

    questionTxt.innerHTML = translated;
    answerTxt.innerHTML = original;

    hide(loading);
    show(currentConatiner);

    input.focus();
};

const stateAnswer = () => {
    state = STATE_ANSWER;
    show(answerTxt);
    hide(showBtn);
};

const addAnswer = (original, translated, answer) => {
    const html = document.createElement('p');
    html.innerHTML = `<i>${translated}</i><br/><b>O:</b> ${original}<br/><b>Y:</b> ${answer}`;
    answersConatiner.appendChild(html);
};

const next = () => {
    if (currentQuestion) {
        addAnswer(currentQuestion.original, currentQuestion.translated, value(input));
    }
    stateLoading();
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {from: 'popup', subject: 'current'},
            current
        );
    });
};

const current = ({original, translated}) => {
    currentQuestion = {original, translated};
    stateQuestion(original, translated);
};

const answer = () => {
    stateAnswer();
};

const hide = (element) => {
    element.classList.add('hide');
};

const show = (element) => {
    element.classList.remove('hide');
};

const clear = (input) => {
    input.value = '';
};

const value = (input) => {
    return input.value;
};

nextBtn.addEventListener('click', next);
showBtn.addEventListener('click', answer);
input.addEventListener('keypress', (e) => {
    if (e.which === 13) {
        e.preventDefault();
        switch (state) {
            case STATE_QUESTION:
                answer();
                break;
            case STATE_ANSWER:
                next();
                break;
        }
    }
});
next();