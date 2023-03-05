// ScoresHigh.js
// =============
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as ScoresHigh from "./Round/ScoresHigh.js";
//

import { tScorePlay, uCompareScorePlayPlain } from "./ScorePlay.js";
import * as Const from "../Const.js";

import * as _ from "lodash";

// ScoresHigh
// ----------
// The ScoresHigh record stores all player high score data. It is an object
// containing:
//
// - `_ByTag`: An object that associates `tSetup` tag values with arrays of
//   ScorePlay records. These arrays are sorted with `_uCompare` and trimmed to
//   length `Const.CtStoreScoreHigh`.
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

/** Returns `true` if the specified game qualifies as a high score, and if
 *  `aScoresHigh` does _not_ include it. */
export function uCkScoreHigh(aSetup, aCardUser, aCardOgle, aScoresHigh) {
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

/** Returns the array of ScorePlay records in `aScoresHigh` containing the
 *  scores associated with the specified `tSetup` tag, or an empty array, if no
 *  such scores have been recorded. */
export function uScoresPlayTagSetup(aScoresHigh, aTagSetup) {
	const oScores = aScoresHigh._ByTag[aTagSetup];
	return oScores ? Array.from(oScores) : [];
}
