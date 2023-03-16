import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';
import { MessageTypes } from './utilities/constants.js';
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
    // const url = 'wss://thirteam-server-kseyi6yvpa-ue.a.run.app:443';
    const url = 'ws://localhost:9898';
    console.log(`Connecting to ${url}`);
    const ws = new WebSocket(url);
    ws.onopen = () => {
      console.log('Connected');
      setSocket(ws);
      if (myName && gameData && Object.keys(gameData.players).map(p => p.name).includes(myName)) {
        join(gameData.roomCode);
      }
    }
    ws.onmessage = (e) => setGameData(JSON.parse(e.data));
    ws.onclose = (e) => {
      setSocket(null);
      console.error('Lost connection', e);
    }
  };

  useEffect(() => {
    if (!socket && connect) {
      setTimeout(connect, 1000);
    }
  }, [socket]);

  const routerProps = { join, setMyName, gameData, sendMessage, myName, socket };
  const numSpectators = gameData && gameData.opts ? Object.keys(gameData.players).length - gameData.opts.numPlayers : 0;

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <div className="App-header">
          <div
            style={{
              position: 'absolute',
              left: 10,
              top: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            {
              gameData && gameData.opts && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <span style={{ color: '#aaa' }}>Room code: {gameData.roomCode}</span>
                  <span style={{ color: '#aaa', fontSize: 20 }}>Seating: {gameData.opts.reseatMethod}</span>
                  <span style={{ color: '#aaa', fontSize: 20 }}>Teams: {gameData.opts.teamBased ? 'On' : 'Off'}</span>
                  {
                    numSpectators > 0 && (
                      <span style={{ color: '#aaa', fontSize: 20 }}>Spectators: {Object.keys(gameData.players).length - gameData.opts.numPlayers}</span>
                    )
                  }
                </div>
              )
            }
            {
              !socket && (
                <span style={{ color: '#e99', fontSize: 18, }}>Connecting...</span>
              )
            }
          </div>
          <Router {...routerProps} />
        </div>
      </div>
    </ThemeProvider>
  );
}
