const btnHit = document.querySelector("#btnHit");
const btnStand = document.querySelector("#btnStand");
const btnDeal = document.querySelector("#btnDeal");
const rounds = document.querySelector(".rounds");
const lives = document.querySelector(".lives");
const lifeTxt = document.querySelector(".lifeTxt");
const cardsPlayer = document.querySelector(".boxCardsPlr");
const cardsDealer = document.querySelector(".boxCardsDlr");
const scorePlayer = document.querySelector(".scorePlayer");
const scoreDealer = document.querySelector(".scoreDealer");
const scoreDlrDeal = document.querySelector(".scoreDealer.hide");
const infoBox = document.querySelector(".containerInfo");
const blJackTitle = document.querySelector(".blJackTitle");
const allButtons = document.querySelectorAll("button");
const info = document.querySelectorAll(".info");
const cardPlr = document.getElementsByClassName("cardPlr");
const cardDlr = document.getElementsByClassName("cardDlr");

// TODO: maak een aparte class aan voor onderstaand object
const game = {
  round: 0,
  lives: 0,
  reveal: false,
  intro: true,
  displayInfo(index, txt) {
    info[index - 1].textContent = txt;
  },
};

const showInfoStartGame = () => {
  game.displayInfo(2,
    `Beat the dealer with trying to draw a higher hand value,
    but don't go over 21 points!`
  );
  game.displayInfo(3, "Push the DEAL button to start the game.");
};

showInfoStartGame();
rounds.textContent = game.round;
lives.textContent = game.lives;

const arrPlayer = [];
const arrDealer = [];
const arrDlrDeal = [];

const arrCardDeck = () => {
  const values = [
    "K", "Q", "J", "A", "2", "3", "4", "5", "6", "7", "8", "9", "T"
  ];
  const suits = ["-Clbs", "-Dmds", "-Hrts", "-Spds"];
  const combi = [];
  for (const value of values) {
    for (const suit of suits) {
      combi.push(value + suit);
    }
  }
  return combi;
};

const arrRotate = [-2.5, -2, -1.5, -1, -0.5, 0.05, 0.5, 1, 1.5, 2, 2.5];
const arrRotaPlr = arrRotate.filter(() => true);
const arrRotaDlr = arrRotate.filter(() => true);

// Fisher-Yates algorithm
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const arrShuffled = shuffle(arrCardDeck());

const preloadImages = (arrRotaPerson, cardsPerson) => {
  for (let i = 0; i < arrRotate.length; i++) {
    const newCard = document.createElement("img");
    newCard.src = "./images/Empty.png";
    if (cardsPerson === cardsPlayer) {
      newCard.classList.add("cardEmpty", "cardPlr");
    } else newCard.classList.add("cardEmpty", "cardDlr");
    shuffle(arrRotaPerson);
    newCard.style.transform = `rotate(${arrRotaPerson[i]}deg)`;
    cardsPerson.appendChild(newCard);
  }
};

preloadImages(arrRotaPlr, cardsPlayer);
preloadImages(arrRotaDlr, cardsDealer);

const preloadDeck = () => {
  const arrTemp = arrCardDeck();
  arrTemp.push("Back");
  for (const card of arrTemp) {
    const cardTemp = document.createElement("img");
    cardTemp.src = `./images/${card}.png`;
    cardTemp.classList.add("cardFull", "cardPreload");
    cardsDealer.appendChild(cardTemp);
  }
};

preloadDeck();

const checkCardQuant = (arr) => {
  if (arr.length <= 16) {
    resetArr(arr);
    for (const card of shuffle(arrCardDeck())) {
      arr.push(card);
    }
  }
};

const setOpacityBJTitle = () => {
  blJackTitle.style.opacity = "1";
  blJackTitle.addEventListener("mouseover", () => {
    blJackTitle.style.opacity = "0";
  });
  blJackTitle.addEventListener("mouseout", () => {
    blJackTitle.style.opacity = "1";
  });
};

const moveDown = () => {
  infoBox.style.transition = "0.6s ease-out";
  infoBox.style.height = "110px";
  infoBox.style.marginTop = "30px";
  for (const button of allButtons) {
    button.style.transition = 
      "margin-top 0.6s ease-out, opacity 0.35s ease-out"
    ;
    button.style.marginTop = "50px";
  }
};

const moveUp = () => {
  infoBox.style.transition = "0.15s ease-out";
  infoBox.style.height = "180px";
  infoBox.style.marginTop = "5px";
  for (const button of allButtons) {
    button.style.transition = 
      "margin-top 0.3s ease-out, opacity 0.35s ease-out"
    ;
    button.style.marginTop = "0px";
  }
};

