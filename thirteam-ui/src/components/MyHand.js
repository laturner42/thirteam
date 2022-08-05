import { useState } from 'react';
import Card from './Card';
import PlacementIcon from './PlacementIcon';
import Player from './Player';
import { Button } from '@mui/material';
import { getPattern, getTeammateIndex, sortCards } from '../gameUtils';
import { MessageTypes, Patterns } from '../constants';

export default function MyHand(props) {
  const {
    gameData,
    sendMessage,
    myName,
  } = props;

  const [selectedCards, setSelectedCards] = useState([]);
  const myTurn = gameData.currentTurn === myName;
  const myIndex = gameData.hands.findIndex((hand) => hand.player === myName);
  const myHand = gameData.hands[myIndex];
  const teamHand = gameData.hands[getTeammateIndex(gameData, myName)];

  const canPlayTrick = () => {
    if (!myTurn || gameData.gameOver) return false;

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

  let pendingPregame = false;

  const getActionButton = () => {
    if (gameData.gameOver && gameData.host === myName) {
      return (
        <Button
          onClick={() => sendMessage(MessageTypes.NEW_ROUND)}
          variant="outlined"
        >
          Next Round
        </Button>
      )
    }
    if (!gameData.currentTurn) {
      if (!myHand.readyToSwap || !teamHand.readyToSwap) {
        pendingPregame = !myHand.readyToSwap;
        return (
          <Button
            disabled={myHand.readyToSwap}
            onClick={() => sendMessage(MessageTypes.READY_TO_SWAP)}
            variant="outlined"
          >
            Swap Hand
          </Button>
        )
      }
      if (!teamHand.pendingCard) {
        pendingPregame = !teamHand.pendingCard;
        return (
          <Button
            disabled={!!teamHand.pendingCard || selectedCards.length !== 1}
            onClick={() => {
              sendMessage(MessageTypes.SWAP_CARD, selectedCards[0])
              setSelectedCards([]);
            }}
            variant="contained"
          >
            Trade Card
          </Button>
        )
      }
    }
    return (
      <Button
        disabled={!canPlayTrick()}
        onClick={playTrick}
        variant="contained"
      >
        Play
      </Button>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }}
    >
      <div />
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
              myTurn={myTurn || pendingPregame}
            />
          ))
        }
        {
          myHand.placement && (
            <PlacementIcon placement={myHand.placement} size={40} />
          )
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
        { getActionButton() }
        <Button
          disabled={!myTurn || !gameData.lastPlay || gameData.gameOver}
          onClick={skipTurn}
          variant="outlined"
          style={{ marginTop: 15 }}
        >
          Skip
        </Button>
      </div>
    </div>
  );
}
