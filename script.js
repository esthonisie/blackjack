const btnHit = document.getElementById('btnHit');
const btnStand = document.getElementById('btnStand');
const btnDeal = document.getElementById('btnDeal');
const cardsPlayer = document.querySelector('.cardsPlayer');
const cardsDealer = document.querySelector('.cardsDealer');
const scorePlayer = document.querySelector('#scorePlayer');
const scoreDealer = document.querySelector('#scoreDealer');
const scoreDlrDeal = document.querySelector('#scoreDealer.hide');
const infoPlayer = document.querySelectorAll('.info.Player');
const allText = document.querySelectorAll(
  '.info.Player, #scoreDealer, #scorePlayer'
);

const playRound = () => {
  btnDeal.textContent === 'Replay' ?
  reset() : deal();
};

btnDeal.addEventListener('click', playRound);

const switches =  {
  reveal: false,
};

const arrPlayer = []; 
const arrDealer = [];
const arrDlrDeal = [];

const arrCardDeck = () => {
  const values = [
    'K','Q','J','A','2','3','4','5','6','7','8','9','T'
  ];
  const suits = ['-Clbs','-Dmds','-Hrts','-Spds'];
  const combi = [];
  for(const value of values) {
    for(const suit of suits) {
      combi.push(value + suit);
    }
  } return combi;
};

// Fisher-Yates algorithm
const shuffle = array => { 
  for (let i = array.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  } 
  return array; 
};

const arrShuffled = shuffle(arrCardDeck());

const checkCardQuant = (arr) => {
  if(arr.length <= 12) {
    resetArr(arr);
    for(const card of shuffle(arrCardDeck())) {
      arr.push(card);
    }
  }
};

const deal = () => {   
  btnHit.addEventListener('click', hit); 
  btnStand.addEventListener('click', stand);
  btnDeal.removeEventListener('click', playRound);
  opacity(btnHit, 1);
  opacity(btnStand, 1);
  opacity(btnDeal, 0.3);
  const result = [];
  for(let i = 0; i < 4; i++) {
    result.push(arrShuffled.splice(
      Math.floor(Math.random()*arrShuffled.length), 1)[0]
    );
  }
  arrPlayer.push(result[0],result[2]);
  arrDealer.push(result[1],result[3]);
  arrDlrDeal.push('Back');
  arrDlrDeal.push(result[3]);
  showCards(cardsPlayer, arrPlayer);
  showCards(cardsDealer, arrDlrDeal);
  showScore();
  calcAceFixed(arrPlayer) === 21 || 
  calcAceFixed(arrDealer) === 21 ?
  showInfoBJack() : showInfoHit();
};

const hit = () => {
  if(calcPlayer() < 21) {
    const result = arrShuffled.splice(
      Math.floor(Math.random()*arrShuffled.length), 1
    );
    arrPlayer.push(result[0]);
    resetChild(cardsPlayer);
    showCards(cardsPlayer, arrPlayer);
  }
  showScore();
  showInfoHit();
  checkCardQuant(arrShuffled);
};

const stand = () => {
  for(let i = 0; calcDealer() <= 16; i++) {
    const result = arrShuffled.splice(
      Math.floor(Math.random()*arrShuffled.length), 1
    );
    arrDealer.push(result[0]);
  }
  endGame();
  showInfoStand();
  checkCardQuant(arrShuffled);
};

const calcAceFixed = arrPerson => {
  let points = 0;
  for(const item of arrPerson) {
    const result = item.charAt(0);
    if(result === 'B') {
      points += 0;
    } else if(result === 'K' || result === 'Q' || result === 'J' || result === 'T') {
      points += 10;
    } else if(result === 'A' && points < 11) {
      points += 11;
    } else if(result === 'A' && points >= 11) {
      points += 1;
    } else points += parseInt(result);
  } return points;
};

const calcAceFluid = arrPerson => {
  let points = 0;
  for(const item of arrPerson) {
    const result = item.charAt(0);
    if(result === 'K' || result === 'Q' || result === 'J' || result === 'T') {
      points += 10;
    } else if(result === 'A') {
      continue;
    } else points += parseInt(result);
  }
  for(const item of arrPerson) {
    const result = item.charAt(0);
    if(result === 'A' && points < 11) {
      points += 11;
    } else if(result === 'A' && points >= 11) {
      points += 1;
    }
  } return points;
};

const calcAceLowScore = (arrPerson, points) => {
  const allAces = arrPerson.filter((arr) => arr.charAt(0) === 'A');
  if(points > 21 && (points - (allAces.length + 10) < 11)) {
    allAces.length >= 2 ? points -= 10 : points;
  } return points;
};

const calcPlayer = () => {
  return calcAceLowScore(arrPlayer, calcAceFluid(arrPlayer));
};

const calcDealer = () => {
  if(arrDealer[0].charAt(0) === 'A' || arrDealer[1].charAt(0) === 'A') {
    return calcAceFixed(arrDealer);
  } else return calcAceLowScore(arrDealer, calcAceFluid(arrDealer));
};

const showCards = (cardsPerson, arrPerson) => {
  for(let i = 0; i < arrPerson.length; i++) {
    const imgCard = document.createElement('img');
    imgCard.className = 'imgCard';
    imgCard.src = `./images/${arrPerson[i]}.png`;
    imgCard.style.zIndex = [i];
    cardsPerson.appendChild(imgCard);
  }
};

const showScore = () => {
  scorePlayer.textContent = `${calcPlayer()}`;
  if(switches.reveal === false) {
    scoreDlrDeal.textContent = `${calcAceFixed(arrDlrDeal)} + ?`;
  } else if(switches.reveal === true) {
    scoreDealer.textContent = `${calcDealer()}`;
    resetChild(cardsDealer);  
    showCards(cardsDealer, arrDealer);
  } 
};

