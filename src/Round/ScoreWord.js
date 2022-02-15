// ScoreWord.js
// ------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tScoreWord, StatsWord, tCover, uScoresCoversFromCards }
//     from "./Round/ScoreWord.js";
//

import * as Search from "../Util/Search.js";
import * as Text from "../Util/Text.js";
import * as Cfg from "../Cfg.js";

// tScoreWord
// ----------

/** Stores score data for a word that was entered during play. This class is
 *  mutable. */
export class tScoreWord {
	constructor(aEnt, aStatOgle, aStatUser) {
		/** An entry that generates this word. This may or may not be the entry
		 *  selected by a given player. */
		this.Ent = aEnt;
		/** The word text. */
		this.Text = aEnt.uTextAll();
		/** A StatsWord value that indicates whether Ogle scored this word. */
		this.StatOgle = aStatOgle;
		/** A StatsWord value that indicates whether the user scored this word. */
		this.StatUser = aStatUser;
	}
}

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

/** Uses the specified cards to compile scoring data. Returns an array
 *  containing:
 *
 *  ~ An array of tScoreWord instances representing all the words found in the
 *    cards;
 *
 *  ~ An object that associates word lengths with tCover instances, these giving
 *    the number of words of each length that were scored by each player.
 */
export function uScoresCoversFromCards(aCardOgle, aCardUser) {
	const oScoresUser = aCardUser.Ents.map(aEnt =>
		new tScoreWord(aEnt, StatsWord.Miss, StatsWord.Score)
	);
	const oScoresOgle = aCardOgle.Ents.map(aEnt =>
		new tScoreWord(aEnt, StatsWord.Score, StatsWord.Miss)
	);

	// Combine word lists
	// ------------------

	const oScores = [...oScoresUser];
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
	// Note that a word-following check is also performed in 'tCard.Add'. I don't
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
		const oLen = Math.min(oScore.Text.length, Cfg.LenCoverMax);

		let oData = oCoversByLen[oLen];
		if (!oData) {
			oData = new tCover();
			oCoversByLen[oLen] = oData;
		}

		++oData.CtTtl;
		if (oScore.StatOgle === StatsWord.Score) ++oData.CtOgle;
		if (oScore.StatUser === StatsWord.Score) ++oData.CtUser;
	}

	return [oScores, oCoversByLen];
}

/** Compares tScoreWord instances alphabetically by Text, and then by ascending
 *  length. Score statuses are ignored, as are the specific board positions used
 *  to define each entry. */
function uCompareByText(aL, aR) {
	return Search.uCompareStrFast(aL.Text, aR.Text);
}

/** Compares tScoreWord instances by descending length, and then alphabetically
 *  by Text. Score statuses are ignored, as are the specific board positions
 *  used to define each entry. */
function uCompareByLen(aL, aR) {
	if (aL.Text.length > aR.Text.length) return -1;
	if (aL.Text.length < aR.Text.length) return 1;
	return Search.uCompareStrFast(aL.Text, aR.Text);
}
