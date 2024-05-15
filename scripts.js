// Define card suits and values
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let dealerHand = [];
let playerHand = [];
let playerHands = []; // Array to hold player's hands

// Create deck of cards
function createDeck() {
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
}

// Shuffle deck
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Deal cards to player and dealer
function deal() {
    dealerHand = [];
    playerHands = []; // Reset player's hands
    // Deal initial cards to player
    for (let i = 0; i < 2; i++) {
        playerHand.push(deck.pop());
    }
    playerHands.push([...playerHand]); // Add initial hand to player's hands array
    // Deal initial cards to dealer
    for (let i = 0; i < 2; i++) {
        dealerHand.push(deck.pop());
    }
    renderHands();
    enableButtons();
}

// Render hands
function renderHands() {
    document.getElementById('dealer-hand').innerHTML = `<p>Dealer:</p><p>${dealerHand[0].value} of ${dealerHand[0].suit}</p>`;
    document.getElementById('player-hand').innerHTML = `<p>Player:</p>`;
    for (let card of playerHands[currentHandIndex()]) {
        document.getElementById('player-hand').innerHTML += `<p>${card.value} of ${card.suit}</p>`;
    }
}

// Hit - add a card to the current hand
function hit() {
    playerHands[currentHandIndex()].push(deck.pop());
    renderHands();
    checkPlayerBust();
}

// Stand - end player's turn for the current hand
function stand() {
    // Move to the next hand or end the player's turn
    if (currentHandIndex() < playerHands.length - 1) {
        currentHandIndex(currentHandIndex() + 1);
        return;
    }

    // Reveal dealer's second card
    document.getElementById('dealer-hand').innerHTML += `<p>${dealerHand[1].value} of ${dealerHand[1].suit}</p>`;
    // Dealer's turn
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(deck.pop());
    }
    renderHands();
    checkWinner();
}

// Split - split player's hand into two separate hands
function split() {
    // Create a new hand with the second card from the player's hand
    const newHand = [playerHands[currentHandIndex()].pop()];
    // Add a new card to each hand
    playerHands[currentHandIndex()].push(deck.pop());
    newHand.push(deck.pop());
    // Add the new hand to the player's hands array
    playerHands.push(newHand);
    renderHands();
    // Disable the split button after splitting
    document.getElementById('split-button').disabled = true;
}

// Calculate hand value
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

// Check if player busts
function checkPlayerBust() {
    if (calculateHandValue(playerHands[currentHandIndex()]) > 21) {
        document.getElementById('message').innerText = 'Player busts! Dealer wins.';
        disableButtons();
    }
}

// Check winner
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

// Disable buttons after game ends
function disableButtons() {
    document.getElementById('hit-button').disabled = true;
    document.getElementById('stand-button').disabled = true;
    document.getElementById('split-button').disabled = true;
}

// Enable buttons at the start of the game
function enableButtons() {
    document.getElementById('hit-button').disabled = false;
    document.getElementById('stand-button').disabled = false;
    document.getElementById('split-button').disabled = false;
}

// Event listeners for buttons
document.getElementById('deal-button').addEventListener('click', deal);
document.getElementById('hit-button').addEventListener('click', hit);
document.getElementById('stand-button').addEventListener('click', stand);
document.getElementById('split-button').addEventListener('click', split);

// Initialize game
createDeck();
shuffleDeck();

// Initial render
renderHands();

// Function to get or set the current hand index
function currentHandIndex(index) {
    if (index !== undefined) {
        currentHandIndex.index = index;
    }
    return currentHandIndex.index || 0;
}
