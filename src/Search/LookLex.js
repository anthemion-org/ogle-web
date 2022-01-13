// LookLex.js
// ----------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tLookLex, OutsLook } from "./LookLex.js";
//

import { tLex } from "./Lex.js";
import * as Search from "../Util/Search.js";

// tLookLex
// --------

/** Stores the state of a binary search within the lexicon, allowing that state
 *  to be extended and shared as the board is enumerated. */
export class tLookLex {
	static suFromPrev(aqLook, aText) {
		return new tLookLex(aqLook.qLex, aText, aqLook.jFore, aqLook.jAft);
	}

	/** Leave ajFore and ajAft undefined to start a new search. */
	constructor(aqLex, aText, ajFore, ajAft) {
		/** The lexicon to be searched. */
		this.qLex = aqLex;
		/** The text to be sought by this instance. */
		this.Text = aText;
		/** The lexicon index before the search window. */
		this.jFore = ajFore ?? -1;
		/** The lexicon index after the search window. */
		this.jAft = ajAft ?? aqLex.uCtSearch();
	}

	/** Searches qLex for Text, narrowing the window until a match or a miss is
	 *  identified. If aCkStopFrag is 'true', the search will also stop when a
	 *  fragment is identified. Returns the reason the search stopped. */
	uExec(aCkStopFrag) {
		if (this.qLex.uCtSearch() < 1) return OutsLook.Miss;

		while (true) {
			const ojMid = Math.floor((this.jFore + this.jAft) / 2);
			const oTextLex = this.qLex.uAtSearch(ojMid);
			const oCompare = uCompare(this.Text, oTextLex);
			// Text sorts before oTextLex:
			if (oCompare < 0) this.jAft = ojMid;
			// Text sorts after oTextLex:
			else if (oCompare > 0) this.jFore = ojMid;
			else {
				if (this.Text === oTextLex) return OutsLook.Match;
				if (aCkStopFrag) return OutsLook.Frag;
				// oTextLex begins with the letters in Text, but it is longer, so the
				// match (if any) must precede ojMid:
				this.jAft = ojMid;
			}

			// The word in the middle of the window has just been checked. If the
			// window is now one word or less in size, no match will be found:
			if ((this.jAft - this.jFore) <= 1) return OutsLook.Miss;
		}
	}
}

/** Compares aTextLook with aTextLex, and returns a negative number if it sorts
 *  before, a positive number if it sorts after, and zero if it matches the
 *  beginning or entirety of aTextLex. */
function uCompare(aTextLook, aTextLex) {
	// aTextLook represents the current board selection. Because the selection
	// grows as the board is enumerated, we must stop when the search identifies a
	// set of potential future matches. Going further would narrow and focus the
	// window on the start of the word sequence beginning with aTextLook, which
	// could cause words near the end of that set to be missed when the selection
	// grows.
	//
	// When aTextLook is longer than aTextLex, we match without truncating, as
	// aTextLex is necessarily too short to match the sequences following
	// aTextLook:
	if (aTextLex.length > aTextLook.length)
		aTextLex = aTextLex.substr(0, aTextLook.length);
	return Search.uCompareStr(aTextLook, aTextLex);
}

/** Stores properties representing word search outcomes. */
export const OutsLook = {
	/** The word was not found. */
	Miss: "Miss",
	/** A word was found that begins with the letters of the sought word, but is
	 *  longer. */
	Frag: "Frag",
	/** An exact match was found. */
	Match: "Match"
};
Object.freeze(OutsLook);
