// ScorePlay.js
// ------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tScorePlay, uCompareScorePlay } from "./Round/ScorePlay.js";
//

// tScorePlay
// ----------

/** Stores player score data for one round. This class is immutable. */
export class tScorePlay {
	/** Creates an instance from a plain object and returns it. */
	static suFromPlain(aPlain) {
		if (!aPlain) return null;

		return new tScorePlay(aPlain.TimeStart, aPlain.Name, aPlain.FracPerc);
	}

	/** Creates an array of instances from a plain object array and returns it. */
	static suArrFromPlains(aPlains) {
		if (!aPlains) return null;

		return aPlains.map(aPlain => tScorePlay.suFromPlain(aPlain));
	}

	constructor(aTime, aName, aFracPerc) {
		/** The UNIX time when the game started. */
		this.TimeStart = aTime;
		/** The player's name. */
		this.Name = aName;
		/** The player's percent score, as a decimal fraction. */
		this.FracPerc = aFracPerc;

		Object.freeze(this);
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
