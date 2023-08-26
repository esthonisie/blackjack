const btnHit = document.querySelector('#btnHit');
const btnStand = document.querySelector('#btnStand');
const btnDeal = document.querySelector('#btnDeal');
const rounds = document.querySelector('.rounds');
const lives = document.querySelector('.lives');
const lifeTxt = document.querySelector('.lifeTxt');
const cardsPlayer = document.querySelector('.cardsPlayer');
const cardsDealer = document.querySelector('.cardsDealer');
const scorePlayer = document.querySelector('.scorePlayer');
const scoreDealer = document.querySelector('.scoreDealer');
const scoreDlrDeal = document.querySelector('.scoreDealer.hide');
const infoBox = document.querySelector('.containerInfo');
const blJackTitle = document.querySelector('.blJackTitle');
const allButtons = document.querySelectorAll('button');
const info = document.querySelectorAll('.info');

const playRound = () => {
  btnDeal.textContent === 'Replay' ?
  reset() : deal();
};

btnDeal.addEventListener('click', playRound);

const game =  {
  round: 0,
  lives: 0,
  reveal: false,
  infoStart: true,
  info1(txt) {
    info[0].textContent = txt;
  },
  info2(txt) {
    info[1].textContent = txt;
  },
  info3(txt) {
    info[2].textContent = txt;
  },
  info4(txt) {
    info[3].textContent = txt;
  },
};

const showInfoStartGame = () => {
  game.info2(
    `Beat the dealer with trying to draw a higher hand value,
    but don't go over 21 points!`); 
  game.info3("Push the DEAL button to start the game."); 
};

showInfoStartGame();
rounds.textContent = game.round;
lives.textContent = game.lives;

const arrPlayer = []; 
const arrDealer = [];
const arrDlrDeal = [];

const arrRotate = [
  -2.5, -2, -1.5, -1, -0.5, 0.05, 
  0.5, 1, 1.5, 2, 2.5
];

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

const arrRotaPlr = arrRotate.filter(() => true);
const arrRotaDlr = arrRotate.filter(() => true);
shuffle(arrRotaPlr);
shuffle(arrRotaDlr);

const checkCardQuant = (arr) => {
  if(arr.length <= 16) {
    resetArr(arr);
    for(const card of shuffle(arrCardDeck())) {
      arr.push(card);
    }
  }
};

const checkSizeInfoBox = () => {
  if(infoBox.style.height === "240px") {
    infoBox.style.transition = "0.6s ease-out";
    allButtons[0].style.transition = "0.6s ease-out";
    allButtons[1].style.transition = "0.6s ease-out";
    allButtons[2].style.transition = "0.6s ease-out";
  } else if(infoBox.style.height === "165px") {
    infoBox.style.transition = "0.15s ease-out";
    allButtons[0].style.transition = "0.3s ease-out";
    allButtons[1].style.transition = "0.3s ease-out";
    allButtons[2].style.transition = "0.3s ease-out";
  }
};

const setOpacityBJTitle = () => {
  blJackTitle.style.opacity = '1';
  blJackTitle.addEventListener("mouseover", () => {
    blJackTitle.style.opacity = '0';
  });
  blJackTitle.addEventListener("mouseout", () => {
    blJackTitle.style.opacity = '1';
  });
};

const moveDown = () => {
  infoBox.style.height = "165px";
  infoBox.style.marginTop = "30px";
  allButtons[0].style.marginTop = "50px";
  allButtons[1].style.marginTop = "50px";
  allButtons[2].style.marginTop = "50px";
};

const moveUp = () => {
  infoBox.style.height = "240px";
  infoBox.style.marginTop = "5px";
  allButtons[0].style.marginTop = "0px";
  allButtons[1].style.marginTop = "0px";
  allButtons[2].style.marginTop = "0px";
};

const substrLife = (nr) => {
  game.lives -= nr;
  if(game.lives < 0) {
    game.lives = 0;
  }
  lives.textContent = game.lives;
  if(game.lives === 1) {
    lifeTxt.textContent = 'life';
  } else lifeTxt.textContent = 'lives';
};

