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
// The ScoresHigh record stores all player high score data. This record is
// immutable.

export function uNewEmpty() {
	const oScores = {
		/** An object that associates Setup record tag values with arrays of
		  * ScorePlay records. These arrays are sorted and trimmed to length
		  * `Const.CtStoreScoreHigh`. */
		_ByTag: {}
	};
	Object.freeze(oScores);
	return oScores;

	// An example record:
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

/** Returns the array of ScorePlay records in `aScoresHigh` containing the
 *  scores associated with the specified Setup record tag, or an empty array, if
 *  no such scores have been recorded. */
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

	const oScoresHighNew = _.cloneDeep(aScoresHigh);
	oScoresHighNew._ByTag[aTagSetup] = oScoresPlayNew;
	return oScoresHighNew;
}
