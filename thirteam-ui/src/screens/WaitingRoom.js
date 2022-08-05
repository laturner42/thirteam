import { useEffect, useState } from 'react';
import { MessageTypes, SeatingMethods } from '../utilities/constants.js';
import { Button, Divider, Typography, Checkbox, Select, MenuItem } from '@mui/material';

export default function WaitingRoom(props) {
  const {
    gameData,
    myName,
    sendMessage,
  } = props;

  const [numPlayers, setNumPlayers] = useState(4);
  const [teamBased, setTeamBased] = useState(false);
  const [reseatMethod, setReseatMethod] = useState(SeatingMethods.PairUp);

  const iAmHost = myName === gameData.host;

  useEffect(() => {
    if (!gameData.opts) return;
    setNumPlayers(gameData.opts.numPlayers);
    setTeamBased(gameData.opts.teamBased);
    setReseatMethod(gameData.opts.reseatMethod);
  }, [gameData])

  const updateGameOpts = (startGame) => {
    sendMessage(startGame === false ? MessageTypes.CHANGE_OPTS : MessageTypes.START, { numPlayers, teamBased, reseatMethod });
  }

  useEffect(() => {
    if (!iAmHost) return;
    updateGameOpts(false);
  }, [iAmHost, numPlayers, teamBased, reseatMethod]);

  return (
    <div>
      <div>
        {
          Object.keys(gameData.players).map((player) => (
            <Typography key={player} variant="h5" style={{ color: player === myName ? '#bbf' : '#eee' }}>
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
            disabled={!iAmHost}
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
            disabled={!iAmHost || numPlayers !== 6}
            style={{ marginLeft: 10 }}
            checked={teamBased}
            onChange={() => setTeamBased(!teamBased)}
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography>Reseat Method:</Typography>
          <Select
            disabled={!iAmHost}
            id="reseatMethod"
            value={reseatMethod}
            onChange={(event) => setReseatMethod(event.target.value)}
            style={{
              height: 30,
              marginLeft: 20,
            }}
          >
            <MenuItem value={SeatingMethods.None}>Never Change Seats</MenuItem>
            <MenuItem value={SeatingMethods.PairUp}>Pair Up Best & Worst</MenuItem>
            <MenuItem value={SeatingMethods.Shuffle}>Shuffle Active Players</MenuItem>
            <MenuItem value={SeatingMethods.SwapBottom}>Bottom Players Swap Out</MenuItem>
            <MenuItem value={SeatingMethods.SwapTop}>Top Players Swap Out</MenuItem>
          </Select>
        </div>
      </div>
      <Divider variant="middle" style={{ margin: 20 }} />
      {
        myName === gameData.host
          ? (
            <div>
              <Button
                disabled={Object.keys(gameData.players).length < numPlayers}
                onClick={updateGameOpts}
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