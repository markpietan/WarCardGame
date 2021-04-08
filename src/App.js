import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { startGame, startWar } from "./features/deck/deckSlice";
import { Counter } from "./features/counter/Counter";
import "./App.css";
import Loader from "./loader"
import Deck from "./features/deck/Deck";

function App() {
  const dispatch = useDispatch();
  const gameState = useSelector((state) => {
    return state.gameState;
  });
  return (
    <main className="App">
      <Loader></Loader>
      <button
        onClick={() => {
          dispatch(startGame());
        }}
      >
        New Game
      </button>

      {gameState.player1.deckId === "" ? null : (
        <h4>Deck ID:{gameState.player1.deckId}</h4>
      )}
      {/* <button onClick={() => {
        dispatch(startWar());
      }
      }>Play</button> */}
      <section className="Split_Screen">
        <Deck playerName= "player1"></Deck>
        <Deck playerName= "player2"></Deck>
      </section>
    </main>
  );
}

export default App;
