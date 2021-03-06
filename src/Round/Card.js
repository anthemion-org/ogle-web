// Card.js
// -------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tCard } from "./Round/Card.js";
//

import { tEntWord, uCompareEntWord } from "./EntWord.js";
import * as Text from "../Util/Text.js";
import * as Cfg from "../Cfg.js";

// tCard
// -----

/** Stores one player's results for a single round of play. This class is
 *  mutable. */
export class tCard {
	/** Creates and returns a new card. */
	static suNew() {
		return new tCard(Date.now(), [], 0, 0);
	}

	/** Creates an instance from the specified POD and returns it. */
	static suFromPOD(aPOD) {
		if (!aPOD) return null;

		const oEnts = aPOD.Ents.map(a => tEntWord.suFromPOD(a));
		return new tCard(aPOD.TimeStart, oEnts, aPOD.Score, aPOD.CtBonusTime);
	}

	/** Creates a new instance from an array of tSelBoard instances and returns
	 *  it. This produces an Ogle card from 'SearchBoard.uExec' output. */
	static suFromSelsBoard(aSels) {
		const oEntsAll = aSels.map(a => a.uEntWord());
		// This comparison function sorts longer words before shorter words when one
		// follows the other; otherwise 'tCard.uAdd' would store followed words
		// before it could know that they are followed:
		oEntsAll.sort(uCompareEntWord);

		const oCard = tCard.suNew();
		// Slow, but easy:
		for (const oEnt of oEntsAll)
			oCard.uAdd(oEnt, true)
		return oCard;
	}

	constructor(aTimeStart, aEnts, aScore, aCtBonusTime) {
		/** The UNIX time when this round started. This should be unique across all
		 *  rounds on a given browser. */
		this.TimeStart = aTimeStart;
		/** An array of tEntWord instances representing the word entries recorded by
		 *  this player. */
		this.Ents = Array.from(aEnts);
		/** The score recorded by this player. */
		this.Score = aScore;
		/** The number of time bonuses accrued. Subtract the time elapsed to get the
		 *  time remaining to the player. */
		this.CtBonusTime = aCtBonusTime;
	}

	/** Adds the specified tEntWord instance to Ents, if it meets the minimum
	 *  length, and if it is not a duplicate, and returns 'true' if a valid,
	 *  unfollowed word was entered. If the entry is new, this will be the number
	 *  of letters in the entry, less the minimum word length, plus one. If the
	 *  entry is already followed, it will be zero. If the entry follows an
	 *  existing entry, it will be the number of letters by which the original
	 *  entry length has been exceeded. Set aCkAddFollow to 'false' if followed
	 *  entries should not be added. */
	uAdd(aEnt, aCkAddFollow) {
		const oTextAdd = aEnt.uTextAll();
		if (oTextAdd.length < Cfg.LenWordMin) return false;

		let oCkScore = true;
		let oCtBonus = 1 + oTextAdd.length - Cfg.LenWordMin;
		for (const oEntBefore of this.Ents) {
			// Note that a word-following check is also performed in 'ScoreWord
			// uScoresCoversFromCards'. I don't see a good way to share the
			// functionality, however.

			const oTextBefore = oEntBefore.uTextAll();
			if (uCkFollowEither(oTextAdd, oTextBefore)) {
				oCkScore = false;

				// The new word is a duplicate:
				if (oTextAdd.length === oTextBefore.length) return false;

				// The new word is already followed:
				if (oTextAdd.length < oTextBefore.length) {
					if (aCkAddFollow) this.Ents.push(aEnt);
					return false;
				}

				// The new word follows another, but it could yet follow a longer word,
				// or be followed itself:
				oCtBonus = Math.min(oCtBonus, (oTextAdd.length - oTextBefore.length));
			}
		}

		this.Ents.push(aEnt);
		if (oCkScore) ++this.Score;
		this.CtBonusTime += oCtBonus;
		return (oCtBonus > 0);
	}

	/** Creates and returns a deep copy of this instance. */
	uClone() {
		return new tCard(this.TimeStart, [...this.Ents], this.Score,
			this.CtBonusTime);
	}
}

/** Returns 'true' if either word follows the other, or if they are identical. */
function uCkFollowEither(aL, aR) {
	return Text.uCkEqBegin(aL, aR);
}
