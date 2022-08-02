const { FaceValues, Patterns } = require('./constants');

const sortCards = (cards) => (
  [...cards]
    .sort((a, b) => {
    if (a.value !== b.value) return a.value - b.value;
    return a.suit - b.suit;
  })
)

// This could be optimized a bit
const getPattern = (unsortedCards) => {
  if (unsortedCards.length === 0) {
    return {
      pattern: Patterns.None,
      value: 0,
      highCard: null,
    };
  }
  if (unsortedCards.length === 1) {
    return {
      pattern: Patterns.Single,
      value: 1,
      highCard: unsortedCards[0],
    };
  }
  const cards = sortCards(unsortedCards);
  const firstValue = cards[0].value;
  let allSame = true;
  let isRun = true;
  for (let i=1; i<cards.length; i++) {
    const myValue = cards[i].value;
    if (myValue !== firstValue) {
      allSame = false;
    }
    if (myValue !== cards[i-1].value + 1 || myValue >= FaceValues.Two) {
      isRun = false;
    }
  }
  if (allSame) {
    const pattern = {
      2: Patterns.Pair,
      3: Patterns.Trips,
      4: Patterns.Quads,
    }[cards.length];
    return {
      pattern,
      value: cards.length,
      highCard: cards[cards.length - 1],
    }
  }
  if (isRun && cards.length >= 3) {
    return {
      pattern: Patterns.Run,
      value: cards.length,
      highCard: cards[cards.length - 1],
    }
  }
  return {
    pattern: Patterns.None,
    value: 0,
    highCard: null,
  };
}

module.exports = {
  getPattern,
  sortCards,
};
