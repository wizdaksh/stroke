const word = "apple banana orange grape kiwi strawberry blueberry watermelon pineapple mango " +
    "elephant giraffe lion zebra rhinoceros hippopotamus cheetah tiger kangaroo koala " +
    "computer keyboard mouse monitor printer laptop tablet software hardware internet " +
    "mountain ocean river lake valley canyon desert forest island volcano " +
    "sunflower rose daisy tulip lily orchid carnation daffodil poppy marigold " +
    "football soccer basketball tennis baseball volleyball golf hockey swimming cycling " +
    "pizza burger pasta sushi ice cream cake chocolate cookie popcorn pancake " +
    "happy sad angry excited surprised bored confused relaxed energetic curious " +
    "book movie music art dance theater poetry photography sculpture painting " +
    "science math history geography language physics chemistry biology astronomy psychology " +
    "unicorn dragon mermaid wizard fairy ghost vampire werewolf witch sorcerer a ability able house car tree love peace " + 
    "hope dream smile but so when where why who what okay under which is great dentist rotary gear mouse mice lemon tomato yarn barn fart ugly " +
    "cool query xenon gas radio active kowala cat dog daksh mom dad brother sister pet mascot cruel ponder porsche " + 
    "super hyper mega micro wash dirty stinky sexy this is cs50 david milano computer phone key board pencil pen desk house people person " + 
    "wifi flat curvy curve fat skinny flush striaght dark light loud quiet bleed tomorrow land anime manga draw type minimal monkey "
    "harvard yale institute of tech brown white black red green purple yellow blue magenta beam plane tower cute furry like comment subscribe channel money " +
    "currency intelligence english artificial fake metal synthetic division calculus polymorphis infinity limit integral rich poor " +
    "wild tame calm laugh cry we us them they and for thus play lay stay way day nay nor pour ho low tow no down frown town city country regime government "; // And so on for the rest of the words

const words = word.split(' ');
const wordsCount = words.length;
const gameTime = 30 * 1000;
window.timer = null;
window.gameStart = null;

function addClass(el,name) {
    el.className += ' '+name;
}
function removeClass(el,name) {
    el.className = el.className.replace(name,'');
}

function randomWord() {
    const randomIndex = Math.ceil(Math.random() * wordsCount);
    return words[randomIndex - 1];
}

function formatWord(word) {
    return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;

}


function newGame() {
    document.getElementById('words').innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.getElementById('words').innerHTML += formatWord(randomWord());        
    }
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');
    window.timer = null;
}


function getWpm() {
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedWordIndex = words.indexOf(lastTypedWord);
    const typedWords = words.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        const wrongLetters = letters.filter(letter => letter.className.includes('wrong'));
        const correctLetters = letters.filter(letter => letter.className.includes('correct'));
        return wrongLetters.length === 0 && correctLetters.length === letters.length;
    });
    console.log(correctWords.length * 2);
    return correctWords.length * 2;
}


function gameOver() {
    clearInterval(window.timer);
    addClass(document.getElementById('game'), 'over');
    document.getElementById('info').innerHTML = `${getWpm()} WPM`;
    
}


document.getElementById('game').addEventListener('keydown', ev => {
    const key = ev.key;
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter?.innerHTML || ' ';
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;
    
    
    
    if (document.querySelector('#game.over')) {
        return;
    }

    console.log(key, expected);
    
    if (!window.timer && isLetter) {
        window.timer = setInterval(() => {
            if (!window.gameStart) {
                window.gameStart = (new Date()).getTime();
            }
            const currentTime = (new Date()).getTime();
            const msPassed = currentTime - window.gameStart;
            const sPassed = Math.round(msPassed / 1000);
            const sLeft = 30 - sPassed;
            if (sLeft <= 0) {
                gameOver()
                return;
            }
            document.getElementById('info').innerHTML = sLeft + 's';
        }, 1000);
    }

    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key === expected ? 'correct' : 'wrong');
            removeClass(currentLetter, 'current');
            if (currentLetter.nextSibling){
                addClass(currentLetter.nextSibling, 'current');
            }
        }   else{
            const incorrectLetter = document.createElement('span');
            incorrectLetter.innerHTML = key;
            incorrectLetter.className = 'letter wrong extra';
            currentWord.appendChild(incorrectLetter);
        }
    }

    if (isSpace) {
        if (expected !== ' ') {
            const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
            lettersToInvalidate.forEach(letter => {
                addClass(letter, 'wrong');
            });
        }
        removeClass(currentWord, 'current');
        addClass(currentWord.nextSibling, 'current');
        if (currentLetter) {
            removeClass(currentLetter, 'current');
        }
        addClass(currentWord.nextSibling.firstChild, 'current');
    }

    if (isBackspace){
        if (currentLetter && isFirstLetter){
            
            removeClass(currentWord, 'current');
            addClass(currentWord.previousSibling, 'current');
            removeClass(currentLetter, 'current');
            addClass(currentWord.previousSibling.lastChild, 'current');
            removeClass(currentWord.previousSibling.lastChild, 'wrong');
            removeClass(currentWord.previousSibling.lastChild, 'correct');
        }
        if (currentLetter && !isFirstLetter){
            removeClass(currentLetter, 'current');
            addClass(currentLetter.previousSibling, 'current');
            removeClass(currentLetter.previousSibling, 'wrong');
            removeClass(currentLetter.previousSibling, 'correct');
        }   
        if (!currentLetter){
            addClass(currentWord.lastChild, 'current');
            removeClass(currentWord.lastChild, 'wrong');
            removeClass(currentWord.lastChild, 'correct');
        }
    }

    // moves words up
    if (currentWord.offsetTop > 45){
        const words = document.getElementById('words'); 
        const margin = parseInt(words.style.marginTop || '0px');
        words.style.marginTop = margin - 35 + 'px';
        console.log('hi');
    }


    //move cursor
    // const cursorPosition = nextLetter.getBoundingClientRect();
    const nextLetter = document.querySelector('.letter.current');
    const cursor = document.getElementById('cursor');
    // cursor.style.left =(cursorPosition).offsetLeft + 2 +'px';
    cursor.style.top = (nextLetter).offsetTop + 4 + 'px';
    cursor.style.left = (nextLetter).offsetLeft + 2 +'px';
    
}); // Add closing parenthesis here

const myDiv = document.getElementById('retake');
retake.addEventListener('click', function() {
    location.reload();
})

newGame();