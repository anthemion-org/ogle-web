// ScoreWord.js
// ------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tScoreWord, Stats, uScoresFromCards } from "./Round/ScoreWord.js";
//

import * as Search from "../Util/Search.js";
import * as Text from "../Util/Text.js";
import * as Cfg from "../Cfg.js";

// tScoreWord
// ----------

export class tScoreWord {
	constructor(aEnt, aStatOgle, aStatUser) {
		this.Ent = aEnt;
		this.Text = aEnt.uTextAll();
		this.StatOgle = aStatOgle;
		this.StatUser = aStatUser;
	}
}

/** Stores properties representing the word score statuses. */
export const Stats = {
	/** The word was missed. */
	Miss: "Miss",
	/** The word was followed by another word. */
	Follow: "Follow",
	/** The word was scored. */
	Score: "Score"
};
Object.freeze(Stats);

export function uScoresFromCards(aCardOgle, aCardUser) {
	// Add user words:
	const oScores = aCardUser.Ents.map(aEnt =>
		new tScoreWord(aEnt, Stats.Miss, Stats.Score)
	);
	oScores.sort(uCompare);

	// Marked followed user words. Followed words were not stored in the Ogle
	// card:
	let oTextPrev = null;
	// Start from the end because longer words have been sorted after shorter:
	for (let oj = (oScores.length - 1); oj >= 0; --oj) {
		const oScoreUser = oScores[oj];
		if (oTextPrev && Text.uCkEqBegin(oScoreUser.Text, oTextPrev))
			oScoreUser.StatUser = Stats.Follow;
		oTextPrev = oScoreUser.Text;
	}

	// Add Ogle words:
	for (const oEnt of aCardOgle.Ents) {
		const oScoreOgle = new tScoreWord(oEnt, Stats.Score, Stats.Miss);
		const [oCk, oj] = Search.uBin(oScores, oScoreOgle, uCompare);
		if (oCk) {
			const oScoreShare = oScores[oj];
			oScoreShare.StatOgle = Stats.Score;
		}
		else oScores.splice(oj, 0, oScoreOgle);
	}

	return oScores;
}

/** Compares tScoreWord instances by their Text values, with shorter values
 *  sorted before longer values. Score statuses are ignored, as are the specific
 *  board positions used to define each entry. */
function uCompare(aL, aR) {
	return Search.uCompareStr(aL.Text, aR.Text);
}