const substrLife = (nr) => {
  game.lives -= nr;
  if (game.lives < 0) {
    game.lives = 0;
  }
  lives.textContent = game.lives;
  if (game.lives === 1) {
    lifeTxt.textContent = "life";
  } else lifeTxt.textContent = "lives";
};

const addLife = (nr) => {
  game.lives += nr;
  lives.textContent = game.lives;
  if (game.lives !== 1) {
    lifeTxt.textContent = "lives";
  }
};

const deal = () => {
  if (game.lives === 0) {
    addLife(5);
    game.round = 0;
  }
  game.round += 1;
  rounds.textContent = game.round;
  btnHit.addEventListener("click", hit);
  btnStand.addEventListener("click", stand);
  btnDeal.removeEventListener("click", deal);
  opacity(btnHit, 1);
  opacity(btnStand, 1);
  opacity(btnDeal, 0.3);
  if (game.intro === true) {
    moveUp();
  }
  const result = [];
  for (let i = 0; i < 4; i++) {
    result.push(
      arrShuffled.splice(Math.floor(Math.random() * arrShuffled.length), 1)[0]
    );
  }
  arrPlayer.push(result[0], result[2]);
  arrDealer.push(result[1], result[3]);
  arrDlrDeal.push("Back");
  arrDlrDeal.push(result[3]);
  showCards(cardPlr, arrPlayer);
  showScore();
  if (calcAceFixed(arrPlayer) === 21 || calcAceFixed(arrDealer) === 21) {
    showInfoBJack();
  } else {
    showCards(cardDlr, arrDlrDeal);
    showInfoHit();
  }
};

btnDeal.addEventListener("click", deal);

const hit = () => {
  setOpacityBJTitle();
  if (scoreTextPlr() < 21 && game.lives > 0) {
    substrLife(1);
    const result = arrShuffled.splice(
      Math.floor(Math.random() * arrShuffled.length), 1
    );
    arrPlayer.push(result[0]);
    showCards(cardPlr, arrPlayer);
  }
  if (game.intro === true) {
    moveDown();
    game.intro = false;
  }
  showScore();
  showInfoHit();
};

const stand = () => {
  setOpacityBJTitle();
  for (let i = 0; calcDealer() <= 16; i++) {
    const result = arrShuffled.splice(
      Math.floor(Math.random() * arrShuffled.length), 1
    );
    arrDealer.push(result[0]);
  }
  if (game.intro === true) {
    moveDown();
    game.intro = false;
  }
  endGame();
  showInfoStand();
};

const calcAceFixed = (arrPerson) => {
  let points = 0;
  for (const item of arrPerson) {
    const result = item.charAt(0);
    if (result === "B") {
      points += 0;
    } else if (
      result === "K" ||
      result === "Q" ||
      result === "J" ||
      result === "T"
    ) {
      points += 10;
    } else if (result === "A" && points < 11) {
      points += 11;
    } else if (result === "A" && points >= 11) {
      points += 1;
    } else points += parseInt(result);
  }
  return points;
};

const calcAceFluid = (arrPerson) => {
  let points = 0;
  for (const item of arrPerson) {
    const result = item.charAt(0);
    if (
      result === "K" ||
      result === "Q" ||
      result === "J" ||
      result === "T"
    ) {
      points += 10;
    } else if (result === "A") {
      continue;
    } else points += parseInt(result);
  }
  for (const item of arrPerson) {
    const result = item.charAt(0);
    if (result === "A" && points < 11) {
      points += 11;
    } else if (result === "A" && points >= 11) {
      points += 1;
    }
  }
  return points;
};

const calcAceLowScore = (arrPerson, points) => {
  const allAces = arrPerson.filter((arr) => arr.charAt(0) === "A");
  const noAces = arrPerson.filter((arr) => arr.charAt(0) !== "A");
  const noAcesPts = calcAceFixed(noAces);
  if (points > 21 && noAcesPts < 11) {
    allAces.length >= 2 ? (points -= 10) : (points += 0);
  }
  return points;
};

const calcPlayer = () => {
  return calcAceLowScore(arrPlayer, calcAceFluid(arrPlayer));
};

const calcDealer = () => {
  if (arrDealer[0].charAt(0) === "A" || arrDealer[1].charAt(0) === "A") {
    return calcAceFixed(arrDealer);
  } else return calcAceLowScore(arrDealer, calcAceFluid(arrDealer));
};

