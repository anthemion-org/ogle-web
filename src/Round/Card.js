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

export class tCard {
	/** Creates and returns a new card. */
	static suNew() {
		return new tCard([], 0, 0);
	}

	/** Creates an instance from the specified POD and returns it. */
	static suFromPOD(aData) {
		if (!aData) return null;

		const oEnts = aData.Ents.map(a => tEntWord.suFromPOD(a));
		return new tCard(oEnts, aData.Score, aData.CtBonusTime);
	}

	/** Creates new instance from the specified board search results, and returns
	 *  it. */
	static suFromSelsBoard(aSels) {
		const oEntsAll = aSels.map(a => a.uEntWord());
		oEntsAll.sort(uCompareEntWord);

		const oCard = tCard.suNew();
		// Slow, but easy:
		for (const oEnt of oEntsAll)
			oCard.uAdd(oEnt, false)
		return oCard;
	}

	constructor(aEnts, aScore, aCtBonusTime) {
		this.Ents = aEnts;
		this.Score = aScore;
		/** The number of time bonuses accrued. Subtract the time elapsed to get the
		 *  time remaining to the player. */
		this.CtBonusTime = aCtBonusTime;
	}

	/** Adds the specified entry, if it meets the minimum length, and if it is not
	 *  a duplicate, and returns the number of bonuses produced by the addition.
	 *  If the entry is new, this will be the number of letters in the entry, less
	 *  the minimum word length, plus one. If the entry is already followed, it
	 *  will be zero. If the entry follows an existing entry, it will be the
	 *  number of letters by which the original entry length has been exceeded.
	 *  Set aCkAddFollow to 'false' if followed entries should not be added. */
	uAdd(aEnt, aCkAddFollow) {
		const oTextAdd = aEnt.uTextAll();
		if (oTextAdd.length < Cfg.LenWordMin) return;

		let oCkScore = true;
		let oCtBonus = 1 + oTextAdd.length - Cfg.LenWordMin;
		for (const oEntOrig of this.Ents) {
			const oTextOrig = oEntOrig.uTextAll();
			if (Text.uCkEqBegin(oTextAdd, oTextOrig)) {
				oCkScore = false;

				// The new word is a duplicate:
				if (oTextAdd.length === oTextOrig.length) return;

				// The new word is already followed:
				if (oTextAdd.length < oTextOrig.length) {
					if (aCkAddFollow) this.Ents.push(aEnt);
					return;
				}

				// The new word follows another, but it could follow a longer word, or
				// be followed itself:
				oCtBonus = Math.min(oCtBonus, (oTextAdd.length - oTextOrig.length));
			}
		}

		this.Ents.push(aEnt);
		if (oCkScore) ++this.Score;
		this.CtBonusTime += oCtBonus;
	}

	/** Creates and returns a clone of this instance. */
	uClone() {
		return new tCard([...this.Ents], this.Score, this.CtBonusTime);
	}
}