const addLife = (nr) => {
  game.lives += nr;
  lives.textContent = game.lives;
  if(game.lives !== 1) {
    lifeTxt.textContent = 'lives';
  }
};

const deal = () => {   
  checkSizeInfoBox();
  if(game.lives === 0) {
    addLife(5);
    game.round = 0;
  }
  game.round += 1;
  rounds.textContent = game.round;
  btnHit.addEventListener('click', hit); 
  btnStand.addEventListener('click', stand);
  btnDeal.removeEventListener('click', playRound);
  opacity(btnHit, 1);
  opacity(btnStand, 1);
  opacity(btnDeal, 0.3);
  if(game.infoStart === true) {
    moveUp();
  }
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
  showCards(cardsPlayer, arrPlayer, arrRotaPlr);
  showCards(cardsDealer, arrDlrDeal, arrRotaDlr);
  showScore();
  calcAceFixed(arrPlayer) === 21 || 
  calcAceFixed(arrDealer) === 21 ?
  showInfoBJack() : showInfoHit();
};

const hit = () => {
  checkSizeInfoBox();
  setOpacityBJTitle();
  if(calcPlayer() < 21) {
    const result = arrShuffled.splice(
      Math.floor(Math.random()*arrShuffled.length), 1
    );
    arrPlayer.push(result[0]);
    resetChild(cardsPlayer);
    showCards(cardsPlayer, arrPlayer, arrRotaPlr);
  }
  game.infoStart = false;
  moveDown();
  substrLife(1);
  showScore();
  showInfoHit();
};

