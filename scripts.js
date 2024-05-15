const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let dealerHand = [];
let playerHand = [];

function createDeck() {
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
    dealerHand = [];
    playerHand = [];
    for (let i = 0; i < 2; i++) {
        playerHand.push(deck.pop());
    }
    playerHands.push([...playerHand]);
    for (let i = 0; i < 2; i++) {
        dealerHand.push(deck.pop());
    }
    renderHands();
    enableButtons();
}

function renderHands() {
    document.getElementById('dealer-hand').innerHTML = `<p>Dealer:</p><p>${dealerHand[0].value} of ${dealerHand[0].suit}</p>`;
    document.getElementById('player-hand').innerHTML = `<p>Player:</p>`;
    for (let card of playerHands[currentHandIndex()]) {
        document.getElementById('player-hand').innerHTML += `<p>${card.value} of ${card.suit}</p>`;
    }
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

    document.getElementById('dealer-hand').innerHTML += `<p>${dealerHand[1].value} of ${dealerHand[1].suit}</p>`;
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(deck.pop());
    }
    renderHands();
    checkWinner();
}

function split() {
    const newHand = [playerHands[currentHandIndex()].pop()];
    playerHands[currentHandIndex()].push(deck.pop());
    newHand.push(deck.pop());
    playerHands.push(newHand);
    renderHands();
    document.getElementById('split-button').disabled = true;
}

function calculateHandValue(hand) {
    let sum = 0;
    let hasAce = false;
    for (let card of hand) {
        if (card.value === 'A') {
            hasAce = true;
        }
        if (['J', 'Q', 'K'].includes(card.value)) {
            sum += 10;
        } else if (card.value !== 'A') {
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

function checkPlayerBust() {
    if (calculateHandValue(playerHands[currentHandIndex()]) > 21) {
        document.getElementById('message').innerText = 'Player busts! Dealer wins.';
        disableButtons();
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
    } else if (playerTotal < dealerTotal) {
        document.getElementById('message').innerText = 'Dealer wins!';
    } else {
        document.getElementById('message').innerText = 'It\'s a tie!';
    }

    disableButtons();
}

function disableButtons() {
    document.getElementById('hit-button').disabled = true;
    document.getElementById('stand-button').disabled = true;
    document.getElementById('split-button').disabled = true;
}

function enableButtons() {
    document.getElementById('hit-button').disabled = false;
    document.getElementById('stand-button').disabled = false;
    document.getElementById('split-button').disabled = false;
}

document.getElementById('deal-button').addEventListener('click', deal);
document.getElementById('hit-button').addEventListener('click', hit);
document.getElementById('stand-button').addEventListener('click', stand);
document.getElementById('split-button').addEventListener('click', split);

createDeck();
shuffleDeck();
renderHands();
