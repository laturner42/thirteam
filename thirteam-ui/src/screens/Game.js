import { useState } from 'react';
import Card from '../components/Card';
import { MessageTypes, Patterns } from '../constants';
import { getPattern, sortCards } from '../gameUtils';
import Player from '../components/Player';
import { Button, Typography } from '@mui/material';
import { Stars as LeaderIcon } from '@mui/icons-material';
import PlacementIcon from '../components/PlacementIcon';

export default function Game(props) {
  const {
    myName,
    gameData,
    sendMessage,
  } = props;

  const [selectedCards, setSelectedCards] = useState([]);

  const myTurn = gameData.currentTurn === myName;

  const canPlayTrick = () => {
    if (!myTurn) return false;
    const myPattern = getPattern(selectedCards);
    if (myPattern.pattern === Patterns.None) return false;
    if (!gameData.lastPlay) return true;

    const leadingPattern = getPattern(gameData.lastPlay);
    if (leadingPattern.pattern !== myPattern.pattern) return false;
    if (leadingPattern.value !== myPattern.value) return false;
    const { suit: leadingSuit, value: leadingValue } = leadingPattern.highCard;
    const { suit: mySuit, value: myValue } = myPattern.highCard;
    if (leadingValue > myValue) return false;
    if (leadingValue === myValue && leadingSuit > mySuit) return false;

    return true;
  }

  const playTrick = async () => {
    await sendMessage(MessageTypes.PLAY, selectedCards);
    setSelectedCards([]);
  }

  const skipTurn = async () => {
    await sendMessage(MessageTypes.SKIP);
  }

  const selectCard = (value, suit) => {
    const newSelectedCards = [...selectedCards];
    let found = -1;
    for (let i=0; i<selectedCards.length; i++) {
      const card = selectedCards[i];
      if (card.value === value && card.suit === suit) {
        found = i;
        break;
      }
    }
    if (found > -1) {
      newSelectedCards.splice(found, 1);
    } else {
      newSelectedCards.push({ value, suit });
    }
    setSelectedCards(sortCards(newSelectedCards));
  }

  const myIndex = gameData.hands.findIndex((hand) => hand.player === myName);
  const numPlayers = gameData.hands.length;
  const indexes = [];
  for (let i=1; i<numPlayers; i++) {
    let nextIndex = myIndex + i;
    if (nextIndex >= numPlayers) {
      nextIndex -= numPlayers;
    }
    indexes.push(nextIndex);
  }

  const myHand = gameData.hands[myIndex];
  const sixMans = gameData.numPlayers === 6;

  return (
    <div
      style={{
        width: 1024,
        height: 768,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'space-between',
        justifyContent: 'space-between',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Player
          playerHand={gameData.hands[indexes[sixMans ? 2 : 1]]}
          gameData={gameData}
        />
      </div>

      {/* Middle bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {/* Middle left */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around'
          }}
        >
          <Player
            playerHand={gameData.hands[indexes[sixMans ? 1 : 0]]}
            gameData={gameData}
          />
          {
            sixMans && (
              <Player
                playerHand={gameData.hands[indexes[0]]}
                gameData={gameData}
              />
            )
          }
        </div>

        {/* Last Played Hand */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            minWidth: 70,
            maxWidth: 500,
            margin: 20,
            borderRadius: 20,
            borderWidth: 5,
            borderStyle: 'solid',
            borderColor: '#8cf',
            paddingLeft: 15,
            paddingRight: 15,
          }}
        >
          {
            !!gameData.lastPlay &&
              gameData.lastPlay.map(({ value, suit }) => (
                <Card
                  key={`played-card-${value}-${suit}`}
                  value={value}
                  suit={suit}
                  myTurn
                />
              ))
          }
        </div>
        {/* Middle right */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around'
          }}
        >
          <Player
            playerHand={gameData.hands[indexes[sixMans ? 3 : 2]]}
            gameData={gameData}
          />
          {
            sixMans && (
              <Player
                playerHand={gameData.hands[indexes[4]]}
                gameData={gameData}
              />
            )
          }
        </div>
      </div>
      {/* Player Hand */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            maxWidth: 900,
            flexWrap: 'wrap',
          }}
        >
          {
            myHand.hand.map(({ value, suit }) => (
              <Card
                key={`card-${value}-${suit}`}
                value={value}
                suit={suit}
                selectedCards={selectedCards}
                selectCard={selectCard}
                myTurn={myTurn}
              />
            ))
          }
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 100,
            height: '100%',
            justifyContent: 'space-around',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Player
              playerHand={myHand}
              gameData={gameData}
              isMe
            />
          </div>
          {
            !gameData.gameOver || gameData.host !== myName
              ? (
                <Button
                  disabled={!canPlayTrick()}
                  onClick={playTrick}
                  variant="contained"
                >
                  Play
                </Button>
              ) : (
                <Button
                  onClick={() => sendMessage(MessageTypes.NEW_ROUND)}
                  variant="outlined"
                >
                  Next Round
                </Button>
              )
          }
          <Button
            disabled={!myTurn || !gameData.lastPlay}
            onClick={skipTurn}
            variant="outlined"
          >
            Skip
          </Button>
        </div>
      </div>
    </div>
  )
}