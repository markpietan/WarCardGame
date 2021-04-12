import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import deckOfCardsApi from "../../api";
const SUIT_VALUES = {
  JACK: 11,
  QUEEN: 12,
  KING: 13,
  ACE: 14,
};
export const startWar = createAsyncThunk("WAR", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  console.log(state);
  const deckId = state.gameState.player1.deckId;
  const p1PileName = state.gameState.player1.pileName;
  const p1Draw = await deckOfCardsApi.get(`${deckId}/pile/${p1PileName}/draw`, {
    params: { count: 1 },
  });
  console.log(p1Draw.data);
  const p2PileName = state.gameState.player2.pileName;
  const p2Draw = await deckOfCardsApi.get(`${deckId}/pile/${p2PileName}/draw`, {
    params: { count: 1 },
  });
  console.log(p2Draw.data);
  const [p1Card] = p1Draw.data.cards;
  const [p2Card] = p2Draw.data.cards;
  const p1Win = compareCards(p1Card, p2Card);
  //here we could check for a  tie
  let p1Remaining = state.gameState.player1.pileRemaining;
  p1Remaining--;
  let p2Remaining = state.gameState.player2.pileRemaining;
  p2Remaining--;
  console.log(p1Remaining, p2Remaining);
  if (p1Win === "Tie") {
    return {
      player1: {
        lastDrawn: p1Card,

        pileRemaining: p1Remaining,
      },
      player2: {
        lastDrawn: p2Card,

        pileRemaining: p2Remaining,
      },
      turnTie: true,
    };
  }

  return {
    player1: {
      lastDrawn: p1Card,
      turnWinner: p1Win,
      pileRemaining: p1Remaining,
    },
    player2: {
      lastDrawn: p2Card,
      turnWinner: !p1Win,
      pileRemaining: p2Remaining,
    },
  };
});

export const refreshPile = createAsyncThunk("REFRESH", async (_, thunkAPI) => {
  const state = thunkAPI.getState();

  const {
    captures: p1Captures,
    pileRemaining: p1PileRemaining,
    pileName: p1PileName,
    deckId,
  } = state.gameState.player1;
  const {
    captures: p2Captures,
    pileRemaining: p2PileRemaining,
    pileName: p2PileName,
  } = state.gameState.player2;
  const payload = {
    gameOver: "",
    player1: { captures: p1Captures, pileRemaining: p1PileRemaining },
    player2: { captures: p2Captures, pileRemaining: p2PileRemaining },
  };
  if (p1PileRemaining === 0) {
    if (p1Captures.length <= 0) {
      payload.gameOver = "player1";
    } else {
      let codeArray = p1Captures.map((card) => {
        return card.code;
      });
      let codeString = codeArray.toString();
      const response = await deckOfCardsApi.get(
        `${deckId}/pile/${p1PileName}/add`,
        { params: { cards: codeString } }
      );
      console.log(codeString);
      payload.player1.captures = [];
      payload.player1.pileRemaining = p1Captures.length;
    }
  }
  if (p2PileRemaining === 0) {
    if (p2Captures.length <= 0) {
      payload.gameOver = "player2";
    } else {
      let codeArray = p2Captures.map((card) => {
        return card.code;
      });
      let codeString = codeArray.toString();
      const response = await deckOfCardsApi.get(
        `${deckId}/pile/${p2PileName}/add`,
        { params: { cards: codeString } }
      );
      console.log(codeString);
      payload.player2.captures = [];
      payload.player2.pileRemaining = p2Captures.length;
    }
  }
  console.log(payload);
  return payload;
});

// if true, card1 will return bigger value
function compareCards(card1, card2) {
  const card1Value = Number(card1.value) || SUIT_VALUES[card1.value];
  const card2Value = Number(card2.value) || SUIT_VALUES[card2.value];
  console.log(card1Value);
  console.log(card2Value);
  if (card1Value === card2Value) {
    return "Tie";
  }
  return card1Value > card2Value;
}

export const startGame = createAsyncThunk("START_GAME", async (_, thunkAPI) => {
  const response = await deckOfCardsApi.get("new/shuffle", {
    params: { deck_count: 1 },
  });
  console.log(response);
  const deckId = response.data.deck_id;
  let drawResponseP1 = await deckOfCardsApi.get(`${deckId}/draw`, {
    params: { count: 26 },
  });
  let drawResponseP2 = await deckOfCardsApi.get(`${deckId}/draw`, {
    params: { count: 26 },
  });
  const p1Pile = drawResponseP1.data.cards.map((currentCard) => {
    return currentCard.code;
  });
  console.log(drawResponseP1.data);
  console.log(drawResponseP2.data);
  const p1PileParams = p1Pile.join(",");
  console.log(p1PileParams);

  const pileResponseP1 = await deckOfCardsApi.get(
    `${deckId}/pile/player1/add/`,
    {
      params: { cards: p1PileParams },
    }
  );
  const p2Pile = drawResponseP2.data.cards.map((currentCard) => {
    return currentCard.code;
  });
  console.log(p2Pile);
  const p2PileParams = p2Pile.join(",");
  console.log(p2PileParams);

  const pileResponseP2 = await deckOfCardsApi.get(
    `${deckId}/pile/player2/add/`,
    {
      params: { cards: p2PileParams },
    }
  );
  console.log({ pileResponseP2 });
  // const p1Pile = []
  // for (let index = 0; index < drawResponseP1.data.cards.length; index++) {
  //   const currentCard  = drawResponseP1.data.cards[index];
  //   p1Pile.push(currentCard.code)
  // }
  const payload = {
    deckId,
    pileRemaining: 26,
    gameOver: "",
  };
  return payload;
});

