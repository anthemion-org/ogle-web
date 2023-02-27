// SliceScore.js
// =============
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import SliceScore from "./Store/SliceScore.js";
//

import * as StoreLoc from "../StoreLoc.js";
import * as Const from "../Const.js";

import { createSlice } from "@reduxjs/toolkit";

// Play Score
// ----------
// A 'Play Score' record stores player score data for one round. It is an object
// containing:
//
// - `TimeStart`: The UNIX time when the game started;
//
// - `Name`: The player's name;
//
// - `FracPerc`: The player's percent score, as a decimal fraction.
//

/** Returns a new Play Score record. */
export function ScorePlayNew(aTime, aName, aFracPerc) {
	return {
		TimeStart: aTime,
		Name: aName,
		FracPerc: aFracPerc
	};
}

/** Compares tScorePlay instances by FracPerc, in descending order, and then by
 *  time, in ascending order. */
function uCompareScorePlay(aL, aR) {
	if (aL.FracPerc > aR.FracPerc) return -1;
	if (aL.FracPerc < aR.FracPerc) return 1;

	if (aL.TimeStart < aR.TimeStart) return -1;
	if (aL.TimeStart > aR.TimeStart) return 1;
	return 0;
}

/** Returns a new Score Play array that is sorted with `uCompareScorePlay` and
 *  trimmed to length `Const.CtStoreScoreHigh`, after adding `aScorePlayNew`. */
function uCloneAddScoresPlay(aScoresPlayOrig, aScorePlayNew) {
	const oScores = [ ...aScoresPlayOrig, aScorePlayNew ];
	oScores.sort(uCompareScorePlay);
	return oScores.slice(0, Const.CtStoreScoreHigh);
}

// High Scores
// -----------
// The High Scores record stores all player high score data. It is an object
// containing:
//
// - `_ByTag`: An object that associates `tSetup` tag values with arrays of Play
//   Score records. These arrays are sorted with `uCompareScorePlay` and trimmed
//   to length `Const.CtStoreScoreHigh`.
//
// For example:
//
//   {
//     _ByTag: {
//       "Y:(S:1 E:40) PS:18 PB:3": [
//         {
//           TimeStart: 1676691367520,
//           Name: "Jeremy",
//           FracPerc: 0.7619047619047619
//         },
//         ...
//       ],
//       "Y:(S:1 E:10) PS:18 PB:3": [
//         {
//           TimeStart: 1677124793901,
//           Name: "Jeremy",
//           FracPerc: 0.7777777777777778
//         },
//         ...
//       ],
//       ...
//     }
//   }
//

function ScoresHighInit() {
	return StoreLoc.uRead("ScoresHigh") ?? { _ByTag: {} };
}

// Slice
// -----

export const Slice = createSlice({
	name: "Score",

	initialState: {
		/** The name last entered by any player when a high score was recorded, or
		 *  the empty string if the player choose to remain anonymous. */
		NamePlayLast: "",
		/** The High Scores record. */
		ScoresHigh: ScoresHighInit()
	},

	reducers: {
		Set_NamePlayLast: (aSt, aAct) => {
			aSt.NamePlayLast = aAct.payload;
		},

		Add_ScoreHigh: (aSt, aAct) => {
			const oTagSetup = aAct.payload.TagSetup;
			const oScore = aAct.payload.ScorePlay;

			const oScoresOrig = aSt.ScoresHigh._ByTag[oTagSetup] ?? [];
			const oScoresNew = uCloneAddScoresPlay(oScoresOrig, oScore);
			aSt.ScoresHigh._ByTag[oTagSetup] = oScoresNew;
		}
	}
});
export default Slice;

// If action types require a slice name (or action 'domain') to avoid name
// collisions, then surely action creators and selectors require the same?
// [refactor]

export const { Set_NamePlayLast, Add_ScoreHigh } = Slice.actions;

// Selectors
// ---------

export const uSelNamePlayLast = (aSt) => aSt.Score.NamePlayLast;

export const uSelScoresHigh = (aSt) => aSt.Score.ScoresHigh;

/** Returns an array of `tScorePlay` instances containing the scores associated
 *  with the specified `tSetup` tag. */
export const uSelScoresFromTagSetup = (aSt, aTagSetup) => {
	const oScores = aSt.Score.ScoresHigh._ByTag[aTagSetup];
	return oScores ? Array.from(oScores) : [];
}