const stand = () => {
  checkSizeInfoBox();
  setOpacityBJTitle();
  for(let i = 0; calcDealer() <= 16; i++) {
    const result = arrShuffled.splice(
      Math.floor(Math.random()*arrShuffled.length), 1
    );
    arrDealer.push(result[0]);
  }
  game.infoStart = false;
  moveDown();
  endGame();
  showInfoStand();
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
  const noAces = arrPerson.filter((arr) => arr.charAt(0) !== 'A');
  const noAcesPts = calcAceFixed(noAces);
  if(points > 21 && noAcesPts < 11) {
    allAces.length >= 2 ? points -= 10 : points += 0;
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

const showCards = (cardsPerson, arrPerson, arrRotaPerson) => {
  for(let i = 0; i < arrPerson.length; i++) {
    const imgCard = document.createElement('img');
    imgCard.className = 'imgCard';
    imgCard.src = `./images/${arrPerson[i]}.png`;
    imgCard.style.transform = `rotate(${arrRotaPerson[i]}deg)`
    cardsPerson.appendChild(imgCard);
  }
};

const showScore = () => {
  scorePlayer.textContent = `${calcPlayer()}`;
  if(game.reveal === false) {
    scoreDlrDeal.textContent = `${calcAceFixed(arrDlrDeal)}`;
  } else if(game.reveal === true) {
    scoreDealer.textContent = `${calcDealer()}`;
    resetChild(cardsDealer);  
    showCards(cardsDealer, arrDealer, arrRotaDlr);
  } 
};

const scoreTextPlr = () => {
  return parseInt(scorePlayer.textContent);
};

const scoreTextDlr = () => {
  return parseInt(scoreDealer.textContent);
};

const showInfoBJack = () => {
  moveDown();
  endGame();
  if(scoreTextPlr() === 21 && scoreTextDlr() !== 21) {
    game.info1("BLACKJACK");
    game.info2("Congratulations, you've won!!");
    game.info3("You get FIVE extra lives!");
    game.info4(''); 
    addLife(5);
  } else if(scoreTextDlr() === 21 && scoreTextPlr() !== 21) {
    game.info1('');
    game.info2("You're really out of luck.");
    game.info3("You lose two lives.");
    game.info4("BLACKJACK");    
    substrLife(2);
  } else if(scoreTextPlr() === 21 && scoreTextDlr() === 21) {
    game.info1("BLACKJACK");
    game.info2("No winners, no losers..."); 
    game.info3("And no extra lives.");
    game.info4("BLACKJACK");   
  }
}; 

const showInfoHit = () => {
  if(scoreTextPlr() < 21) {
    game.info1('');
    if(infoBox.style.height === "240px") {
      game.info2("One life for one card (push HIT). Don't want to buy more cards? Push STAND.");
      game.info3("Points of dealer 16 or lower? Than dealer must draw more cards.");
      blJackTitle.style.opacity = '0';
    } else if(infoBox.style.height === "165px") {
      if(scoreTextPlr() === 20) {
        game.info2(`Your score is 1 point under 21.`);
        game.info3("Hit or Stand?");
      } else {
        game.info2(`Your score is ${21 - scoreTextPlr()} points under 21.`);
        game.info3("Hit or Stand?");
      }
    }
    game.info4(''); 
  } else if(scoreTextPlr() === 21 && scoreTextDlr() !== 21) {
    endGame();
    const threeSevens = arrPlayer.filter((arr) => arr.charAt(0) === '7');
    if(threeSevens.length === 3) {
      game.info1("21!!!!");
      game.info2("THREE SEVENS!! Wow, lucky you!");    
      game.info3("You've won TEN extra lives!!");
      game.info4('');
      addLife(10);
    } else {
      game.info1("21!!!!");
      game.info2("Well done, you've won!");    
      game.info3("Three extra lives for you.");
      game.info4('');
      addLife(3);
    }   
  } else if(scoreTextPlr() === 22) {
    endGame();
    game.info1("BUST");
    game.info2("Almost 21, just one too many.");
    game.info3("You lose one life.");
    game.info4(''); 
    substrLife(1);
  } else {
    endGame();
    game.info1("BUST");
    game.info2("That's unfortunate, too many points!");
    game.info3("You lose two lives.");
    game.info4(''); 
    substrLife(2);
  }
};

const showInfoStand = () => {
  if(scoreTextDlr() <= 21) {
    if(scoreTextPlr() < scoreTextDlr()) {
      game.info1('');
      game.info2("The dealer has more points.");    
      game.info3("You lose one life.");
      game.info4(''); 
      substrLife(1);
    } else if(scoreTextPlr() === scoreTextDlr()) {
      game.info1("PUSH");
      game.info2("You have the same score as the dealer.");    
      game.info3("No extra lives for you.");
      game.info4("PUSH"); 
    } else if(scoreTextPlr() > scoreTextDlr()) {
      game.info1('');
      game.info2("You have more points than the dealer.");     
      game.info3("You've earned two extra lives!!");
      game.info4('');   
      addLife(2);
    }
  } else if(scoreTextDlr() > 21) {
    game.info1('');
    game.info2("The dealer has too many points.");    
    game.info3("You get one extra life.");
    game.info4("BUST");   
    addLife(1);
  }
};

const showInfoNextRound = () => {
  game.info1('');
  game.info4('');
  if(game.lives >= 10) {
    game.info2("You have more than plenty of lives.");  
    game.info3("Ready for the next round?");
  } else if(game.lives >= 5 && game.lives < 10) {
    game.info2("You have a decent amount of lives."); 
    game.info3("Up for playing the next round?");
  } else if(game.lives >= 2 && game.lives < 5) {
    game.info2("You have a small amount of lives."); 
    game.info3("Do you want to play another round?");
  } else if(game.lives === 1) {
    game.info2("You only have one life left."); 
    game.info3("Quit game? Or go for a gamble?");
  } else {
    game.info2("It's over, no more lives."); 
    game.info3("STOP playing this game and do something USEFUL.");
  }
};

const endGame = () => {
  game.reveal = true;
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

const reset = () => {
  checkCardQuant(arrShuffled);
  btnDeal.textContent = 'Deal';
  btnDeal.removeEventListener('click', reset);
  btnDeal.addEventListener('click', playRound);
  resetArr(arrPlayer);
  resetArr(arrDealer);
  resetArr(arrDlrDeal);
  shuffle(arrRotaPlr);
  shuffle(arrRotaDlr);
  game.reveal = false;
  scoreDealer.textContent = 0;
  scorePlayer.textContent = 0;
  resetChild(cardsPlayer);
  resetChild(cardsDealer);
  showInfoNextRound();
};