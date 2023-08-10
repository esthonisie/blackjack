let switchAce = 'on'; // only needed in 'Blackjack program'

// const array = ['3-clbs','2-clbs','A-clbs','Q-clbs','A-clbs']; // 17 || 17
const array = ['3-clbs','A-clbs','2-clbs','Q-clbs','A-clbs']; // 17 || 27

console.log(calcPoints(array)); // Player
console.log(calcDealer(array)); // Dealer ==> Ace (first one) of 'DEAL' always 11 points!


function calcPoints(arrPerson) {
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
  if(switchAce === 'on') {
    const allAces = arrPerson.filter((arr) => arr.charAt(0) === 'A');
    if(points > 21 && (points - (allAces.length + 10) < 11)) {
      allAces.length >= 2 ? points -= 10 : points;
    }
    switchAce = 'off';
  } 
  return points;
}

function calcDealer(arrPerson) {
  if(arrPerson[0].charAt(0) === 'A' || arrPerson[1].charAt(0) === 'A') {
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
