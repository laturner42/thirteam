import { useState } from 'react';
import {
  TextField,
  Button,
  Card,
  Typography,
  Divider,
} from '@mui/material';
import {
  GitHub
} from '@mui/icons-material';

export default function Join(props) {
  const {
    join,
    myName,
    setMyName,
    connected,
  } = props;

  const [roomCode, setRoomCode] = useState('');

  const setName = (event) => {
    const newValue = event.target.value.trim().slice(0, 12);
    setMyName(newValue);
  }

  const parseRoomCode = (event) => {
    const newRoomCode = event.target.value.trim().slice(0, 4).toUpperCase();
    setRoomCode(newRoomCode);
  }

  return (
    <div>
      <Typography variant="h5">thirteam</Typography>
      <Card
        style={{
          marginTop: 10,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TextField
          id="thirteam-name"
          label="name"
          autoFocus
          value={myName}
          onChange={setName}
        />
        <Divider variant="middle" style={{ margin: 20 }} />
        <Button
          onClick={() => join()}
          disabled={!myName || !connected}
        >
          Create Room
        </Button>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div style={{ width: '100%' }}>
            <Divider variant="middle" style={{ margin: 20 }} />
          </div>
          <span style={{fontSize: 12, color: '#aaa' }}>or</span>
          <div style={{ width: '100%' }}>
            <Divider variant="middle" style={{ margin: 20 }} />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TextField
            id="room-code-id"
            label="room code"
            value={roomCode}
            onChange={parseRoomCode}
            autoComplete="off"
            style={{ maxWidth: 120 }}
          />
          <Button
            onClick={() => join(roomCode)}
            disabled={!myName || !roomCode || !connected}
          >
            Join
          </Button>
        </div>
      </Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#889', margin: 3 }}>
        <span>by laura turner</span>
        <span>version 1.1</span>
      </div>
      <div style={{ margin: 9 }}>
        <a
          style={{
            color: '#eee',
          }}
          href="https://github.com/laturner42/thirteam"
          target="_blank"
          rel="noreferrer"
        >
          <GitHub style={{ fontSize: 30 }} />
        </a>
      </div>
    </div>
  )
}