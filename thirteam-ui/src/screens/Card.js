import { useState, useEffect } from 'react';
import { Suits } from '../constants';

export default function Card(props) {
  const {
    value,
    suit,
    selectCard,
    selectedCards,
  } = props;

  const [selected, setSelected] = useState(false);

  useEffect(() => {
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

  const faceValue = [
    '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2', '%'
  ][value];

  const icon = {
    [Suits.SPADES]: '♠',
    [Suits.CLUBS]: '♣',
    [Suits.DIAMONDS]: '♦',
    [Suits.HEARTS]: '♥',
  }[suit];

  const color = {
    [Suits.SPADES]: 'black',
    [Suits.CLUBS]: 'black',
    [Suits.DIAMONDS]: 'red',
    [Suits.HEARTS]: 'red',
  }[suit];

  return (
    <div
      key={`card-${value}-${suit}`}
      style={{
        color,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: selected ? '#aaa': '#eee',
        borderColor: '#666',
        borderRadius: 10,
        borderWidth: 2,
        borderStyle: 'solid',
        width: 50,
        height: 100,
        fontSize: 40
      }}
      onClick={() => selectCard(value, suit)}
    >
      <div>{faceValue}</div><div>{icon}</div>
    </div>
  )
}