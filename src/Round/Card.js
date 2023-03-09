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
import * as Const from "../Const.js";

// Card
// ----
// Each Card record stores one player's results for a single round of play.

/** Creates a new, empty Card record. */
export function uNewEmpty() {
	return uNew(Date.now(), [], 0, 0);
}

/** Creates a Card record with the specified values. */
export function uNew(aTimeStart, aEnts, aScore, aCtBonusTime) {
	const oCard = {
		/** The UNIX time when this round started. This should be unique across all
		*  rounds on a given browser. */
		TimeStart: aTimeStart,
		/** An array of EntWord records representing the word entries recorded by
		*  this player. */
		Ents: Array.from(aEnts),
		/** The score recorded by this player. */
		Score: aScore,
		/** The number of time bonuses accrued. Subtract the time elapsed to get the
		*  time remaining to the player. */
		CtBonusTime: aCtBonusTime
	};
	// Notice that this one isn't frozen; the class was mutable: [todo]
	return oCard;
}

/** Creates a Card record from an object produced by `JSON.parse`, and returns
 *  it, or returns `null` if `aParse` is falsy. */
export function uFromParse(aParse) {
	if (!aParse) return null;

	const oEnts = aParse.Ents.map(a => EntWord.uFromParse(a));
	return uNew(aParse.TimeStart, oEnts, aParse.Score, aParse.CtBonusTime);
}

/** Creates a new Card record from an array of `tSelBoard` instances and returns
 *  it. This produces an Ogle card from `SearchBoard.uExec` output. */
export function uFromSelsBoard(aSels) {
	const oEntsAll = aSels.map(a => a.uEntWord());
	// This comparison function sorts longer words before shorter words when one
	// follows the other; otherwise `uAdd` would store followed words before it
	// could know that they are followed:
	oEntsAll.sort(EntWord.uCompare);

	const oCard = uNewEmpty();
	// Slow, but easy:
	for (const oEnt of oEntsAll)
		uAdd(oCard, oEnt, true)
	return oCard;
}

/** Returns `true` if either word follows the other, or if they are identical. */
function _uCkFollowEither(aWordL, aWordR) {
	return Text.uCkEqBegin(aWordL, aWordR);
}

/** Adds the specified EntWord record to Ents, if it meets the minimum length,
 *  and if it is not a duplicate, and returns `true` if a valid, unfollowed word
 *  was entered. If the entry is new, this will be the number of letters in the
 *  entry, less the minimum word length, plus one. If the entry is already
 *  followed, it will be zero. If the entry follows an existing entry, it will
 *  be the number of letters by which the original entry length has been
 *  exceeded. Set `aCkAddFollow` to `false` if followed entries should not be
 *  added. */
export function uAdd(aCard, aEnt, aCkAddFollow) {
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
				if (aCkAddFollow) aCard.Ents.push(aEnt);
				return false;
			}

			// The new word follows another, but it could yet follow a longer word,
			// or be followed itself:
			oCtBonus = Math.min(oCtBonus, (oTextAdd.length - oTextBefore.length));
		}
	}

	aCard.Ents.push(aEnt);
	if (oCkScore) ++aCard.Score;
	aCard.CtBonusTime += oCtBonus;
	return (oCtBonus > 0);
}

/** Returns a deep copy of the specified Card record. */
export function uClone(aCard) {
	return uNew(
		aCard.TimeStart,
		[ ...aCard.Ents ],
		aCard.Score,
		aCard.CtBonusTime
	);
}
