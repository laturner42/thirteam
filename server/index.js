const http = require('http');
const { server: WebSocketServer } = require('websocket');
const { shuffleArrayInPlace } = require('../thirteam-ui/src/utils');
const { getShuffledDeck, sortCards } = require('../thirteam-ui/src/gameUtils');
const {
  MessageTypes,
  Suits,
  FaceValues,
} = require('../thirteam-ui/src/constants');

const rooms = {};
const connections = {};

const checkAndEndRound = (gameState) => {
  const numComplete = gameState.hands.filter(hand => !!hand.placement).length;
  if (numComplete === gameState.hands.length - 1) {
    gameState.gameOver = true;
    gameState.hands.forEach((hand) => {
      if (!hand.placement) {
        hand.placement = gameState.hands.length;
      }
    })
  } else if (gameState.opts.teamBased && numComplete === gameState.hand.length - 2) {
    // Check if the two remaining players are on the same team
    const remaining = gameState.hands
      .map((hand, index) => ({ hand, index }))
      .filter(({ hand }) => !hand.placement);
    const difference = Math.abs(remaining[0].index - remaining[1].index);
      // They are on the same team! Pity.
    if (difference === 3) {
      if (remaining[0].hand.hand.length >= remaining[1].hand.hand.length) {
        gameState.hands[remaining[0].index].placement = 5;
        gameState.hands[remaining[1].index].placement = 6;
      } else {
        gameState.hands[remaining[0].index].placement = 6;
        gameState.hands[remaining[1].index].placement = 5;
      }
    }
  }

  if (!gameState.gameOver) return false;

  let scoring;
  if (gameState.hands.length === 4) {
    scoring = {
      1: 3,
      2: 1,
      3: -1,
      4: -3,
    }
  } else {
    scoring = {
      1: 3,
      2: 2,
      3: 1,
      4: -1,
      5: -2,
      6: -3,
    }
  }
  gameState.hands.forEach((hand, i) => {
    let score = scoring[hand.placement];
    if (gameState.opts.teamBased) {
      let teamIndex = i + 3;
      if (teamIndex >= gameState.hands.length) teamIndex -= gameState.hands.length;
      score += scoring[gameState.hands[teamIndex].placement];
    }
    gameState.players[hand.player].score += score;
  })
  return true;
}

const generateNewGame = (roomCode, opts, previousGameState = {}) => {
  const newGameState = {
    roomCode,
    players: previousGameState.players || {},
    host: previousGameState.host || null,
    currentLeader: null,
    lastPlay: null,
    gameOver: false,
    currentTurn: '',
  };
  if (opts) {
    newGameState.opts = opts;
    const {
      numPlayers,
      teamBased,
      reSortPlayers,
    } = opts;
    const { players } = newGameState;
    let playerNames;
    if (!reSortPlayers || !previousGameState.hands) {
      playerNames = shuffleArrayInPlace(Object.keys(players).slice(0, numPlayers));
    } else {
      playerNames = previousGameState.hands.sort((a, b) => a.placement - b.placement).map(hand => hand.player);
    }
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

const newRound = (previousGameState) => {
  return generateNewGame(previousGameState.roomCode, previousGameState.opts, previousGameState);
};

const updateEveryone = async (gameState) => {
  return Promise.all(
    Object.values(connections[gameState.roomCode]).map((connection) => {
      return connection.sendUTF(JSON.stringify(gameState));
    })
  )
}

const goNext = (gameState, player, foundPlayerIndex) => {
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
      let maxCardsIndex;
      if (gameState.opts.teamBased) {
        // The team with the highest number of remaining cards goes next
        let bestScore = 0;
        for (let i=0; i<3; i++) {
          const total = gameState.hands[i].hand.length + gameState.hands[i+3].hand.length;
          if (total > bestScore) {
            maxCardsIndex = i;
            bestScore = total;
          }
        }
        // but the player ON that team with the most cards goes first.
        if (gameState.hands[maxCardsIndex].hand.length < gameState.hands[maxCardsIndex+3].hand.length) {
          maxCardsIndex += 3;
        }
      } else {
        // Whichever individual with the most cards remaining goes next
        let maxCards = 0;
        for (let i=0; i<gameState.hands.length; i++) {
          const { hand } = gameState.hands[i];
          if (hand.length > maxCards) {
            maxCards = hand.length;
            maxCardsIndex = i;
          }
        }
      }
      gameState.currentTurn = gameState.hands[maxCardsIndex].player;
    }
  } else if (gameState.hands[nextIndex].hand.length === 0) {
    goNext(gameState, gameState.currentTurn, nextIndex);
  }
}

const playTrick = (gameState, player, trick) => {
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
  gameState.lastPlay = trick;
  gameState.currentLeader = player;
  // Player is out, determine placement
  if (gameState.hands[playerIndex].hand.length === 0) {
    const currentlyFinished = gameState.hands.filter(hand => !!hand.placement).length;
    gameState.hands[playerIndex].placement = currentlyFinished + 1;
    if (checkAndEndRound(gameState)) return;
  }
  goNext(gameState, player, playerIndex);
}

const playerJoin = async (gameState, name) => {
  if (!gameState.players[name]) {
    gameState.players[name] = {
      name,
      score: 0,
    }
  }
  if (!gameState.host) gameState.host = name;
  await updateEveryone(gameState);
};

const parseMessage = async (packet, connection) => {
  const { type, name, roomCode: playerRoomCode, data } = packet;

  let roomCode = playerRoomCode || data.roomCode;

  if (!roomCode) {
    roomCode = '';
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    for (let i = 0; i < 4; i++) {
      roomCode += letters[Math.floor(Math.random() * letters.length)];
    }
  }
  if (!rooms[roomCode]) {
    rooms[roomCode] = generateNewGame(roomCode);
    connections[roomCode] = {};
    rooms[roomCode].roomCode = roomCode;
  }

  const gameState = rooms[roomCode];
  connections[roomCode][name] = connection;

  if (!gameState.players[name]) {
    console.debug(name, 'has joined');
    return await playerJoin(gameState, name);
  }

  switch(type) {
    case MessageTypes.JOIN:
      break;
    case MessageTypes.START:
      if (!gameState.hands) {
        rooms[roomCode] = generateNewGame(roomCode, data, gameState);
      }
      break;
    case MessageTypes.PLAY:
      if (name !== gameState.currentTurn) return;
      playTrick(gameState, name, data);
      break;
    case MessageTypes.SKIP:
      if (name !== gameState.currentTurn) return;
      goNext(gameState, name);
      break;
    case MessageTypes.NEW_ROUND:
      if (!gameState.gameOver) return;
      rooms[roomCode] = newRound(gameState);
      break;
    default:
      // Theoretically vulnerable to a logging attack ala log4shell
      console.error('Unknown message type', type, 'received');
      break;
  }
  await updateEveryone(rooms[roomCode]);
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
