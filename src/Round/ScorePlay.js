// ScorePlay.js
// ============
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as ScorePlay from "./Round/ScorePlay.js";
//

import * as Misc from "../Util/Misc.js";
import * as Const from "../Const.js";

// ScorePlay
// ---------
// Each ScorePlay stereotype stores player score data for one round. It is an
// object containing:
//
// - `TimeStart`: The UNIX time when the game started;
//
// - `Name`: The player's name;
//
// - `FracPerc`: The player's percent score, as a decimal fraction.
//
// This stereotype is immutable.

/** Returns a ScorePlay stereotype with the specified values. */
export function uNew(aTime, aName, aFracPerc) {
	Misc.uCkThrow_Params({ aTime, aFracPerc }, Number, "ScorePlay uNew");
	Misc.uCkThrow_Params({ aName }, String, "ScorePlay uNew");

	const oScore = {
		TimeStart: aTime,
		Name: aName,
		FracPerc: aFracPerc
	};
	Object.freeze(oScore);
	return oScore;
}

/** Compares ScorePlay stereotypes by FracPerc, in descending order, and then by
 *  time, in ascending order. */
function _uCompare(aL, aR) {
	Misc.uCkThrow_Params({ aL, aR }, Object, "ScorePlay _uCompare");

	if (aL.FracPerc > aR.FracPerc) return -1;
	if (aL.FracPerc < aR.FracPerc) return 1;

	if (aL.TimeStart < aR.TimeStart) return -1;
	if (aL.TimeStart > aR.TimeStart) return 1;

	return 0;
}

/** Returns a new ScorePlay array that is sorted with `_uCompare` and trimmed to
 *  length `Const.CtStoreScoreHigh`, after adding `aScorePlayNew`. */
export function uCloneAdd_Score(aScoresPlayOrig, aScorePlayNew) {
	Misc.uCkThrow_Params({ aScoresPlayOrig }, Array, "ScorePlay uCloneAdd_Score");
	Misc.uCkThrow_Params({ aScorePlayNew }, Object, "ScorePlay uCloneAdd_Score");

	const oScores = [ ...aScoresPlayOrig, aScorePlayNew ];
	oScores.sort(_uCompare);
	return oScores.slice(0, Const.CtStoreScoreHigh);
}
