
let textArea = document.getElementById('text-area');
let newGameButton = document.getElementById('new-game-button');
let hitButton = document.getElementById('hit-button');
let stayButton = document.getElementById('stay-button');

let deck = [];

let playerCards = [];
let dealerCards = [];

let gameOver = false;
let playerWon = false;
let isFirstHand = true;

let stayButtonPressed = false;
let dealerCanHit = false;

hitButton.style.display = 'none';
stayButton.style.display = 'none';

newGameButton.addEventListener('click', function(){
  deck.length = 0;
  playerCards.length = 0;
  dealerCards.length = 0;
  gameOver = false;
  playerWon = false;
  stayButtonPressed = false;
  dealerCanHit = false;
  isFirstHand = true;

  newGameButton.style.display = 'none';
  hitButton.style.display = 'inline';
  stayButton.style.display = 'inline';
  
  deck = createShuffledDeck();
  dealStartingCards();
  update();
})

hitButton.addEventListener('click', function(){
  isFirstHand = false;
  playerCards.push(getNextCard());
  update();
})

stayButton.addEventListener('click', function(){
  stayButtonPressed = true;
  dealerCanHit = fetchScore(dealerCards) < 17
  while(dealerCanHit){
    dealerCards.push(getNextCard());
    dealerCanHit = fetchScore(dealerCards) < 17
    update();
  }
})

function dealStartingCards() {
  playerCards.push(getNextCard());
  playerCards.push(getNextCard());
  dealerCards.push(getNextCard());
}

function createShuffledDeck() {
  let deck = createDeck();
  shuffleDeck(deck);
  return deck;
}
function createDeck() {
  let suits = [
  'Hearts',
  'Diamonds',
  'Clubs',
  'Spades'
];
let ords = [
  'Ace',
  'King',
  'Queen',
  'Jack',
  'Ten',
  'Nine',
  'Eight',
  'Seven',
  'Six',
  'Five',
  'Four',
  'Three',
  'Two'
];
  let deck = [];
  for (let ord of ords) {
    for (let suit of suits) {
      let card = {
        value: ord,
        suit: suit
      };
      deck.push(card);
    }
  }
  return deck;
}

function shuffleDeck(cards) {
  for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
    let randomIndex = Math.trunc(Math.random() * cards.length);
    let tmpCard = cards[randomIndex];
    cards[randomIndex] = cards[cardIndex];
    cards[cardIndex] = tmpCard;
  }
}
    
function getCardString(card) {
  return card.value + " of " + card.suit;
}

function getNextCard() {
  return deck.shift();
}

function update() {
  let dealerHandString = fetchHandString(dealerCards, 'Dealer');
  let playerHandString = fetchHandString(playerCards, 'Player');
  textArea.innerText = dealerHandString + playerHandString;
  getResult();
}

function fetchHandString(cards, whoItIs){
  let cardsString = '';
  for(let card of cards){
    cardsString += getCardString(card) + '\n';
  }
  return whoItIs + " has:\n" + cardsString +
         "(score: " + fetchScore(cards) + ")\n\n";
}

function fetchScore(cards){
  let valueMap = {
    Ace: 1,
    King:10,
    Queen:10,
    Jack:10,
    Ten:10,
    Nine:9,
    Eight:8,
    Seven:7,
    Six:6,
    Five:5,
    Four:4,
    Three:3,
    Two:2
  }
  let values = [];
  let hasAnAce = getHasAnAce(cards);
  
  for(let card of cards){
      values.push(valueMap[card.value]);
  }
  let score = values.reduce(function(total, next){
    return total + next;
  });
  if(hasAnAce && score <= 11){
    score+=10;
  }
  return score;
}

function getHasAnAce(cards){
    for(let card of cards){
      if (card.value === 'Ace'){
        return true;
      }
    }
    return false;
}

function getResult(){
  let playerScore = fetchScore(playerCards);
  let dealerScore = fetchScore(dealerCards);
  if(stayButtonPressed){
    if(dealerScore > playerScore && dealerScore <= 21){
      showResult("Dealer wins!");
    }else if((dealerScore < playerScore || dealerScore > 21) && !dealerCanHit){
      showResult("Player wins!");
    }else{
      showResult("Push!");
    }
  }else{
    if(playerScore === 21 && isFirstHand){
      showResult("Blackjack! Player wins!");
    }
    if(playerScore > 21){
      showResult("Dealer wins!");
    }
  }
}

function showResult(message){
  textArea.innerText += message;
  newGameButton.style.display = 'inline';
  hitButton.style.display = 'none';
  stayButton.style.display = 'none';
}


