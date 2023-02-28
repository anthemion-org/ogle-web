// SliceScore.js
// =============
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import SliceScore from "./Store/SliceScore.js";
//

import * as Persist from "../Persist.js";
import * as Const from "../Const.js";

import { createSlice } from "@reduxjs/toolkit";

// ScorePlay
// ---------
// A ScorePlay record stores player score data for one round. It is an object
// containing:
//
// - `TimeStart`: The UNIX time when the game started;
//
// - `Name`: The player's name;
//
// - `FracPerc`: The player's percent score, as a decimal fraction.
//

/** Returns a ScorePlay record with the specified values. */
export function ScorePlayNew(aTime, aName, aFracPerc) {
	return {
		TimeStart: aTime,
		Name: aName,
		FracPerc: aFracPerc
	};
}

/** Compares ScorePlay records by FracPerc, in descending order, and then by
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

// ScoresHigh
// ----------
// The ScoresHigh record stores all player high score data. It is an object
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

/** Returns `true` if the specified game produced a high score that is _not_
 *  recorded in `aScoresHigh`. */
export function uCkHighScore(aScoresHigh, aSetup, aCardUser, aCardOgle) {
	if (aCardUser.Score < 1) return false;

	const oTagSetup = aSetup.uTag();
	const oScores = aScoresHigh._ByTag[oTagSetup];
	if (!oScores || !oScores.length)
		return true;

	if (oScores.some(a => a.TimeStart === aCardUser.TimeStart))
		return false;

	if (oScores.length < Const.CtStoreScoreHigh)
		return true;

	const oFracPerc = aCardUser.Score / aCardOgle.Score;
	return oScores.some(a => a.FracPerc < oFracPerc);
}

/** Returns an array of Score Play records from `aScoresHigh` containing the
 *  scores associated with the specified `tSetup` tag. */
export function uScoresPlayTagSetup(aScoresHigh, aTagSetup) {
	const oScores = aScoresHigh._ByTag[aTagSetup];
	return oScores ? Array.from(oScores) : [];
}

// Slice
// -----

export const Slice = createSlice({
	name: "Score",

	initialState: {
		/** The name last entered by any player when a high score was recorded, or
		 *  the empty string if the player choose to remain anonymous. */
		NamePlayLast: Persist.uRead("NamePlayLast") ?? "",
		/** The ScoresHigh record. */
		ScoresHigh: Persist.uRead("ScoresHigh") ?? { _ByTag: {} }
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

export const { Set_NamePlayLast, Add_ScoreHigh } = Slice.actions;

// Selectors
// ---------

/** Selects the name last entered by any player when a high score was recorded,
 *  or the empty string if the player choose to remain anonymous. */
export const uSelNamePlayLast = (aSt) => aSt.Score.NamePlayLast;

/** Selects the ScoresHigh record. */
export const uSelScoresHigh = (aSt) => aSt.Score.ScoresHigh;
