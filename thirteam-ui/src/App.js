import { useState, useEffect } from 'react';
import './App.css';
import { MessageTypes } from './constants';
import Game from './screens/Game';

export default function App() {
  const [socket, setSocket] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [myName, setMyName] = useState('');

  const sendMessage = (type, data, forceSocket) => (forceSocket || socket).send(
    JSON.stringify({
      name: myName,
      type,
      data,
    })
  );

  const join = () => sendMessage(MessageTypes.JOIN);

  const connect = () => {
    console.debug('Connecting...');
    // TODO: don't hardcode this
    const ws = new WebSocket('ws://127.0.0.1:9898');
    ws.open = () => {
      console.debug('Connected');
      setSocket(ws);
      if (myName && gameData && gameData.players.map(p => p.name).includes(myName)) {
        join();
      }
    }
    ws.onmessage = (e) => setGameData(JSON.parse(e.data));
    ws.onclose = (e) => {
      setSocket(null);
      console.error(e);
    }
  };

  useEffect(() => {
    if (!socket) {
      setTimeout(connect, 1000);
    }
  }, [socket]);

  const basicProps = { gameData, sendMessage, myName };

  return (
    <div className="App">
      <div className="App-header">
        <Game {...basicProps} />
      </div>
    </div>
  );
}
