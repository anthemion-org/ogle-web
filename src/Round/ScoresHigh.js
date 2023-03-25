// ScoresHigh.js
// =============
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as ScoresHigh from "./Round/ScoresHigh.js";
//

import * as ScorePlay from "./ScorePlay.js";
import * as Setup from "./Setup.js";
import * as Misc from "../Util/Misc.js";
import * as Const from "../Const.js";

import _ from "lodash";

// ScoresHigh
// ----------
// The ScoresHigh stereotype stores all player high score data. This stereotype
// is immutable.

export function uNew(aByTag) {
	Misc.uCkThrow_Params({ aByTag }, Object, "ScoresHigh uNew");

	const oScores = {
		/** An object that associates Setup stereotype tag values with arrays of
		  * ScorePlay stereotypes. These arrays are sorted and trimmed to length
		  * `Const.CtStoreScoreHigh`. */
		_ByTag: aByTag
	};
	Object.freeze(oScores);
	return oScores;

	// An example stereotype:
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
}

export function uNewEmpty() {
	return uNew({});
}

/** Creates a ScoresHigh stereotype from an object produced by `JSON.parse`, or
 *  returns `null` if `aParse` is falsy. */
export function uFromParse(aParse) {
	// This function does nothing at present, but it seems better to use it from
	// the start, in case JSON-incompatible data is added later.

	if (!aParse) return null;
	Misc.uCkThrow_Params({ aParse }, Object, "ScoresHigh uFromParse");

	return uNew(aParse._ByTag);
}

/** Returns `true` if the specified game qualifies as a high score, and if
 *  `aScoresHigh` does _not_ include it. */
export function uCkScoreHigh(aSetup, aCardUser, aCardOgle, aScoresHigh) {
	Misc.uCkThrow_Params(
		{ aSetup, aCardUser, aCardOgle, aScoresHigh },
		Object, "ScoresHigh uCkScoreHigh"
	);

	if (aCardUser.Score < 1) return false;

	const oTagSetup = Setup.uTag(aSetup);
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

/** Returns the array of ScorePlay stereotypes in `aScoresHigh` containing the
 *  scores associated with the specified Setup stereotype tag, or an empty
 *  array, if no such scores have been recorded. */
export function uScoresPlayTagSetup(aScoresHigh, aTagSetup) {
	Misc.uCkThrow_Params({ aScoresHigh }, Object,
		"ScoresHigh uScoresPlayTagSetup");
	Misc.uCkThrow_Params({ aTagSetup }, String, "ScoresHigh uScoresPlayTagSetup");

	const oScores = aScoresHigh._ByTag[aTagSetup];
	return oScores ? Array.from(oScores) : [];
}

export function uCloneAdd_Score(aScoresHigh, aTagSetup, aScorePlay) {
	Misc.uCkThrow_Params({ aScoresHigh, aScorePlay }, Object,
		"ScoresHigh uCloneAdd_Score");
	Misc.uCkThrow_Params({ aTagSetup }, String, "ScoresHigh uCloneAdd_Score");

	const oScoresPlayOrig = aScoresHigh._ByTag[aTagSetup] ?? [];
	const oScoresPlayNew = ScorePlay.uCloneAdd_Score(oScoresPlayOrig, aScorePlay);

	// Are the copied ScorePlay stereotypes also frozen?: [refactor]
	const oScoresHighNew = _.cloneDeep(aScoresHigh);
	oScoresHighNew._ByTag[aTagSetup] = oScoresPlayNew;
	return oScoresHighNew;
}
