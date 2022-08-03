import {
  TextField,
  Button,
  Card,
  Typography,
  Divider,
} from '@mui/material';

export default function Join(props) {
  const {
    join,
    myName,
    setMyName
  } = props;

  const setName = (event) => {
    const newValue = event.target.value.trim().slice(0, 12);
    setMyName(newValue);
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
          label="name"
          autoFocus
          value={myName}
          onChange={setName}
        />
        <Divider variant="middle" style={{ margin: 20 }} />
        <Button
          onClick={join}
          disabled={!myName}
        >
          Join
        </Button>
      </Card>
    </div>
  )
}