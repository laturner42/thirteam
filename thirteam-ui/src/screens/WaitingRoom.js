import { useState } from 'react';
import { MessageTypes } from '../constants';
import { Button, Divider, Typography, Checkbox, Select, MenuItem } from '@mui/material';

export default function WaitingRoom(props) {
  const {
    gameData,
    myName,
    sendMessage,
  } = props;

  const [numPlayers, setNumPlayers] = useState(4);
  const [teamBased, setTeamBased] = useState(false);

  const startGame = () => {
    console.log('Starting game');
    sendMessage(MessageTypes.START, { numPlayers, teamBased, reSortPlayers: true });
  }

  return (
    <div>
      <div>
        {
          Object.keys(gameData.players).map((player) => (
            <Typography style={{ color: player === myName ? '#bbf' : '#eee' }}>
              {player}
            </Typography>
          ))
        }
      </div>
      <Divider variant="middle" style={{ margin: 20 }} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography>Number of Players:</Typography>
          <Select
            disabled={myName !== gameData.host}
            id="numPlayersSelect"
            value={numPlayers}
            onChange={(event) => {
              setNumPlayers(parseInt(event.target.value, 10));
              setTeamBased(false);
            }}
            style={{
              height: 30,
              marginLeft: 20,
            }}
          >
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={6}>6</MenuItem>
          </Select>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography>Team Game:</Typography>
          <Checkbox
            disabled={myName !== gameData.host || numPlayers !== 6}
            style={{ marginLeft: 10 }}
            checked={teamBased}
            onChange={() => setTeamBased(!teamBased)}
          />
        </div>
      </div>
      <Divider variant="middle" style={{ margin: 20 }} />
      {
        myName === gameData.host
          ? (
            <div>
              <Button
                disabled={Object.keys(gameData.players).length < numPlayers}
                onClick={startGame}
                variant="outlined"
                style={{ marginBottom: 10 }}
              >
                Begin
              </Button>
              {
                numPlayers < Object.keys(gameData.players).length && (
                  <Typography style={{ color: '#bbb' }}>
                    Only the first {numPlayers} players will play.
                  </Typography>
                )
              }
            </div>
          )
          : (
            <Typography>Waiting on {gameData.host} to start</Typography>
          )
      }
    </div>
  )
}