export const startTie = createAsyncThunk("START_TIE", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  console.log(state);
  const deckId = state.gameState.player1.deckId;
  const p1PileName = state.gameState.player1.pileName;
  const p1Draw = await deckOfCardsApi.get(`${deckId}/pile/${p1PileName}/draw`, {
    params: { count: 1 },
  });
  console.log(p1Draw.data);
  const p2PileName = state.gameState.player2.pileName;
  const p2Draw = await deckOfCardsApi.get(`${deckId}/pile/${p2PileName}/draw`, {
    params: { count: 1 },
  });
  console.log(p2Draw.data);
  const [p1Card] = p1Draw.data.cards;
  const [p2Card] = p2Draw.data.cards;
  let p1Remaining = state.gameState.player1.pileRemaining;
  p1Remaining--;
  let p2Remaining = state.gameState.player2.pileRemaining;
  p2Remaining--;
  if (p1Remaining === 0) {
    thunkAPI.dispatch(refreshPile());
  }
  if (p2Remaining === 0) {
    thunkAPI.dispatch(refreshPile());
  }
  const payload = {
    player1: {
      warWager: [
        ...state.gameState.player1.warWager,
        p1Card,
        state.gameState.player1.lastDrawn,
      ],
      pileRemaining: p1Remaining,

      lastDrawn: null,
      turnWinner: undefined,
    },

    player2: {
      warWager: [
        ...state.gameState.player2.warWager,
        p2Card,
        state.gameState.player2.lastDrawn,
      ],
      pileRemaining: p2Remaining,

      lastDrawn: null,
      turnWinner: undefined,
    },
    turnTie: false,
  };
  return payload;
});

// export const dealDeck = createAsyncThunk("DEAL_DECK", async (_, thunkAPI) => {
//   const state = thunkAPI.getState()
//   console.log(state)
//   const response = await deckOfCardsApi.get("deck/<<>>/draw/?count=26", {
//     params: { deck_count: 1 },
//   });
//   console.log(response);
//   return response.data;
// });

export const deckSlice = createSlice({
  name: "gameState",
  initialState: {
    player1: {
      captures: [],
      warWager: [],
      pileRemaining: -1,
      deckId: "",
      pileName: "player1",
      lastDrawn: null,
      turnWinner: undefined,
    },
    player2: {
      captures: [],
      warWager: [],
      pileRemaining: -1,
      deckId: "",
      pileName: "player2",
      lastDrawn: null,
      turnWinner: undefined,
    },
    loaderVisible: false,
    turnTie: false,
    gameOver: "",
  },
  reducers: {},
  extraReducers: {
    [startGame.fulfilled]: (prevstate, action) => {
      console.log(action);
      prevstate.gameOver = action.payload.gameOver;
      prevstate.player1.capturedCount = 0;
      prevstate.player2.capturedCount = 0;
      prevstate.loaderVisible = false;
      prevstate.player1.deckId = action.payload.deckId;
      prevstate.player2.deckId = action.payload.deckId;
      prevstate.player1.pileRemaining = action.payload.pileRemaining;
      prevstate.player2.pileRemaining = action.payload.pileRemaining;
    },
    [startGame.pending]: (prevstate, action) => {
      prevstate.loaderVisible = true;
    },

    [startWar.pending]: (prevstate, action) => {
      prevstate.loaderVisible = true;
    },
    [refreshPile.pending]: (prevstate, action) => {
      prevstate.loaderVisible = true;
    },

    [refreshPile.fulfilled]: (prevstate, action) => {
      prevstate.gameOver = action.payload.gameOver;
      prevstate.player1.captures = action.payload.player1.captures;
      prevstate.player2.captures = action.payload.player2.captures;
      prevstate.player1.pileRemaining = action.payload.player1.pileRemaining;
      prevstate.player2.pileRemaining = action.payload.player2.pileRemaining;
      prevstate.loaderVisible = false;
    },

    [startTie.pending]: (prevstate, action) => {
      prevstate.loaderVisible = true;
    },
    [startTie.fulfilled]: (prevstate, action) => {
      prevstate.loaderVisible = false;
      const { player1, player2 } = action.payload;
      prevstate.player1 = { ...prevstate.player1, ...player1 };
      prevstate.player2 = { ...prevstate.player2, ...player2 };
    },

    [startWar.fulfilled]: (prevstate, action) => {
      console.log(action);

      prevstate.player1.pileRemaining = action.payload.player1.pileRemaining;
      prevstate.player2.pileRemaining = action.payload.player2.pileRemaining;
      prevstate.player1.lastDrawn = action.payload.player1.lastDrawn;
      prevstate.player2.lastDrawn = action.payload.player2.lastDrawn;
      prevstate.player1.turnWinner = action.payload.player1.turnWinner;
      prevstate.player2.turnWinner = action.payload.player2.turnWinner;
      prevstate.loaderVisible = false;
      prevstate.turnTie = action.payload.turnTie;
      if (!action.payload.turnTie) {
        if (action.payload.player1.turnWinner) {
          prevstate.player1.captures.push(
            action.payload.player1.lastDrawn,
            action.payload.player2.lastDrawn,
            ...prevstate.player1.warWager,
            ...prevstate.player2.warWager
          );
        } else {
          prevstate.player2.captures.push(
            action.payload.player1.lastDrawn,
            action.payload.player2.lastDrawn,
            ...prevstate.player1.warWager,
            ...prevstate.player2.warWager
          );
        }
        prevstate.player1.warWager = [];
        prevstate.player2.warWager = [];
      }
    },
  },
});

// { player1:{ captures: [], remainingCards:0, pile: [], deckId: ''"}, player2:{ captures: [], remainingCards:0, pile: [], deckId: ''"}, }

export default deckSlice.reducer;
