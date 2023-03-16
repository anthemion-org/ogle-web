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
		ScoresHigh: ScoresHigh.uFromParse(Persist.uRead("ScoresHigh"))
			?? ScoresHigh.uNewEmpty()
	},

	reducers: {
		Set_NamePlayLast: (aSt, aAct) => {
			aSt.NamePlayLast = aAct.payload;
		},
		/** Adds a ScorePlay record to the ScoresHigh record. */
		Add_ScoreHigh: (aSt, aAct) => {
			const oTagSetup = aAct.payload.TagSetup;
			const oScorePlay = aAct.payload.ScorePlay;
			// This function always produces a new object, even if `oScorePlay`
			// doesn't qualify as a high score, but this action isn't sent unless
			// `ScoresHigh.uCkScoreHigh` returned `true`, so we won't worry. It
			// wouldn't break anything, anyway:
			aSt.ScoresHigh = ScoresHigh.uCloneAdd_Score(aSt.ScoresHigh, oTagSetup,
				oScorePlay);
		}
	}
});
export default Slice;

export const { Set_NamePlayLast, Add_ScoreHigh } = Slice.actions;

// Selectors
// ---------

export const uSelNamePlayLast = (aSt) => aSt.Score.NamePlayLast;
export const uSelScoresHigh = (aSt) => aSt.Score.ScoresHigh;
