import { Typography } from '@mui/material';
import Card from './Card';
import { Stars as LeaderIcon } from '@mui/icons-material';
import PlacementIcon from './PlacementIcon';

export default function Player(props) {
  const {
    playerHand,
    gameData,
    isMe,
    spectating,
  } = props;

  const {
    hand,
    placement,
    player: name,
  } = playerHand;

  const {
    currentTurn,
    currentLeader,
  } = gameData;

  const score = gameData.players[name].score;
  const myTurn = name === currentTurn;

  return (
    <div
      style={{
        display: 'flex',
        margin: 10,
        minWidth: 220,
        maxWidth: 420,
        minHeight: isMe ? 0 : 100,
        flexDirection: 'column',
        borderWidth: isMe ? 0 : 5,
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
          height: 40,
        }}
      >
        {
          <div
            style={{
              height: '100%',
              marginRight: 5,
            }}
          >
            <div style={{ marginTop: 3 }}>
              <Typography style={{ color: 'gold', fontSize: 14, fontWeight: 'bold' }}>
                {score >= 0 && '+'}{score}
              </Typography>
            </div>
          </div>
        }
        <Typography
          style={{
            fontSize: 30 - (Math.max(0, name.length - 7) * 3),
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
      {
        !isMe && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 5,
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            {
              hand.map((card, j) => (
                spectating ? (
                  <Card
                    key={`player-${name}-card-${j}`}
                    value={card.value}
                    suit={card.suit}
                    myTurn={false}
                    small
                  />
                ) : (
                  <div
                    key={`player-${name}-card-${j}`}
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
                )
              ))
            }
            {
              hand.length > 0
                ? (
                  spectating ? null : (
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
                )
                : (
                  <PlacementIcon placement={placement} />
                )
            }
          </div>
        )
      }
    </div>
  )
}