const showCards = (cardPrsn, arrPerson) => {
  for (let i = 0; i < arrPerson.length; i++) {
    cardPrsn[i].classList.add("cardFull");
    cardPrsn[i].src = `./images/${arrPerson[i]}.png`;
  }
};

// TODO: -aangepast- ...Verder heb je alles goed geordend in functies. Maar
// qua leesbaarheid kan het nog wat beter, d.w.z. om je code te begrijpen moet je nu
// een lange lijst aan functies van boven naar beneden lezen. Dit zou m.i. nog iets
// beter geordend kunnen worden, door naast functies ook classes te gebruiken.
// De uitwerking is nu al goed genoeg, maar als je nog zin hebt zou je meer gebruik
// van classes (OOP) kunnen maken, door bijv. een Dealer, Player, Card, Game class
// te maken.
// In het geval van een OOP indeling kun je bijv. naast de functies ook alle consts
// die bovenaan je script staan in classes verdelen.

const scoreTextPlr = () => {
  const score = calcPlayer();
  return score;
};

const scoreTextDlr = () => {
  const score = calcDealer();
  return score;
};

const showScore = () => {
  scorePlayer.textContent = `${scoreTextPlr()}`;
  if (game.reveal === false) {
    scoreDlrDeal.textContent = `${calcAceFixed(arrDlrDeal)}`;
  } else if (game.reveal === true) {
    scoreDealer.textContent = `${scoreTextDlr()}`;
    showCards(cardDlr, arrDealer);
  }
};

const showInfoBJack = () => {
  moveDown();
  endGame();
  if (scoreTextPlr() === 21 && scoreTextDlr() !== 21) {
    game.displayInfo(1, "BLACKJACK");
    game.displayInfo(2, "Congratulations, you've won!!");
    game.displayInfo(3, "You get FIVE extra lives!");
    game.displayInfo(4, "");
    addLife(5);
  } else if (scoreTextDlr() === 21 && scoreTextPlr() !== 21) {
    game.displayInfo(1, "");
    game.displayInfo(2, "You're really out of luck.");
    game.displayInfo(3, "You lose three lives.");
    game.displayInfo(4, "BLACKJACK");
    substrLife(3);
    if (game.lives === 0) {
      game.displayInfo(3, "And zero lives! It's game over.");
    }
  } else if (scoreTextPlr() === 21 && scoreTextDlr() === 21) {
    game.displayInfo(1, "BLACKJACK");
    game.displayInfo(2, "No winners, no losers...");
    game.displayInfo(3, "And no extra lives.");
    game.displayInfo(4, "BLACKJACK");
  }
};

const showInfoHit = () => {
  if (scoreTextPlr() < 21) {
    game.displayInfo(1, "");
    if (game.intro === true) {
      game.displayInfo(2,
        `One life for one card (push HIT).
        Don't want to buy more cards? Push STAND.`
      );
      game.displayInfo(3,
        "Points of dealer 16 or lower? Than dealer must draw more cards."
      );
      blJackTitle.style.opacity = "0";
    } else if (game.intro === false) {
      if (game.lives === 0) {
        opacity(btnHit, 0.3);
        game.displayInfo(2, "Oh no, zero lives!");
        game.displayInfo(3, "Push 'STAND' for one more chance.");
      } else if (scoreTextPlr() === 20) {
        game.displayInfo(2, `Your score is 1 point under 21.`);
        game.displayInfo(3, "Hit or Stand?");
      } else {
        game.displayInfo(2,
          `Your score is ${21 - scoreTextPlr()} points under 21.`
        );
        game.displayInfo(3, "Hit or Stand?");
      }
    }
    game.displayInfo(4, "");
  } else if (scoreTextPlr() === 21 && scoreTextDlr() !== 21) {
    endGame();
    const threeSevens = arrPlayer.filter((arr) => arr.charAt(0) === "7");
    if (threeSevens.length === 3) {
      game.displayInfo(1, "21!!!!");
      game.displayInfo(2, "THREE SEVENS! Wow, lucky you!");
      game.displayInfo(3, "You've won TEN extra lives!!");
      game.displayInfo(4, "");
      addLife(10);
    } else {
      game.displayInfo(1, "21!!!!");
      game.displayInfo(2, "Well done, you've won!");
      game.displayInfo(3, "Three extra lives for you.");
      game.displayInfo(4, "");
      addLife(3);
    }
  } else if (scoreTextPlr() === 22) {
    endGame();
    game.displayInfo(1, "BUST");
    game.displayInfo(2, "Almost 21, just one too many.");
    game.displayInfo(3, "You lose one life.");
    game.displayInfo(4, "");
    substrLife(1);
    if (game.lives === 0) {
      game.displayInfo(2, "BUST and zero lives!");
      game.displayInfo(3, "It's over, no more rounds to play.");
    }
  } else {
    endGame();
    game.displayInfo(1, "BUST");
    game.displayInfo(2, "That's unfortunate, too many points!");
    game.displayInfo(3, "You lose two lives.");
    game.displayInfo(4, "");
    substrLife(2);
    if (game.lives === 0) {
      game.displayInfo(2, "BUST and zero lives!");
      game.displayInfo(3, "It's over, no more rounds to play.");
    }
  }
};

