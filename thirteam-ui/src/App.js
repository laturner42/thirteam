import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';
import { MessageTypes } from './constants';
import Router from './Router';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App() {
  const [socket, setSocket] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [myName, setMyName] = useState('');

  const sendMessage = (type, data, forceSocket) => (forceSocket || socket).send(
    JSON.stringify({
      name: myName,
      type,
      roomCode: gameData ? gameData.roomCode : null,
      data,
    })
  );

  const join = (roomCode) => sendMessage(MessageTypes.JOIN, { roomCode });

  const connect = () => {
    // TODO: don't hardcode this
    const url = 'ws://192.168.4.36:9898';
    console.log(`Connecting to ${url}`);
    const ws = new WebSocket(url);
    ws.onopen = () => {
      console.log('Connected');
      setSocket(ws);
      if (myName && gameData && Object.keys(gameData.players).map(p => p.name).includes(myName)) {
        join();
      }
    }
    ws.onmessage = (e) => setGameData(JSON.parse(e.data));
    ws.onclose = (e) => {
      setSocket(null);
      console.error('Lost connection', e);
    }
  };

  useEffect(() => {
    if (!socket) {
      setTimeout(connect, 1000);
    }
  }, [socket]);

  const routerProps = { join, setMyName, gameData, sendMessage, myName };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <div className="App-header">
          {
            gameData && (
              <div
                style={{
                  position: 'absolute',
                  left: 10,
                  top: 10,
                }}
              >
                <span style={{ color: '#aaa' }}>Room code: {gameData.roomCode}</span>
              </div>
            )
          }
          <Router {...routerProps} />
        </div>
      </div>
    </ThemeProvider>
  );
}
