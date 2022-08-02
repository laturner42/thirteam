const MessageTypes = {
  JOIN: 1,
};

const Suits = {
  SPADES: 1,
  CLUBS: 2,
  DIAMONDS: 3,
  HEARTS: 4,
};

const FaceValues = {
  Two: 12,
  Joker: 13,
};

const Patterns = {
  None: 'None',
  Single: 'Singles',
  Pair: 'Pair',
  Trips: 'Trips',
  Quads: 'Quads',
  Run: 'Run',
};

const shuffleArrayInPlace = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getShuffledDeck = (jokers = false) => {
  const cards = [];
  const cardsInSuit = jokers ? 14 : 13;
  const suitArray = [Suits.SPADES, Suits.CLUBS, Suits.DIAMONDS, Suits.HEARTS];
  for (let suit of suitArray) {
    for (let value=0; value<cardsInSuit; value++) {
      cards.push({
        value,
        suit,
      })
    }
  }
  return shuffleArrayInPlace(cards);
}

module.exports = {
  MessageTypes,
  Suits,
  FaceValues,
  Patterns,
  getShuffledDeck,
};
