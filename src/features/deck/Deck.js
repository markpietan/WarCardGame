import { useSelector, useDispatch } from "react-redux";
import "./Deck.css";
import Loader from "../../loader";
import { startWar, refreshPile, startTie } from "./deckSlice";
const cardBackUrl =
  "https://i.pinimg.com/originals/97/8e/84/978e847bb6d1995e3b3a74744d8be05d.png";
const Deck = ({ playerName }) => {
  const dispatch = useDispatch();
  const gameState = useSelector((state) => {
    return state.gameState;
  });
  return (
    <section className="player">
      <h1>{playerName}</h1>
      {gameState.turnTie === true ? <h2>Starting War</h2> : null}
      <div className="play_area">
        <div className="pileArea">
          {gameState[playerName].deckId === "" ? (
            <>
              <h1>Pile</h1>
              <p>Remaining: n/a</p>
            </>
          ) : (
            <>
              <h1>Pile</h1>
              <p>Remaining: {gameState[playerName].pileRemaining}</p>
            </>
          )}
          <div
            onClick={async () => {
              if (
                gameState.player1.pileRemaining === 0 ||
                gameState.player2.pileRemaining === 0
              ) {
                await dispatch(refreshPile());
              
              }
              if (gameState.turnTie) {
                await dispatch(startTie())
                await dispatch(startWar())
              } else {
                const resolve = await dispatch(startWar());
                console.log({ resolve });
              }
            }}
            // className="imgContainer"
            className={gameState[playerName].deckId && !gameState.loaderVisible ? "imgContainer" : "unclickable imgContainer"}
          >
            <img src={cardBackUrl}></img>
          </div>
        </div>
        <div className="currentCard">
          {gameState[playerName].lastDrawn === null ? null : (
            <img src={gameState[playerName].lastDrawn.image} alt="" />
          )}
        </div>
        <div className="capturedArea">
          {gameState[playerName].deckId === "" ? (
            <>
              <h1>Captured Cards</h1>
              <p>Captured Count: n/a</p>
            </>
          ) : (
            <>
              <h1>Captured Cards</h1>
              <p>Captured Count: {gameState[playerName].captures.length}</p>
            </>
          )}
          <div className="imgContainer">
            <img
              disabled={gameState[playerName].deckId ? false : true}
              className={gameState[playerName].deckId ? "" : "unclickable"}
              src={cardBackUrl}
            ></img>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Deck;
