const http = require('http');
const { server: WebSocketServer } = require('websocket');
const {
  MessageTypes,
} = require('../thirteam-ui/src/constants');

const connections = {};
const players = {};

const playerJoin = async (name) => {

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
    default:
      // Theoretically vulnerable to a logging attack ala log4shell
      console.error('Unknown message type', type, 'received');
      break;
  }
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
