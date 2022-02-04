// ScorePlay.js
// ------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tScorePlay, uCompareScorePlay } from "./Round/ScorePlay.js";
//

import * as Search from "../Util/Search.js";
import * as Text from "../Util/Text.js";
import * as Cfg from "../Cfg.js";

// tScorePlay
// ----------

/** Stores player score data for one round. */
export class tScorePlay {
	/** Creates an instance from the specified POD and returns it. */
	static suFromPOD(aPOD) {
		if (!aPOD) return null;

		return new tScorePlay(aPOD.TimeStart, aPOD.Name, aPOD.FracPerc);
	}

	/** Creates an array of instances from the specified POD array and returns it. */
	static suArrFromPODs(aPODs) {
		if (!aPODs) return null;

		return aPODs.map(aPOD => tScorePlay.suFromPOD(aPOD));
	}

	constructor(aTime, aName, aFracPerc) {
		/** The UNIX time when the game started. */
		this.TimeStart = aTime;
		/** The player's name. */
		this.Name = aName;
		/** The player's percent score, as a decimal fraction. */
		this.FracPerc = aFracPerc;
	}
}

/** Compares tScorePlay instances by FracPerc, in descending order, and then by
 *  time, in ascending order. */
export function uCompareScorePlay(aL, aR) {
	if (aL.FracPerc > aR.FracPerc) return -1;
	if (aL.FracPerc < aR.FracPerc) return 1;

	if (aL.TimeStart < aR.TimeStart) return -1;
	if (aL.TimeStart > aR.TimeStart) return 1;
	return 0;
}
