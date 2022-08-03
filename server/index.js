const http = require('http');
const { server: WebSocketServer } = require('websocket');
const { shuffleArrayInPlace } = require('../thirteam-ui/src/utils');
const { getShuffledDeck, sortCards } = require('../thirteam-ui/src/gameUtils');
const {
  MessageTypes,
  Suits,
  FaceValues,
} = require('../thirteam-ui/src/constants');

const connections = {};
const players = {};

const generateNewGame = (opts) => {
  const newGameState = {
    players,
    currentLeader: null,
    lastPlay: null,
    currentTurn: '',
  };
  if (opts) {
    const {
      numPlayers,
      teamBased,
    } = opts;
    const playerNames = shuffleArrayInPlace(Object.keys(players).slice(0, numPlayers));
    let remainingCards = getShuffledDeck(teamBased);
    const handSize = remainingCards.length / playerNames.length;
    const hands = [];
    let playFirst = null
    for (let player of playerNames) {
      const newHand = {
        hand: sortCards(remainingCards.splice(0, handSize)),
        player,
        placement: null,
      };
      if (newHand.hand.some((card) => card.suit === Suits.SPADES && card.value === FaceValues.Three)) {
        playFirst = player;
      }
      hands.push(newHand);
    }
    newGameState.hands = hands;
    newGameState.currentTurn = playFirst;
  }
  console.log('Starting new game!', newGameState);
  return newGameState;
}

let gameState = generateNewGame();

const updateEveryone = async () => {
  return Promise.all(
    Object.values(connections).map((connection) => {
      return connection.sendUTF(JSON.stringify(gameState));
    })
  )
}

const goNext = (player, foundPlayerIndex) => {
  const playerIndex = foundPlayerIndex ||
    gameState.hands.findIndex((hand) => hand.player === player);
  let nextIndex = playerIndex + 1;
  if (nextIndex >= gameState.hands.length) nextIndex = 0;

  gameState.currentTurn = gameState.hands[nextIndex].player;
  // Last player to play won the hand
  if (gameState.currentTurn === gameState.currentLeader) {
    gameState.lastPlay = null;
    gameState.currentLeader = null;
    // Last player to play is out, need to determine who starts next
    if (gameState.hands[nextIndex].hand.length === 0) {

    }
  } else if (gameState.hands[nextIndex].hand.length === 0) {
    goNext(gameState.currentTurn, nextIndex);
  }
}

const playTrick = (player, trick) => {
  // Find and update the player's hand
  const playerIndex = gameState.hands.findIndex((hand) => hand.player === player);
  const hand = gameState.hands[playerIndex];
  // It was at this moment I regretted naming the inner variable hand
  gameState.hands[playerIndex].hand = hand.hand.filter((card) => {
    for (let trickCard of trick) {
      if (trickCard.value === card.value &&
        trickCard.suit === card.suit) {
        return false;
      }
    }
    return true;
  });
  // Player is out, determine placement
  if (gameState.hands[playerIndex].hand.length === 0) {
    const currentlyFinished = gameState.hands.filter(hand => !!hand.placement).length;
    gameState.hands[playerIndex].placement = currentlyFinished + 1;
  }
  gameState.lastPlay = trick;
  gameState.currentLeader = player;
  goNext(player, playerIndex);
}

const playerJoin = async (name) => {
  if (!players[name]) {
    players[name] = {
      name,
    }
  }
  if (!gameState.leader) gameState.leader = name;
  await updateEveryone();
};

const parseMessage = async (packet, connection) => {
  const { type, name, data } = packet;

  connections[name] = connection;

  if (!players[name]) {
    console.debug(name, 'has joined');
    return await playerJoin(name);
  }

  switch(type) {
    case MessageTypes.JOIN:
      break;
    case MessageTypes.START:
      if (!gameState.hands) {
        gameState = generateNewGame(data);
      }
      break;
    case MessageTypes.PLAY:
      if (name !== gameState.currentTurn) return;
      playTrick(name, data);
      break;
    case MessageTypes.SKIP:
      if (name !== gameState.currentTurn) return;
      goNext(name);
      break;
    default:
      // Theoretically vulnerable to a logging attack ala log4shell
      console.error('Unknown message type', type, 'received');
      break;
  }
  await updateEveryone();
}

const httpServer = http.createServer();
const WS_PORT = process.env.WS_PORT || 9898;
httpServer.listen(WS_PORT, () => console.log(`Websocket listening on port ${WS_PORT}`));
const wsServer = new WebSocketServer({ httpServer });
wsServer.on('request', (request) => {
  console.debug('New connection');
  const connection = request.accept(null, request.origin);
  connection.on('message', (message) => {
    const packet = JSON.parse(message.utf8Data);
    return parseMessage(packet, connection);
  })
  connection.on('close', (reasonCode, desc) => {
    console.debug('Client lost.', reasonCode, desc);
  })
});
