const btnHit = document.getElementById('btnHit');
const btnStand = document.getElementById('btnStand');
const btnReplay = document.getElementById('btnReplay');
const cardsPlayer = document.querySelector('.cards.Player');
const cardsDealer = document.querySelector('.cards.Dealer');
const scorePlayer = document.querySelector('#scorePlayer');
const scoreDealer = document.querySelector('#scoreDealer');
const infoPlayer = document.querySelectorAll('.info.Player');
const infoDealer = document.querySelectorAll('.info.Dealer');

btnReplay.addEventListener('click', playRound);

function playRound() {
 
  const cardName = {
    Clbs: 'Klaveren', // ' of Clubs'
    Dmds: 'Ruiten', // ' of Diamonds'
    Hrts: 'Harten', // ' of Hearts'
    Spds: 'Schoppen', // ' of Spades'
    A: 'aas', // 'Ace'
    J: 'boer', // 'Jack'
    K: 'heer', // 'King'
    Q: 'vrouw', // 'Queen'
    T: 'tien', // 'Ten'
    2: 'twee', // 'Two'
    3: 'drie', // 'Three'
    4: 'vier', // 'Four'
    5: 'vijf', // 'Five'
    6: 'zes', // 'Six'
    7: 'zeven', // 'Seven'
    8: 'acht', // 'Eight'
    9: 'negen'  // 'Nine'
  };
  const arrCardDeck = [
    'K-Clbs', 'Q-Clbs', 'J-Clbs', '2-Clbs', '3-Clbs', '4-Clbs', '5-Clbs', '6-Clbs', '7-Clbs', '8-Clbs', '9-Clbs', 'T-Clbs', 'A-Clbs', 
    'K-Dmds', 'Q-Dmds', 'J-Dmds', '2-Dmds', '3-Dmds', '4-Dmds', '5-Dmds', '6-Dmds', '7-Dmds', '8-Dmds', '9-Dmds', 'T-Dmds', 'A-Dmds', 
    'K-Hrts', 'Q-Hrts', 'J-Hrts', '2-Hrts', '3-Hrts', '4-Hrts', '5-Hrts', '6-Hrts', '7-Hrts', '8-Hrts', '9-Hrts', 'T-Hrts', 'A-Hrts', 
    'K-Spds', 'Q-Spds', 'J-Spds', '2-Spds', '3-Spds', '4-Spds', '5-Spds', '6-Spds', '7-Spds', '8-Spds', '9-Spds', 'T-Spds', 'A-Spds'
  ];
  const arrShuffled = shuffle(arrCardDeck);
  const arrPlayer = []; 
  const arrDealer = [];
  const arrDealerRnd1 = [];

  let switchReveal = false;
  let switchDeal = true;
  let switchHit = false;
  let switchStand = false;
  let switchAce = true;
  
  //...............................................

  btnHit.addEventListener('click', hit); 
  btnStand.addEventListener('click', stand);

  if(btnReplay.textContent === 'Replay') {
    reset();
  }
  
  deal();
  
  // Fisher-Yates algorithm
  function shuffle(array) { 
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
  }

  function name(array) {
    const type = cardName[array.slice(2)];
    const value = cardName[array.charAt(0)];
    const combi = type + value;
    // const combi = value + type; // english
    return combi;
  }
  
  function deal() {   
    if(switchDeal === true) {
      switchHit = true;
      switchStand = true;
      btnHit.style.opacity = '1';
      btnStand.style.opacity = '1';
      btnReplay.style.opacity = '0.3';
      btnReplay.removeEventListener('click', playRound);
      const result = [];
      for(let i = 0; i < 4; i++) {
        result.push(arrShuffled.splice(Math.floor(Math.random()*arrShuffled.length), 1)[0]);
      }
      arrPlayer.push(result[0],result[2]);
      arrDealer.push(result[1],result[3]);
      arrDealerRnd1.push(result[3]);
      cardsPlayer.textContent = `${name(result[0])}, ${name(result[2])}.`;
      cardsDealer.textContent = `Rugzijde, ${name(result[3])}.`;
      showScore();
      if(calcDealer(arrPlayer) === 21 || calcDealer(arrDealer) === 21) {
        showInfoBJack(); 
      } else {
        showInfoHit();
      }
    } 
  }

  function hit() {
    const result = arrShuffled.splice(Math.floor(Math.random()*arrShuffled.length), 1);
    if(switchHit === true && calcPlayer(arrPlayer) < 21) {
      arrPlayer.push(result[0]);
      cardsPlayer.textContent = '';
      for(let i = 0; i < arrPlayer.length; i++) {
        cardsPlayer.textContent += `${name(arrPlayer[i])}, `;
      }
      let strPeriod = cardsPlayer.textContent.slice(0, -2) + '.';
      cardsPlayer.textContent = strPeriod;
    }
    showInfoHit();
    showScore();
  }

  function stand() {
    if(switchStand === true) {
      switchReveal = true;
      for(let i = 0; calcDealer(arrDealer) <= 16; i++) {
        const result = arrShuffled.splice(Math.floor(Math.random()*arrShuffled.length), 1);
        arrDealer.push(result[0]);
      }
      showScore();
      showInfoStand();
      btnHit.removeEventListener('click', hit);
      btnStand.removeEventListener('click', stand);
      btnReplay.addEventListener('click', reset);
      btnReplay.textContent = 'Replay';
      btnHit.style.opacity = '0.3';
      btnStand.style.opacity = '0.3';
      btnReplay.style.opacity = '1';
    }
  }
  
  function calcPlayer(arrPerson) {
    let points = 0;
    for(item of arrPerson) {
      const result = item.charAt(0);
      if(result === 'K' || result === 'Q' || result === 'J' || result === 'T') {
          points += 10;
      } else if(result === 'A') {
        continue;
      } else points += parseInt(result);
    }
    for(item of arrPerson) {
      const result = item.charAt(0);
      if(result === 'A' && points < 11) {
          points += 11;
      } else if(result === 'A' && points >= 11) {
        points += 1;
      }
    }
    if(switchAce === true) {
      const allAces = arrPerson.filter((arr) => arr.charAt(0) === 'A');
      if(points > 21 && (points - (allAces.length + 10) < 11)) {
        allAces.length >= 2 ? points -= 10 : points;
      }
      switchAce = false;
    } 
    return points;
  }

  function calcDealer(arrPerson) {
    if(arrDealer[0].charAt(0) === 'A' || arrDealer[1].charAt(0) === 'A') {
      let points = 0;
      for(item of arrPerson) {
        const result = item.charAt(0);
        if(result === 'K' || result === 'Q' || result === 'J' || result === 'T') {
            points += 10;
        } else if(result === 'A' && points < 11) {
            points += 11;
        } else if(result === 'A' && points >= 11) {
            points += 1;
        } else points += parseInt(result);
      }
      return points;
    } else {
      let points = 0;
      for(item of arrPerson) {
        const result = item.charAt(0);
        if(result === 'K' || result === 'Q' || result === 'J' || result === 'T') {
            points += 10;
        } else if(result === 'A') {
            continue;
        } else points += parseInt(result);
      }
      for(item of arrPerson) {
        const result = item.charAt(0);
        if(result === 'A' && points < 11) {
            points += 11;
        } else if(result === 'A' && points >= 11) {
            points += 1;
        }
      }
      const allAces = arrPerson.filter((arr) => arr.charAt(0) === 'A');
      if(points > 21 && (points - (allAces.length + 10) < 11)) {
        allAces.length >= 2 ? points -= 10 : points;
      }
      return points;
    }
  }

  function endGame() {
    switchReveal = true;
    showScore();
    btnReplay.addEventListener('click', reset);
    btnHit.removeEventListener('click', hit);
    btnStand.removeEventListener('click', stand);
    btnReplay.textContent = 'Replay';
    btnHit.style.opacity = '0.3';
    btnStand.style.opacity = '0.3';
    btnReplay.style.opacity = '1';
  }
  
  function showScore() {
    scorePlayer.textContent = `score: ${calcPlayer(arrPlayer)}`;
    if(switchReveal === false) {
        scoreDealer.textContent = `score: ${calcDealer(arrDealerRnd1)} + ?`;
    } else if(switchReveal === true) {
        scoreDealer.textContent = `score: ${calcDealer(arrDealer)}`; 
        cardsDealer.textContent = '';
        for(let i = 0; i < arrDealer.length; i++) {
          cardsDealer.textContent += `${name(arrDealer[i])}, `;
        }
        let strPeriod = cardsDealer.textContent.slice(0, -2) + '.';
        cardsDealer.textContent = strPeriod;
    } 
  }

  function showInfoBJack() {
    if(calcPlayer(arrPlayer) === 21 && calcDealer(arrDealer) !== 21) {
        infoPlayer[0].textContent = "- BLACKJACK";
        infoPlayer[1].textContent = "- Je hebt gewonnen!!";
        infoDealer[0].textContent = "- Gefeliciteerd speler.";
        infoDealer[1].textContent = "- Nog een ronde?"; 
    } else if(calcDealer(arrDealer) === 21 && calcPlayer(arrPlayer) !== 21) {
        infoPlayer[0].textContent = "- Helaas.";
        infoPlayer[1].textContent = "- Je hebt verloren."; 
        infoDealer[0].textContent = "- BLACKJACK";
        infoDealer[1].textContent = "- Dealer heeft gewonnen.";    
    } else if(calcPlayer(arrPlayer) === 21 && calcDealer(arrDealer) === 21) {
        infoPlayer[0].textContent = "- BLACKJACK";
        infoPlayer[1].textContent = "- Helaas, ook de dealer heeft Blackjack."; 
        infoDealer[0].textContent = "- BLACKJACK";
        infoDealer[1].textContent = "- Het is gelijkspel geworden.";     
    }
    endGame();
  } 

  function showInfoHit() {
    if(calcPlayer(arrPlayer) < 21) {
        infoPlayer[0].textContent = "- Nog een kaart? druk op 'Hit'.";
        infoPlayer[1].textContent = "- Geen kaart erbij? druk op 'Pas'.";
        infoDealer[0].textContent = "- Dealer 16 punten of minder?";
        infoDealer[1].textContent = "- Kaart erbij voor dealer."; 
    } else if(calcPlayer(arrPlayer) === 21 && calcDealer(arrDealer) !== 21) {
        endGame();
        infoPlayer[0].textContent = "- 21 punten!";
        infoPlayer[1].textContent = "- Je hebt gewonnen!!";    
        infoDealer[0].textContent = "- Gefeliciteerd speler.";
        infoDealer[1].textContent = "- Nog een ronde?";   
    } else if(calcPlayer(arrPlayer) === 22) {
        endGame();
        infoPlayer[0].textContent = "- 'BUST', 1 punt teveel.";
        infoPlayer[1].textContent = "- Je hebt verloren.";
        infoDealer[0].textContent = "- Goed gespeeld, maar helaas.";
        infoDealer[1].textContent = "- Volgende ronde beter?"; 
    } else {
        endGame();
        infoPlayer[0].textContent = `- 'BUST', ${(calcPlayer(arrPlayer) - 21)} punten teveel.`;
        infoPlayer[1].textContent = "- Je hebt verloren.";
        infoDealer[0].textContent = "- Dat is spijtig speler.";
        infoDealer[1].textContent = "- Revanche?"; 
    }
  }

  function showInfoStand() {
    if(calcDealer(arrDealer) <= 21) {
        if(calcPlayer(arrPlayer) < calcDealer(arrDealer)) {
            infoPlayer[0].textContent = "- Je hebt minder punten dan de dealer.";
            infoPlayer[1].textContent = "- Je hebt verloren.";    
            infoDealer[0].textContent = "- Dat is spijtig speler.";
            infoDealer[1].textContent = "- Revanche?"; 
        } else if(calcPlayer(arrPlayer) === calcDealer(arrDealer)) {
            infoPlayer[0].textContent = "- 'STAND-OFF'.";
            infoPlayer[1].textContent = "- Geen winnaars.";    
            infoDealer[0].textContent = "- Gelijkspel.";
            infoDealer[1].textContent = "- Geen verliezers."; 
        } else if(calcPlayer(arrPlayer) > calcDealer(arrDealer)) {
            infoPlayer[0].textContent = "- Je hebt meer punten dan de dealer.";
            infoPlayer[1].textContent = "- Je hebt gewonnen!";    
            infoDealer[0].textContent = "- Gefeliciteerd speler.";
            infoDealer[1].textContent = "- Nog een ronde?";   
        }
    } else if(calcDealer(arrDealer) > 21) {
        infoPlayer[0].textContent = "- De dealer heeft teveel punten.";
        infoPlayer[1].textContent = "- Je hebt gewonnen!";    
        infoDealer[0].textContent = "- 'BUST'";
        infoDealer[1].textContent = "- Gefeliciteerd speler.";   
    }
  }

  function reset() {
    btnReplay.removeEventListener('click', reset);
    btnReplay.addEventListener('click', playRound)
    btnReplay.textContent = 'Deal';
    switchDeal = false;
    infoPlayer[0].textContent = '';
    infoPlayer[1].textContent = '';
    cardsPlayer.textContent = '';
    scorePlayer.textContent = 'score: ';
    infoDealer[0].textContent = '';
    infoDealer[1].textContent = '';
    cardsDealer.textContent = '';
    scoreDealer.textContent = 'score: ';
  }
}

