import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "./GameOverScreen.css";
import {startGame} from "./features/deck/deckSlice"

const GameOverScreen = () => {
    const dispatch = useDispatch()
  const loser = useSelector((state) => {
    return state.gameState.gameOver;
  });
  return (
    <div>
      {loser === "" ? null : (
        <div className="gameOver">
          <h1>Game Over</h1>
          <h3>{loser === "player1" ? "Player 2 Won!" : "Player 1 Won!"}</h3>
          <button
            onClick={() => {
              dispatch(startGame());
            }}
          >
            New Game
          </button>
        </div>
      )}
    </div>
  );
};

export default GameOverScreen;
