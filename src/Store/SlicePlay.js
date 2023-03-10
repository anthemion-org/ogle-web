// SlicePlay.js
// ============
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import SlicePlay from "./Store/SlicePlay.js";
//

import StsApp from "../StsApp.js";
import { Set_StApp } from "./SliceApp.js";
import * as Board from "../Board/Board.js";
import * as Card from "../Round/Card.js";
import * as Persist from "../Persist.js";

import { createSlice } from "@reduxjs/toolkit";

// Slice
// -----

export const Slice = createSlice({
	name: "Play",

	initialState: {
		/** A Board record representing the board that is being played, or `null` if
		 *  the board has yet to be generated for the current round. */
		Board: Board.uFromParse(Persist.uRead("Board")) ?? null,
		/** Ogle's Card record for the current round. */
		CardOgle: Card.uFromParse(Persist.uRead("CardOgle")) ?? Card.uNewEmpty(),
		/** The user's Card record for the current round. */
		CardUser: Card.uFromParse(Persist.uRead("CardUser")) ?? Card.uNewEmpty(),
		/** The elapsed play time, in milliseconds. */
		TimeElap: Persist.uRead("TimeElap") ?? 0
	},

	reducers: {
		/** Stores a new board and the associated Ogle scorecard. */
		Set_BoardAndCardOgle: (aSt, aAct) => {
			aSt.Board = aAct.payload.Board;
			aSt.CardOgle = aAct.payload.CardOgle;
		},
		/** Adds an EntWord record to the user's scorecard. */
		Add_EntWordUser: (aSt, aAct) => {
			// We could change `uAdd` to return a new Card record, but
			// `uFromSelsBoard` would become even slower than it is now:
			const oCardNew = Card.uClone(aSt.CardUser);
			Card.uAdd(oCardNew, aAct.payload, false, false);
			aSt.CardUser = oCardNew;
		},
		/** Adds a number of milliseconds to the elapsed play time. */
		Add_TimeElap: (aSt, aAct) => {
			aSt.TimeElap += aAct.payload;
		}
	},

	extraReducers(aBuild) {
		aBuild.addCase(Set_StApp.type, (aSt, aAct) => {
			if (aAct.payload === StsApp.Play) {
				aSt.Board = null;
				aSt.CardOgle = Card.uNewEmpty();
				aSt.CardUser = Card.uNewEmpty();
				aSt.TimeElap = 0;
			}
		});
	}
});
export default Slice;

export const {
	Set_BoardAndCardOgle,
	Add_EntWordUser,
	Add_TimeElap,
} = Slice.actions;

// Selectors
// ---------

export const uSelCkBoard = (aSt) => !!aSt.Play.Board;
export const uSelBoard = (aSt) => aSt.Play.Board;
export const uSelCardOgle = (aSt) => aSt.Play.CardOgle;
export const uSelCardUser = (aSt) => aSt.Play.CardUser;
export const uSelTimeElap = (aSt) => aSt.Play.TimeElap;
