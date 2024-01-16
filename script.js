const grid = document.getElementById('grid');
const resultDisplay = document.getElementById('result');
const buttonReset = document.getElementById('reset');
const buttonChangeDifficulty = document.getElementById('change-difficulty');
const difficultySelect = document.getElementById('difficulty');
const content = document.getElementById('content');
const menu = document.getElementById('menu');
const buttonEasy = document.getElementById('easy');
const buttonMedium = document.getElementById('medium');
const buttonHard = document.getElementById('hard');

let cardsChosen = [];
let cardsChosenId = [];
let cardsWon = [];
let mostrandoCarta = false;
let cardArray = [];
let difficulty = 0;

buttonReset.addEventListener('click', resetGame);
buttonChangeDifficulty.addEventListener('click', changeDifficulty);

buttonEasy.addEventListener('click', () => {
    selectDifficulty(0)
    grid.style.gridTemplateColumns = "1fr 1fr 1fr 1fr";

})

buttonMedium.addEventListener('click', () => {
    selectDifficulty(1)
    grid.style.gridTemplateColumns = "1fr 1fr 1fr 1fr";

})

buttonHard.addEventListener('click', () => {
    selectDifficulty(2)
    grid.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr 1fr";
})

function selectDifficulty(difficultySelected) {
    difficulty = difficultySelected
    content.style.display = 'flex';
    menu.style.display = 'none';
    cargarDatos();
}

function changeDifficulty() {
    content.style.display = 'none';
    menu.style.display = 'flex';
    buttonReset.style.display = 'none';
    buttonChangeDifficulty.style.display = 'none';
    resultDisplay.style.display = 'none';
    grid.style.display = 'grid';
    cardsWon = [];
}

async function cargarDatos() {
    try {
        const respuesta = await fetch('cartas.json');
        cardArray = await respuesta.json();
        fillBoardDifficulty();
        createBoard();
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

function createBoard() {
    grid.innerHTML = '';
    let cont = 0
    cardArray.sort(() => 0.5 - Math.random())
    fillBoard();
    cont++

}

function fillBoardDifficulty() {
    let cardsQuant = 0;
    switch (difficulty) {
        case 0:
            cardsQuant = 6;
            difficultySelect.innerText = 'Easy';
            break;
        case 1:
            cardsQuant = 8;
            difficultySelect.innerText = 'Medium';
            break;
        case 2:
            cardsQuant = cardArray.length;
            difficultySelect.innerText = 'Hard';
            break;
    }
    cardArray = cardArray.slice(0, cardsQuant);
    cardArray = [...cardArray, ...cardArray];
}

function fillBoard() {

    for (let i = 0; i < cardArray.length; i++) {
        const card = document.createElement('img');
        card.setAttribute('src', 'images/blank.png');
        card.setAttribute('data-id', i);
        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    }
}

function resetGame() {
    resultDisplay.textContent = '';
    buttonReset.style.display = 'none';
    buttonChangeDifficulty.style.display = 'none';
    grid.style.display = 'grid';
    cardsWon = [];
    createBoard();
}

function flipCard() {
    if (mostrandoCarta) {
        return;
    }
    const cardId = this.getAttribute('data-id');
    cardsChosen.push(cardArray[cardId].name);
    cardsChosenId.push(cardId);
    this.setAttribute('src', cardArray[cardId].img);
    this.removeEventListener('click', flipCard);
    if (cardsChosen.length === 2) {
        mostrandoCarta = true;
        setTimeout(checkForMatch, 500);
    }
}

function checkForMatch() {
    const cards = document.querySelectorAll('img');
    const firstCardSelectedId = cardsChosenId[0];
    const secondCardSelectedId = cardsChosenId[1];

    if (cardsChosen[0] === cardsChosen[1]) {
        cards[firstCardSelectedId].setAttribute('src', 'images/white.png');
        cards[secondCardSelectedId].setAttribute('src', 'images/white.png');
        cards[firstCardSelectedId].style.cursor = 'default';
        cards[secondCardSelectedId].style.cursor = 'default';
        cards[firstCardSelectedId].style.opacity = '1';
        cards[secondCardSelectedId].style.opacity = '1';
        cardsWon.push(cardsChosen);
    } else {
        cards[firstCardSelectedId].setAttribute('src', 'images/blank.png');
        cards[secondCardSelectedId].setAttribute('src', 'images/blank.png');
        cards[firstCardSelectedId].addEventListener('click', flipCard);
        cards[secondCardSelectedId].addEventListener('click', flipCard);
    }

    cardsChosen = [];
    cardsChosenId = [];
    mostrandoCarta = false;

    if (cardsWon.length === cardArray.length / 2) {
        resultDisplay.style.display = 'block';
        resultDisplay.textContent = 'Congratulations! You found them all!';
        buttonReset.style.display = 'inline-block';
        buttonChangeDifficulty.style.display = 'inline-block';
        grid.style.display = 'none';
    }
}