const scoreTextPlr = () => {
  return parseInt(scorePlayer.textContent);
};

const scoreTextDlr = () => {
  return parseInt(scoreDealer.textContent);
};

const showInfoBJack = () => {
  endGame();
  if(scoreTextPlr() === 21 && scoreTextDlr() !== 21) {
    infoPlayer[0].textContent = "BLACKJACK";
    infoPlayer[1].textContent = "Je hebt gewonnen!!";
    infoPlayer[2].textContent = "Gefeliciteerd speler.";
    infoPlayer[3].textContent = "Nog een ronde?"; 
  } else if(scoreTextDlr() === 21 && scoreTextPlr() !== 21) {
    infoPlayer[0].textContent = "Helaas.";
    infoPlayer[1].textContent = "Je hebt verloren."; 
    infoPlayer[2].textContent = "BLACKJACK";
    infoPlayer[3].textContent = "Dealer heeft gewonnen.";    
  } else if(scoreTextPlr() === 21 && scoreTextDlr() === 21) {
    infoPlayer[0].textContent = "BLACKJACK";
    infoPlayer[1].textContent = "Helaas, ook de dealer heeft Blackjack."; 
    infoPlayer[2].textContent = "BLACKJACK";
    infoPlayer[3].textContent = "Het is gelijkspel geworden.";     
  }
}; 

const showInfoHit = () => {
  if(scoreTextPlr() < 21) {
    infoPlayer[0].textContent = "Nog een kaart? druk op 'Hit'.";
    infoPlayer[1].textContent = "Geen kaart erbij? druk op 'Pas'.";
    infoPlayer[2].textContent = "Dealer 16 punten of minder?";
    infoPlayer[3].textContent = "Kaart erbij voor dealer."; 
  } else if(scoreTextPlr() === 21 && scoreTextDlr() !== 21) {
    endGame();
    infoPlayer[0].textContent = "21 punten!";
    infoPlayer[1].textContent = "Je hebt gewonnen!!";    
    infoPlayer[2].textContent = "Gefeliciteerd speler.";
    infoPlayer[3].textContent = "Nog een ronde?";   
  } else if(scoreTextPlr() === 22) {
    endGame();
    infoPlayer[0].textContent = "'BUST', 1 punt teveel.";
    infoPlayer[1].textContent = "Je hebt verloren.";
    infoPlayer[2].textContent = "Goed gespeeld, maar helaas.";
    infoPlayer[3].textContent = "Volgende ronde beter?"; 
  } else {
    endGame();
    infoPlayer[0].textContent = `'BUST', ${(scoreTextPlr() - 21)} punten teveel.`;
    infoPlayer[1].textContent = "Je hebt verloren.";
    infoPlayer[2].textContent = "Dat is spijtig speler.";
    infoPlayer[3].textContent = "Revanche?"; 
  }
};

const showInfoStand = () => {
  if(scoreTextDlr() <= 21) {
    if(scoreTextPlr() < scoreTextDlr()) {
      infoPlayer[0].textContent = "Je hebt minder punten dan de dealer.";
      infoPlayer[1].textContent = "Je hebt verloren.";    
      infoPlayer[2].textContent = "Dat is spijtig speler.";
      infoPlayer[3].textContent = "Revanche?"; 
    } else if(scoreTextPlr() === scoreTextDlr()) {
      infoPlayer[0].textContent = "'STAND-OFF'.";
      infoPlayer[1].textContent = "Geen winnaars.";    
      infoPlayer[2].textContent = "Gelijkspel.";
      infoPlayer[3].textContent = "Geen verliezers."; 
    } else if(scoreTextPlr() > scoreTextDlr()) {
      infoPlayer[0].textContent = "Je hebt meer punten dan de dealer.";
      infoPlayer[1].textContent = "Je hebt gewonnen!";    
      infoPlayer[2].textContent = "Gefeliciteerd speler.";
      infoPlayer[3].textContent = "Nog een ronde?";   
    }
  } else if(scoreTextDlr() > 21) {
    infoPlayer[0].textContent = "De dealer heeft teveel punten.";
    infoPlayer[1].textContent = "Je hebt gewonnen!";    
    infoPlayer[2].textContent = "'BUST'";
    infoPlayer[3].textContent = "Gefeliciteerd speler.";   
  }
};

const endGame = () => {
  switches.reveal = true;
  showScore();
  btnDeal.textContent = 'Replay';
  btnDeal.addEventListener('click', reset);
  btnHit.removeEventListener('click', hit);
  btnStand.removeEventListener('click', stand);
  opacity(btnHit, 0.3);
  opacity(btnStand, 0.3);
  opacity(btnDeal, 1);
};

const opacity = (btn, value) => {
  btn.style.opacity = `${value}`;
};

const resetArr = arr => {
  arr.length = 0;
};

const resetChild = cardsPerson => {
  while(cardsPerson.firstChild) {
    cardsPerson.removeChild(cardsPerson.firstChild);
  }
};

const resetText = item => {
  item.textContent = '';
};

const reset = () => {
  btnDeal.textContent = 'Deal';
  btnDeal.removeEventListener('click', reset);
  btnDeal.addEventListener('click', playRound);
  resetArr(arrPlayer);
  resetArr(arrDealer);
  resetArr(arrDlrDeal);
  switches.reveal = false;
  for(const text of allText) {
    resetText(text);
  }
  resetChild(cardsPlayer);
  resetChild(cardsDealer);
};