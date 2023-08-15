// Dealer ==> Ace (first one) of 'deal' ALWAYS STAYS 11 points after getting more cards!!

const arrPlayer = ['3-clbs','2-clbs','A-clbs','Q-clbs','A-clbs']; // 17
const arrDealer = ['3-clbs','2-clbs','A-clbs','Q-clbs','A-clbs']; // 17

// const arrPlayer = ['3-clbs','A-clbs','2-clbs','Q-clbs','A-clbs']; // 17
// const arrDealer = ['3-clbs','A-clbs','2-clbs','Q-clbs','A-clbs']; // 27  <--- !!

// const arrPlayer = ['A-clbs','A-clbs','3-clbs','2-clbs','5-clbs']; // 12
// const arrDealer = ['3-clbs','2-clbs','A-clbs','5-clbs','A-clbs']; // 12

const calcPlayer = () => {
  return calcAceLowScore(arrPlayer, calcAceFluid(arrPlayer));
};

const calcDealer = () => {
  if(arrDealer[0].charAt(0) === 'A' || arrDealer[1].charAt(0) === 'A') {
    return calcAceFixed(arrDealer);
  } else return calcAceLowScore(arrDealer, calcAceFluid(arrDealer));
};

// deal === two cards per person -> (first) Ace always 11 points for Player and Dealer
const calcAceFixed = arrPerson => {
  let points = 0;
  for(const item of arrPerson) {
    const result = item.charAt(0);
    if(result === 'K' || result === 'Q' || result === 'J' || result === 'T') {
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

// console.log(calcAceFluid(arrPlayer)); // 22 wrong --- third array
// console.log(calcAceFluid(arrDealer)); // 22 wrong --- third array
// console.log(calcAceFixed(arrDealer)); // 22 wrong --- third array

console.log(calcPlayer());
console.log(calcDealer());