const showInfoStand = () => {
  if (scoreTextDlr() <= 21) {
    if (scoreTextPlr() < scoreTextDlr()) {
      game.displayInfo(1, "");
      game.displayInfo(2, "The dealer has more points.");
      game.displayInfo(3, "You lose one life.");
      game.displayInfo(4, "");
      substrLife(1);
      if (game.lives === 0) {
        game.displayInfo(3, "And it's game over.");
      }
    } else if (scoreTextPlr() === scoreTextDlr()) {
      game.displayInfo(1, "PUSH");
      game.displayInfo(2, "You have the same score as the dealer.");
      game.displayInfo(3, "No extra lives for you.");
      game.displayInfo(4, "PUSH");
      if (game.lives === 0) {
        game.displayInfo(3, "Still zero lives, it's game over.");
      }
    } else if (scoreTextPlr() > scoreTextDlr()) {
      game.displayInfo(1, "");
      game.displayInfo(2, "You have more points than the dealer.");
      game.displayInfo(3, "You've earned two extra lives!!");
      game.displayInfo(4, "");
      addLife(2);
    }
  } else if (scoreTextDlr() > 21) {
    game.displayInfo(1, "");
    game.displayInfo(2, "The dealer has too many points.");
    game.displayInfo(3, "You get one extra life.");
    game.displayInfo(4, "BUST");
    addLife(1);
  }
};

const showInfoNextRound = () => {
  game.displayInfo(1, "");
  game.displayInfo(4, "");
  if (game.lives >= 10) {
    game.displayInfo(2, "You have more than plenty of lives.");
    game.displayInfo(3, "Ready for the next round?");
  } else if (game.lives >= 5 && game.lives < 10) {
    game.displayInfo(2, "You have a decent amount of lives.");
    game.displayInfo(3, "Up for playing the next round?");
  } else if (game.lives >= 2 && game.lives < 5) {
    game.displayInfo(2, "You have a small amount of lives.");
    game.displayInfo(3, "Do you want to play another round?");
  } else if (game.lives === 1) {
    game.displayInfo(2, "You only have one life left.");
    game.displayInfo(3, "Quit game? Or go for a gamble?");
  } else {
    game.displayInfo(2, "STOP playing this game,");
    game.displayInfo(3, "and go do something USEFUL!");
  }
};

const endGame = () => {
  game.reveal = true;
  showScore();
  btnDeal.textContent = "Replay";
  btnDeal.addEventListener("click", reset);
  btnHit.removeEventListener("click", hit);
  btnStand.removeEventListener("click", stand);
  opacity(btnHit, 0.3);
  opacity(btnStand, 0.3);
  opacity(btnDeal, 1);
};

const opacity = (btn, value) => {
  btn.style.opacity = `${value}`;
};

const resetArr = (arr) => {
  arr.length = 0;
};

const resetCards = (cardPrsn, arrPerson, arrRotaPrsn) => {
  for (let i = 0; i < arrPerson.length; i++) {
    cardPrsn[i].classList.remove("cardFull");
    cardPrsn[i].src = `./images/Empty.png`;
  }
  shuffle(arrRotaPrsn);
  for (let i = 0; i < arrRotate.length; i++) {
    cardPrsn[i].style.transform = `rotate(${arrRotaPrsn[i]}deg)`;
  }
};

const reset = () => {
  checkCardQuant(arrShuffled);
  btnDeal.removeEventListener("click", reset);
  btnDeal.addEventListener("click", deal);
  btnDeal.textContent = "Deal";
  scoreDealer.textContent = 0;
  scorePlayer.textContent = 0;
  game.reveal = false;
  resetCards(cardPlr, arrPlayer, arrRotaPlr);
  resetCards(cardDlr, arrDealer, arrRotaDlr);
  resetArr(arrPlayer);
  resetArr(arrDealer);
  resetArr(arrDlrDeal);
  showInfoNextRound();
};