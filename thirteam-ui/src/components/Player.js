import { Typography } from '@mui/material';
import { Stars as LeaderIcon } from '@mui/icons-material';
import PlacementIcon from './PlacementIcon';

export default function Player(props) {
  const {
    playerHand,
    currentTurn,
    currentLeader,
  } = props;

  const {
    hand,
    placement,
    player: name,
  } = playerHand;

  const myTurn = name === currentTurn;

  return (
    <div
      style={{
        display: 'flex',
        margin: 10,
        width: 220,
        height: 100,
        flexDirection: 'column',
        borderWidth: 5,
        borderRadius: 10,
        borderStyle: 'solid',
        borderColor: myTurn ? '#dff' : '#888',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h4"
          style={{
            fontWeight: 'bold',
            color: myTurn ? '#eef' : '#ddd',
          }}
        >
          {name}
        </Typography>
        {
          currentLeader === name && (
            <LeaderIcon
              style={{
                color: 'gold',
                marginLeft: 10,
                fontSize: 30,
              }}
            />
          )
        }
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 5,
        }}
      >
        {
          Array.from(Array(hand.length)).map(() => (
            <div
              style={{
                width: 20,
                height: 40,
                marginRight: -12,
                backgroundColor: '#49e',
                borderStyle: 'solid',
                borderWidth: 2,
                borderRadius: 3,
                borderColor: '#ddd',
              }}
            />
          ))
        }
        {
          hand.length > 0
            ? (
              <div
                style={{
                  marginLeft: 22,
                }}
              >
                <Typography style={{ fontWeight: 'bold' }}>
                  {hand.length}
                </Typography>
              </div>
            )
            : (
              <PlacementIcon placement={placement} />
            )
        }
      </div>
    </div>
  )
}