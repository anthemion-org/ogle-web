// SliceScore.js
// =============
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import SliceScore from "./Store/SliceScore.js";
//

import * as ScoresHigh from "../Round/ScoresHigh.js";
import * as ScorePlay from "../Round/ScorePlay.js";
import * as Persist from "../Persist.js";

import { createSlice } from "@reduxjs/toolkit";

// Slice
// -----

export const Slice = createSlice({
	name: "Score",

	initialState: {
		/** The name last entered by any player when a high score was recorded, or
		 *  the empty string if the player choose to remain anonymous. */
		NamePlayLast: Persist.uRead("NamePlayLast") ?? "",
		/** A ScoresHigh record that contains all high score data. */
		ScoresHigh: Persist.uRead("ScoresHigh") ?? ScoresHigh.uNewEmpty()
	},

	reducers: {
		Set_NamePlayLast: (aSt, aAct) => {
			aSt.NamePlayLast = aAct.payload;
		},
		/** Adds a ScorePlay record to the high score data. */
		Add_ScoreHigh: (aSt, aAct) => {
			const oTagSetup = aAct.payload.TagSetup;
			const oScore = aAct.payload.ScorePlay;

			const oScoresOrig = aSt.ScoresHigh._ByTag[oTagSetup] ?? [];
			const oScoresNew = ScorePlay.uCloneAdd_Scores(oScoresOrig, oScore);
			aSt.ScoresHigh._ByTag[oTagSetup] = oScoresNew;
		}
	}
});
export default Slice;

export const { Set_NamePlayLast, Add_ScoreHigh } = Slice.actions;

// Selectors
// ---------

export const uSelNamePlayLast = (aSt) => aSt.Score.NamePlayLast;
export const uSelScoresHigh = (aSt) => aSt.Score.ScoresHigh;
