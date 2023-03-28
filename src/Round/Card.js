// Card.js
// =======
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Card from "./Round/Card.js";
//

import * as EntWord from "./EntWord.js";
import * as Text from "../Util/Text.js";
import * as Misc from "../Util/Misc.js";
import * as Const from "../Const.js";

// Card
// ----
// Each Card stereotype stores one player's results for a single round of play.
// This stereotype is mutable.

/** Creates a new, empty Card stereotype. */
export function uNewEmpty() {
	return uNew(Date.now(), [], 0, 0);
}

/** Creates a Card stereotype with the specified values. */
export function uNew(aTimeStart, aEnts, aScore, aCtBonusTime) {
	Misc.uCkThrow_Params({ aTimeStart, aScore, aCtBonusTime }, Number, "Card uNew");
	Misc.uCkThrow_Params({ aEnts }, Array, "Card uNew");

	const oCard = {
		/** The UNIX time when this round started. This should be unique across all
		 *  rounds on a given browser. */
		TimeStart: aTimeStart,
		/** An array of EntWord stereotypes representing the word entries recorded
		 *  by this player. */
		Ents: Array.from(aEnts),
		/** The score recorded by this player. */
		Score: aScore,
		/** The number of time bonuses accrued. Subtract the time elapsed to get the
		 *  time remaining to the player. */
		CtBonusTime: aCtBonusTime
	};
	return oCard;
}

/** Creates a Card stereotype from an object produced by `JSON.parse`, and
 *  returns it, or returns `null` if `aParse` is falsy. */
export function uFromParse(aParse) {
	if (!aParse) return null;
	Misc.uCkThrow_Params({ aParse }, Object, "Card uFromParse");

	const oEnts = aParse.Ents.map(a => EntWord.uFromParse(a));
	return uNew(aParse.TimeStart, oEnts, aParse.Score, aParse.CtBonusTime);
}

/** Creates a new Card stereotype from an array of `tSelBoard` instances and
 *  returns it. This produces an Ogle card from `SearchBoard.uExec` output. */
export function uFromSelsBoard(aSels) {
	Misc.uCkThrow_Params({ aSels }, Array, "Card uFromSelsBoard");

	const oEntsAll = aSels.map(a => a.uEntWord());
	// This comparison function sorts longer words before shorter words when one
	// follows the other; otherwise `uAdd` would store followed words before it
	// could know that they are followed:
	oEntsAll.sort(EntWord.uCompare);

	const oCard = uNewEmpty();
	// Slow, but easy:
	oEntsAll.forEach(oEnt => uAdd(oCard, oEnt, true, false));
	return oCard;
}

/** Returns `true` if either word follows the other, or if they are identical. */
function _uCkFollowEither(aWordL, aWordR) {
	Misc.uCkThrow_Params({ aWordL, aWordR }, String, "Card _uCkFollowEither");

	return Text.uCkEqBegin(aWordL, aWordR);
}

/** Adds an EntWord stereotype to the specified Card stereotype, if it meets the
 *  length minimum, and if it is not already followed or a duplicate, then
 *  returns `true` if the entry was added. Set `aCkAddFollow` to `true` if the
 *  entry should be added even if it was followed. Set `aCkSkipAdd` to `true` to
 *  return the result without actually changing the card. */
export function uAdd(aCard, aEnt, aCkAddFollow, aCkSkipAdd) {
	Misc.uCkThrow_Params({ aCard, aEnt }, Object, "Card uAdd");
	Misc.uCkThrow_Params({ aCkAddFollow, aCkSkipAdd }, Boolean, "Card uAdd");

	const oTextAdd = EntWord.uTextAll(aEnt);
	if (oTextAdd.length < Const.LenWordMin) return false;

	let oCkScore = true;
	let oCtBonus = 1 + oTextAdd.length - Const.LenWordMin;
	for (const oEntBefore of aCard.Ents) {
		// Note that a word-following check is also performed in 'ScoreWord
		// uScoresCoversFromCards'. I don't see a good way to share the
		// functionality, however.

		const oTextBefore = EntWord.uTextAll(oEntBefore);
		if (_uCkFollowEither(oTextAdd, oTextBefore)) {
			oCkScore = false;

			// The new word is a duplicate:
			if (oTextAdd.length === oTextBefore.length) return false;

			// The new word is already followed:
			if (oTextAdd.length < oTextBefore.length) {
				if (aCkAddFollow && !aCkSkipAdd) aCard.Ents.push(aEnt);
				return false;
			}

			// The new word follows another, but it could yet follow a longer word,
			// or be followed itself:
			oCtBonus = Math.min(oCtBonus, (oTextAdd.length - oTextBefore.length));
		}
	}

	if (!aCkSkipAdd) {
		aCard.Ents.push(aEnt);
		if (oCkScore) ++aCard.Score;
		aCard.CtBonusTime += oCtBonus;
	}
	return (oCtBonus > 0);
}

/** Returns a deep copy of the specified Card stereotype. */
export function uClone(aCard) {
	Misc.uCkThrow_Params({ aCard }, Object, "Card uClone");

	return uNew(
		aCard.TimeStart,
		[ ...aCard.Ents ],
		aCard.Score,
		aCard.CtBonusTime
	);
}
