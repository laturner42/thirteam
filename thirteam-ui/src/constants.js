const MessageTypes = {
  JOIN: 1,
  START: 2,
  PLAY: 3,
  SKIP: 4,
  NEW_ROUND: 5,
};

const Suits = {
  SPADES: 1,
  CLUBS: 2,
  DIAMONDS: 3,
  HEARTS: 4,
};

const FaceValues = {
  Three: 0,
  Two: 12,
  Joker: 13,
};

const Patterns = {
  None: 'None',
  Single: 'Solo',
  Pair: 'Pair',
  Trips: 'Trips',
  Quads: 'Quads',
  Run: 'Run',
};

module.exports = {
  MessageTypes,
  Suits,
  FaceValues,
  Patterns,
};
