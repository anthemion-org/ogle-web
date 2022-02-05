// ScoresHigh.js
// -------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tScoresHigh } from "../Round/ScoresHigh.js";
//

import { tScorePlay, uCompareScorePlay } from "./ScorePlay.js";
import * as Cfg from "../Cfg.js";

// tScoresHigh
// -----------

/** Manages the player high score data. This class is immutable. */
export class tScoresHigh {
	/** Creates an instance from the specified POD and returns it. */
	static suFromPOD(aPOD) {
		if (!aPOD) return null;

		const oScoresByTag = { ...aPOD._ScoresByTag };
		for (const on in oScoresByTag)
			oScoresByTag[on] = tScorePlay.suArrFromPODs(oScoresByTag[on]);
		return new tScoresHigh(oScoresByTag);
	}

	constructor(aScoresByTag) {
		/** An object that associates tSetup tag values with arrays of tScorePlay. */
		this._ScoresByTag = aScoresByTag;
	}

	uScores(aTagSetup) {
		const oScores = this._ScoresByTag[aTagSetup];
		return oScores ? Array.from(oScores) : [];
	}

	/** Returns 'true' if the specified game produced a high score that is not
	 *  recorded in this instance. */
	uCkHigh(aSetup, aCardUser, aCardOgle) {
		if (aCardUser.Score < 1) return false;

		const oTagSetup = aSetup.uTag();
		const oScores = this._ScoresByTag[oTagSetup];
		if (!oScores || !oScores.length)
			return true;

		if (oScores.some(a => a.TimeStart === aCardUser.TimeStart))
			return false;

		if (oScores.length < Cfg.CtStoreScoreHigh)
			return true;

		const oFracPerc = aCardUser.Score / aCardOgle.Score;
		return oScores.some(a => a.FracPerc < oFracPerc);
	}

	/** Creates and returns a deep copy of this instance. */
	uClone() {
		const oScoresByTag = {};
		for (const on in this._ScoresByTag)
			oScoresByTag[on] = Array.from(this._ScoresByTag[on]);
		return new tScoresHigh(oScoresByTag);
	}

	/** Creates and returns a new instance that adds the specified game as a high
	 *  score. */
	uCloneAdd(aSetup, aScorePlay) {
		const oClone = this.uClone();
		const oTagSetup = aSetup.uTag();
		const oScores = oClone._ScoresByTag[oTagSetup] ?? [];
		oScores.push(aScorePlay);
		oScores.sort(uCompareScorePlay);
		oClone._ScoresByTag[oTagSetup] = oScores.slice(0, Cfg.CtStoreScoreHigh);
		return oClone;
	}
}
