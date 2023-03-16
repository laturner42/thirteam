import { useState, useEffect } from 'react';
import { Suits } from '../utilities/constants.js';

const faceValues = [
  '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2', '☆'
];

const suitIcons = {
  [Suits.SPADES]: '♠',
  [Suits.CLUBS]: '♣',
  [Suits.DIAMONDS]: '♦',
  [Suits.HEARTS]: '♥',
};

const suitColors = {
  [Suits.SPADES]: 'black',
  [Suits.CLUBS]: 'black',
  [Suits.DIAMONDS]: 'red',
  [Suits.HEARTS]: 'red',
};

export default function Card(props) {
  const {
    value,
    suit,
    selectCard,
    selectedCards,
    myTurn,
    small,
  } = props;

  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (!selectedCards) return;
    let found = false;
    for (let i=0; i<selectedCards.length; i++) {
      const card = selectedCards[i];
      if (card.value === value && card.suit === suit) {
        found = true;
        break;
      }
    }
    setSelected(found);
  }, [selectedCards, value, suit]);

  const faceValue = faceValues[value];
  const icon = suitIcons[suit];
  const color = suitColors[suit];

  let backgroundColor = '#999';
  if (myTurn) {
    backgroundColor = selected ? '#aef': '#eee';
  } else if (small) {
    backgroundColor = '#ccc';
  }

  return (
    <div
      key={`card-${value}-${suit}`}
      style={{
        userSelect: 'none',
        color,
        cursor: selectCard ? 'pointer' : undefined,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        borderColor: '#666',
        borderRadius: small ? 5 : 10,
        borderWidth: 2,
        borderStyle: 'solid',
        minWidth: small ? 20 : 50,
        maxWidth: small ? 20 : 50,
        overflow: 'hidden',
        height: small ? 50 : 100,
        fontSize: small ? 20 : 40,
        margin: 1,
        marginTop: selected || !selectCard ? 0 : 10,
        marginBottom: selected ? 20 : 10,
      }}
      onClick={() => selectCard ? selectCard(value, suit) : null}
    >
      <div>{faceValue}</div><div>{icon}</div>
    </div>
  )
}