const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

let deck = [];
let dealerHand = [];
let playerHand = [];
let playerHands = [[]];
let playerMoney = 1000;
let currentBet = 0;
let dealerRevealed = false;

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function deal() {
    const betInput = document.getElementById('bet-amount');
    const dealButton = document.getElementById('deal-button');

    currentBet = parseInt(betInput.value);
    if (currentBet > playerMoney) {
        document.getElementById('message').innerText = 'Insufficient funds!';
        return;
    }
    
    playerMoney -= currentBet;
    updateMoneyDisplay();

    betInput.disabled = true;
    dealButton.disabled = true;

    createDeck();
    shuffleDeck();
    dealerHand = [];
    playerHand = [];
    playerHands = [[]];
    dealerRevealed = false;

    for (let i = 0; i < 2; i++) {
        playerHand.push(deck.pop());
    }
    playerHands[0] = playerHand;

    for (let i = 0; i < 2; i++) {
        dealerHand.push(deck.pop());
    }

    renderHands();
    enableButtons();
    document.getElementById('message').innerText = '';
}

function renderHands() {
    const dealerHandDiv = document.getElementById('dealer-hand');
    const playerHandDiv = document.getElementById('player-hand');

    dealerHandDiv.innerHTML = `<p>Dealer:</p>`;
    dealerHandDiv.innerHTML += `<img src="${getCardImage(dealerHand[0])}" alt="${dealerHand[0].value} of ${dealerHand[0].suit}">`;
    if (dealerRevealed) {
        for (let i = 1; i < dealerHand.length; i++) {
            dealerHandDiv.innerHTML += `<img src="${getCardImage(dealerHand[i])}" alt="${dealerHand[i].value} of ${dealerHand[i].suit}">`;
        }
        dealerHandDiv.innerHTML += `<div class="hand-info" id="dealer-value">${calculateHandValue(dealerHand)}</div>`;
    } else {
        dealerHandDiv.innerHTML += `<img src="back_of_card.png" alt="Back of card">`;
        dealerHandDiv.innerHTML += `<div class="hand-info" id="dealer-value">${calculateCardValue(dealerHand[0])}</div>`;
    }

    playerHandDiv.innerHTML = `<p>Player:</p>`;
    for (let card of playerHands[currentHandIndex()]) {
        playerHandDiv.innerHTML += `<img src="${getCardImage(card)}" alt="${card.value} of ${card.suit}">`;
    }
    playerHandDiv.innerHTML += `<div class="hand-info">${calculateHandValue(playerHands[currentHandIndex()])}</div>`;
}

function getCardImage(card) {
    const value = card.value.toLowerCase();
    const suit = card.suit.toLowerCase();
    if (['jack', 'queen', 'king', 'ace'].includes(value)) {
        return `${value}_of_${suit}.png`;
    }
    return `${card.value.toLowerCase()}_of_${suit}.png`;
}

function calculateCardValue(card) {
    if (['Jack', 'Queen', 'King'].includes(card.value)) {
        return 10;
    } else if (card.value === 'Ace') {
        return 11;
    } else {
        return parseInt(card.value);
    }
}

function calculateHandValue(hand) {
    let sum = 0;
    let hasAce = false;
    for (let card of hand) {
        if (card.value === 'Ace') {
            hasAce = true;
        }
        if (['Jack', 'Queen', 'King'].includes(card.value)) {
            sum += 10;
        } else if (card.value !== 'Ace') {
            sum += parseInt(card.value);
        }
    }
    if (hasAce) {
        if (sum + 11 <= 21) {
            sum += 11;
        } else {
            sum += 1;
        }
    }
    return sum;
}

function hit() {
    playerHands[currentHandIndex()].push(deck.pop());
    renderHands();
    checkPlayerBust();
}

function stand() {
    if (currentHandIndex() < playerHands.length - 1) {
        currentHandIndex(currentHandIndex() + 1);
        return;
    }

    dealerRevealed = true;
    renderHands();
    enableDealButton();

    setTimeout(dealerTurn, 1000);
}

function dealerTurn() {
    if (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(deck.pop());
        renderHands();
        setTimeout(dealerTurn, 1000);
    } else {
        checkWinner();
    }
}

function checkPlayerBust() {
    if (calculateHandValue(playerHands[currentHandIndex()]) > 21) {
        dealerRevealed = true;
        renderHands();
        document.getElementById('message').innerText = 'Player busts! Dealer wins.';
        disableButtons();
        enableDealButton();
    }
}

function currentHandIndex(index) {
    if (index !== undefined) {
        currentHandIndex.index = index;
    }
    return currentHandIndex.index || 0;
}

function checkWinner() {
    const playerTotal = calculateHandValue(playerHands[currentHandIndex()]);
    const dealerTotal = calculateHandValue(dealerHand);

    if (dealerTotal > 21 || playerTotal > dealerTotal) {
        document.getElementById('message').innerText = 'Player wins!';
        playerMoney += currentBet * 2;
    } else if (playerTotal < dealerTotal) {
        document.getElementById('message').innerText = 'Dealer wins!';
    } else {
        document.getElementById('message').innerText = 'It\'s a tie!';
        playerMoney += currentBet;
    }

    updateMoneyDisplay();
    disableButtons();
}

function updateMoneyDisplay() {
    document.getElementById('money-amount').innerText = playerMoney;
}

function disableButtons() {
    document.getElementById('hit-button').disabled = true;
    document.getElementById('stand-button').disabled = true;}

function enableButtons() {
    document.getElementById('hit-button').disabled = false;
    document.getElementById('stand-button').disabled = false;
}

function disableDealButton() {
    document.getElementById('deal-button').disabled = true;
}

function enableDealButton() {
    document.getElementById('deal-button').disabled = false;
    document.getElementById("bet-amount").removeAttribute("disabled");
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('play-button').addEventListener('click', () => {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        renderHands();
    });

    document.getElementById('deal-button').addEventListener('click', deal);
    document.getElementById('hit-button').addEventListener('click', hit);
    document.getElementById('stand-button').addEventListener('click', stand);
    document.getElementById('player-hand').innerHTML = `<p>Player:</p><div class="hand-info"></div>`;

    createDeck();
    shuffleDeck();
    renderHands();
});
