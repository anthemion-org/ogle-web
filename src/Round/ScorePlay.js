// ScorePlay.js
// ============
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as ScorePlay from "./Round/ScorePlay.js";
//

import * as Util from "../Util/Util.js";
import * as Const from "../Const.js";

// ScorePlay
// ---------
// Each ScorePlay record stores player score data for one round. It is an object
// containing:
//
// - `TimeStart`: The UNIX time when the game started;
//
// - `Name`: The player's name;
//
// - `FracPerc`: The player's percent score, as a decimal fraction.
//

/** Returns a ScorePlay record with the specified values. */
export function uNew(aTime, aName, aFracPerc) {
	Util.uCkThrow_Params({ aTime, aFracPerc }, Number, "ScorePlay uNew");
	Util.uCkThrow_Params({ aName }, String, "ScorePlay uNew");

	return {
		TimeStart: aTime,
		Name: aName,
		FracPerc: aFracPerc
	};
}

/** Compares ScorePlay records by FracPerc, in descending order, and then by
 *  time, in ascending order. */
function _uCompare(aL, aR) {
	Util.uCkThrow_Params({ aL, aR }, Object, "ScorePlay _uCompare");

	if (aL.FracPerc > aR.FracPerc) return -1;
	if (aL.FracPerc < aR.FracPerc) return 1;

	if (aL.TimeStart < aR.TimeStart) return -1;
	if (aL.TimeStart > aR.TimeStart) return 1;

	return 0;
}

/** Returns a new ScorePlay array that is sorted with `_uCompare` and trimmed to
 *  length `Const.CtStoreScoreHigh`, after adding `aScorePlayNew`. */
export function uCloneAdd_Scores(aScoresPlayOrig, aScorePlayNew) {
	Util.uCkThrow_Params({ aScoresPlayOrig }, Array, "ScorePlay uCloneAdd_Scores");
	Util.uCkThrow_Params({ aScorePlayNew }, Object, "ScorePlay uCloneAdd_Scores");

	const oScores = [ ...aScoresPlayOrig, aScorePlayNew ];
	oScores.sort(_uCompare);
	return oScores.slice(0, Const.CtStoreScoreHigh);
}
