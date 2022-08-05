import Join from './screens/Join';
import Game from './screens/Game';
import WaitingRoom from './screens/WaitingRoom';

export default function Router({ join, setMyName, gameData, sendMessage, myName, socket }) {
  const basicProps = { gameData, sendMessage, myName };

  if (!myName || !gameData) {
    return (
      <Join join={join} setMyName={setMyName} {...basicProps} connected={!!socket} />
    );
  }

  if (!gameData.hands) {
    return (
      <WaitingRoom {...basicProps} />
    )
  }

  return (
    <Game {...basicProps} />
  );
}