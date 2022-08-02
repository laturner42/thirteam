import { useState } from 'react';
import Card from './Card';
import { getShuffledDeck } from '../constants';
import { getPattern, sortCards } from '../utils';

export default function Game(props) {
  const {
    myName,
    gameData,
    sendMessage,
  } = props;

  const [selectedCards, setSelectedCards] = useState([]);
  const [myHand, setMyHand] = useState(getShuffledDeck());

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

  const pattern = getPattern(selectedCards);

  return (
    <div
      style={{
        display: 'flex',
        maxWidth: 500,
        flexWrap: 'wrap',
      }}
    >
      {
        JSON.stringify(pattern)
      }
      {
        myHand.map(({ value, suit }) => (
          <Card
            key={`card-${value}-${suit}`}
            value={value}
            suit={suit}
            selectedCards={selectedCards}
            selectCard={selectCard}
          />
        ))
      }
    </div>
  )
}