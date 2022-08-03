# thirteam

Four or six player card game based on the original game "thirteen",
but with a team-based twist.

## Basic Rules

Every player is dealt 13 cards.
Whoever starts a round will play any trick out of their hand.
A trick has one of the following patterns:

    - A single card
    - Two of a Kind
    - Three of a Kind
    - Four of a Kind
    - A Run of three or more

Play then continues clockwise. Each player has a chance to play on the trick,
but can skip if they want. In order to play on the trick, they must play a
trick with the _exact same pattern_ (including the number of cards in a run),
but with a better high card.

In the case of the same high card, the high card with the better suit wins.
Suit order, from best to worst, is:

    ♥ Hearts
    ♦ Diamonds
    ♣ Clubs
    ♠ Spades

`2`s are unique - instead of being the low card in the game, `2`s are the highest.
Because of this, `2`s can only be played with other `2`s and cannot be part of a Run.

If everyone after a player skips, that player "wins" the hand and gets to start
the next round with a new trick. If that player is out of cards, the player
with the most remaining cards begins the next trick.

Since `2`s are the high card, `3♠` is the lowest card.
Whoever, then, is dealt the `3♠` goes first to start the game.

The first player to run out of cards wins, but the game is not over!
Each player will earn (or lose!) points based on the order in which they go out.

Scoring: 1st (+3) 2nd (+1) 3rd (-1) 4th (-3)

## Six Player Variant

In a six player game, each player starts with 9 cards instead of 13.
Two Jokers (a Red Joker and a Black Joker, represented as '☆'s)
are added to bring the total number of cards to 54.
The Jokers are now the highest card in the game, better than `2`s.
However, Jokers can _only_ be played solo - not as a pair, not as part of a run.
`2`s can still only be played with other `2`s. The Red Joker can beat the Black Joker.

Six-player Scoring: 1st (+3) 2nd (+2) 3rd (+1) 4th (-1) 5th (-2) 6th (-3)

## Team Play

_Team Play is still a work in progress and not yet functional_

A team game can only be played with six players.

In a team game, before the game begins,
each player gets one minute to memorize their hand.
After one minute, each player will swap hands with their teammate,
the player sitting across from them. Then, without communication, each player
gets to trade _one card_ from their new hand back to their original hand
(which their teammate now holds). Neither teammate can look at which card
their teammate is trading before selecting a card to trade. Ideally, a player
can use this opportunity to improve their teammate's hand.

Once trades are complete, play continues as normal with the player with the `3♠`
going first. When a round ends, however, each player earns the _sum_ of their team's scores.
For example, if one teammate finishes first and earns 3 points, and the other
teammate finishes fourth and loses 1 point, both teammates will finish with 2 points.

After a game finishes, the teams change.
Whoever finished first now pairs with whoever finished sixth,
second pairs with fifth, and third pairs with fourth.

### Tips and Tricks

- Since `2`s and Jokers cannot be part of a run, the best runs in the game end in `A♥`
- A run must have _at least_ three cards in it, but can have up to 12
- If you skip during a round, you can play if play returns to you - you do not have to skip again
- If everyone skips after a player goes out in a **team game**, the _team_ with the most remaining cards goes next
  - The player in that team with the most cards goes first between them

### Play Examples

If the current trick pattern is Two of a Kind,
you can _only_ play Two of a Kind tricks -
not three of a kind, four of a kind, etc. If the trick patter is
a Run of 5 cards, you can _only_ play a Run of 5 cards - not a Run of 6 or more.
If the trick is just a single card, you can only play a single card.

Any played tricks must also have a higher high card - for example,
if the current trick is a pair of 5s, then a pair of 7s could be played,
but a pair of 4s could not. Another pair of 5s _could_ win, if the highest five
in the new pair is better than the highest five from the original pair.