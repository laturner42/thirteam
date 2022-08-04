import { useState } from 'react';
import Card from '../components/Card';
import { MessageTypes, Patterns } from '../constants';
import { getPattern, getTeammateIndex, sortCards } from '../gameUtils';
import Player from '../components/Player';
import { Button } from '@mui/material';
import PlacementIcon from '../components/PlacementIcon';
import MyHand from '../components/MyHand';

export default function Game(props) {
  const {
    myName,
    gameData,
    sendMessage,
  } = props;

  // the 'hands' index to place at the bottom of the screen
  let bottomIndex = gameData.hands.findIndex((hand) => hand.player === myName);
  const iAmPlaying = bottomIndex !== -1;
  if (!iAmPlaying) {
    bottomIndex = 0;
  }
  const numPlayers = gameData.hands.length;
  const indexes = [];
  for (let i=1; i<numPlayers; i++) {
    let nextIndex = bottomIndex + i;
    if (nextIndex >= numPlayers) {
      nextIndex -= numPlayers;
    }
    indexes.push(nextIndex);
  }

  const sixMans = gameData.opts.numPlayers === 6;

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

      {/* Middle top bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Player
          playerHand={gameData.hands[indexes[sixMans ? 1 : 0]]}
          gameData={gameData}
        />
        <Player
          playerHand={gameData.hands[indexes[sixMans ? 3 : 2]]}
          gameData={gameData}
        />
      </div>

      {/* Last Played Hand */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 130,
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
      </div>

      {/* Middle bottom bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {
          sixMans && (
            <Player
              playerHand={gameData.hands[indexes[0]]}
              gameData={gameData}
            />
          )
        }
        {
          sixMans && (
            <Player
              playerHand={gameData.hands[indexes[4]]}
              gameData={gameData}
            />
          )
        }
      </div>

      {
        iAmPlaying
          ? (
            <MyHand
              gameData={gameData}
              sendMessage={sendMessage}
              myName={myName}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Player
                playerHand={gameData.hands[0]}
                gameData={gameData}
              />
            </div>
          )
      }
    </div>
  )
}