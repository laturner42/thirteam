export const MessageTypes = {
  JOIN: 1,
  START: 2,
  PLAY: 3,
  SKIP: 4,
  NEW_ROUND: 5,
  READY_TO_SWAP: 6,
  SWAP_CARD: 7,
  CHANGE_OPTS: 8,
};

export const Suits = {
  SPADES: 1,
  CLUBS: 2,
  DIAMONDS: 3,
  HEARTS: 4,
};

export const FaceValues = {
  Three: 0,
  Two: 12,
  Joker: 13,
};

export const Patterns = {
  None: 'None',
  Single: 'Solo',
  Pair: 'Pair',
  Trips: 'Trips',
  Quads: 'Quads',
  Run: 'Run',
};

export const SeatingMethods = {
  None: 'Unchanging',
  Shuffle: 'Shuffle',
  PairUp: 'Pair Up',
  SwapBottom: 'Swap Bottom',
  SwapTop: 'Swap Top',
}
