// ScoreWord.js
// ============
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tScoreWord, StatsWord, tCover, uScoresCoversFromCards }
//     from "./Round/ScoreWord.js";
//

import Lex from "../Search/Lex.js";
import * as EntWord from "./EntWord.js";
import * as Search from "../Util/Search.js";
import * as Text from "../Util/Text.js";
import * as Misc from "../Util/Misc.js";
import * as Const from "../Const.js";

// tScoreWord
// ----------

/** Stores score data for a word that was entered during play. This class is
 *  mutable. */
export class tScoreWord {
	constructor(aEnt, aStatOgle, aStatUser, aCkWordUser) {
		Misc.uCkThrow_Params({ aEnt }, Object, "tScoreWord constructor");
		Misc.uCkThrow_Params({ aStatOgle, aStatUser }, String, "tScoreWord constructor");
		uCkThrow_StatWord(aStatOgle, "tScoreWord constructor");
		uCkThrow_StatWord(aStatUser, "tScoreWord constructor");
		Misc.uCkThrow_Params({ aCkWordUser }, Boolean, "tScoreWord constructor");

		/** An entry that generates this word. This may or may not be the entry
		 *  selected by a given player. */
		this.Ent = aEnt;
		/** The word text. */
		this.Text = EntWord.uTextAll(aEnt);
		/** A StatsWord value that indicates whether Ogle scored this word. */
		this.StatOgle = aStatOgle;
		/** A StatsWord value that indicates whether the user scored this word. */
		this.StatUser = aStatUser;
		/** Set to `true` if the word represented by this instance is part of the
		 *  user-entered lexicon. */
		this.CkWordUser = aCkWordUser;
	}
}

/** Compares `tScoreWord` instances alphabetically by `Text`, and then by
 *  ascending length. Score statuses are ignored, as are the specific board
 *  positions used to define each entry. */
function uCompareByText(aScoreWordL, aScoreWordR) {
	Misc.uCkThrow_Params({ aScoreWordL, aScoreWordR }, tScoreWord,
		"ScoreWord uCompareByText");

	return Search.uCompareStrFast(aScoreWordL.Text, aScoreWordR.Text);
}

/** Compares `tScoreWord` instances by descending length, and then
 *  alphabetically by `Text`. Score statuses are ignored, as are the specific
 *  board positions used to define each entry. */
function uCompareByLen(aScoreWordL, aScoreWordR) {
	Misc.uCkThrow_Params({ aScoreWordL, aScoreWordR }, tScoreWord,
		"ScoreWord uCompareByLen");

	if (aScoreWordL.Text.length > aScoreWordR.Text.length) return -1;
	if (aScoreWordL.Text.length < aScoreWordR.Text.length) return 1;
	return Search.uCompareStrFast(aScoreWordL.Text, aScoreWordR.Text);
}

/** Uses the specified Card stereotypes to compile scoring data. Returns an
 *  array containing:
 *
 *  - An array of `tScoreWord` instances representing all the words found in the
 *    cards;
 *
 *  - An object that associates word lengths with `tCover` instances, these
 *    giving the number of words of each length that were scored by each player.
 */
export function uScoresCoversFromCards(aCardOgle, aCardUser) {
	Misc.uCkThrow_Params(
		{ aCardOgle, aCardUser }, Object, "ScoreWord uScoresCoversFromCards"
	);

	function ouCkWordUser(aEnt) {
		return Lex.uCkUser(EntWord.uTextAll(aEnt));
	}

	const oScoresUser = aCardUser.Ents.map(aEnt =>
		new tScoreWord(aEnt, StatsWord.Miss, StatsWord.Score, ouCkWordUser(aEnt))
	);
	const oScoresOgle = aCardOgle.Ents.map(aEnt =>
		new tScoreWord(aEnt, StatsWord.Score, StatsWord.Miss, ouCkWordUser(aEnt))
	);

	// Combine word lists
	// ------------------

	const oScores = [ ...oScoresUser ];
	// So that 'Search.uBin' can be used:
	oScores.sort(uCompareByText);

	// Add Ogle words:
	for (const oScoreOgle of oScoresOgle) {
		const [oCk, oj] = Search.uBin(oScores, oScoreOgle, uCompareByText);
		// Combine word statuses:
		if (oCk) oScores[oj].StatOgle = oScoreOgle.StatOgle;
		// or add new word:
		else oScores.splice(oj, 0, oScoreOgle);
	}

	// Mark followed words
	// -------------------
	// Note that a word-following check is also performed in 'Card.uAdd'. I don't
	// see a good way to share the functionality, however.

	let oTextPrevUser = null;
	let oTextPrevOgle = null;
	// Start from the end because longer words have been sorted after shorter:
	for (let oj = (oScores.length - 1); oj >= 0; --oj) {
		const oScore = oScores[oj];
		if (oTextPrevUser && Text.uCkEqBegin(oScore.Text, oTextPrevUser))
			oScore.StatUser = StatsWord.Follow;
		if (oTextPrevOgle && Text.uCkEqBegin(oScore.Text, oTextPrevOgle))
			oScore.StatOgle = StatsWord.Follow;

		if (oScore.StatUser === StatsWord.Score) oTextPrevUser = oScore.Text;
		if (oScore.StatOgle === StatsWord.Score) oTextPrevOgle = oScore.Text;
	}

	oScores.sort(uCompareByLen);

	// Derive coverage statistics
	// --------------------------

	const oCoversByLen = {};

	for (const oScore of oScores) {
		const oLen = Math.min(oScore.Text.length, Const.LenCoverMax);

		let oData = oCoversByLen[oLen];
		if (!oData) {
			oData = new tCover();
			oCoversByLen[oLen] = oData;
		}

		++oData.CtTtl;
		if (oScore.StatOgle === StatsWord.Score) ++oData.CtOgle;
		if (oScore.StatUser === StatsWord.Score) ++oData.CtUser;
	}

	return [ oScores, oCoversByLen ];
}

// StatsWord
// ---------

/** Stores properties representing the word score statuses. */
export const StatsWord = {
	/** The word was missed. */
	Miss: "Miss",
	/** The word was followed by another word. */
	Follow: "Follow",
	/** The word was scored. */
	Score: "Score"
};
Object.freeze(StatsWord);

/** Returns `true` if the specified value is a `StatsWord` member. */
export function uCk_StatWord(aStatWord) {
	return StatsWord.hasOwnProperty(aStatWord);
}

/** Throws if the specified value is not a `StatsWord` member. */
export function uCkThrow_StatWord(aStatWord, aNameCaller) {
	if (!uCk_StatWord(aStatWord))
		throw Error(`${aNameCaller}: Invalid StatWord '${aStatWord}'`);
}

// tCover
// ------

/** Stores word score coverage data for one word length. This class is mutable. */
export class tCover {
	constructor() {
		/** The total number of words with this length. */
		this.CtTtl = 0;
		/** The number of words with this length scored by Ogle. */
		this.CtOgle = 0;
		/** The number of words with this length scored by the user. */
		this.CtUser = 0;
	}
}
