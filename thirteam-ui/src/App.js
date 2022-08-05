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
    const url = 'ws://thirteam.lauraandvictoria.com:9898';
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
  const numSpectators = gameData && gameData.opts ? Object.keys(gameData.players).length - gameData.opts.numPlayers : 0;

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <div className="App-header">
          {
            gameData && gameData.opts && (
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
          <Router {...routerProps} />
        </div>
      </div>
    </ThemeProvider>
  );
}
