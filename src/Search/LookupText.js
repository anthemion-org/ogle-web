// LookupText.js
// =============
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tLookupText } from "./LookupText.js";
//

// For performance reasons, we should not `uCkThrow_Params` in this module!

import * as Search from "../Util/Search.js";

// tLookupText
// -----------

/** Performs a binary search within the searchable word list, and stores the
 *  state of that search, allowing it to be extended and shared as the board is
 *  enumerated. This class is mutable. */
export class tLookupText {
	/** Returns a new instance that searches for `aText`, while reusing the search
	 *  state produced by a previous `tLookupText` instance. */
	static suFromPrev(aLookup, aText) {
		return new tLookupText(aLookup._Words, aText, aLookup._jFore,
			aLookup._jAft);
	}

	/** Creates an instances that searches array `aWords` for `aText`. Leave
	 *  `ajFore` and `ajAft` undefined to start a new search. */
	constructor(aWords, aText, ajFore, ajAft) {
		/** The words to be searched. */
		this._Words = aWords;
		/** The text to be sought by this instance. */
		this._Text = aText;
		/** The word index before the search window. */
		this._jFore = ajFore ?? -1;
		/** The word index after the search window. */
		this._jAft = ajAft ?? aWords.length;
	}

	/** Searches _Words for _Text, narrowing the window until a match or a miss is
	 *  identified. If aCkStopFrag is `true`, the search will also stop when a
	 *  fragment is identified. Returns the reason the search stopped. */
	uExec(aCkStopFrag) {
		if (this._Words.length < 1) return OutsLookup.Miss;

		while (true) {
			const ojMid = Math.floor((this._jFore + this._jAft) / 2);
			const oWord = this._Words[ojMid];
			const oCompare = uCompare(this._Text, oWord);
			// _Text sorts before oWord:
			if (oCompare < 0) this._jAft = ojMid;
			// _Text sorts after oWord:
			else if (oCompare > 0) this._jFore = ojMid;
			else {
				if (this._Text === oWord) return OutsLookup.Match;
				if (aCkStopFrag) return OutsLookup.Frag;
				// oWord begins with the letters in _Text, but it is longer, so the match
				// (if any) must precede ojMid:
				this._jAft = ojMid;
			}

			// The word in the middle of the window has just been checked. If the
			// window is now one word or less in size, no match will be found:
			if ((this._jAft - this._jFore) <= 1) return OutsLookup.Miss;
		}
	}
}

/** Compares `aTextLookup` with `aWord`, and returns a negative number if it
 *  sorts before, a positive number if it sorts after, and zero if it matches
 *  the beginning or entirety of aWord. */
function uCompare(aTextLookup, aWord) {
	// aTextLookup represents the current board selection. Because the selection
	// grows as the board is enumerated, we must stop when the search identifies a
	// set of potential future matches. Going further would narrow and focus the
	// window on the start of the word sequence beginning with aTextLookup, which
	// could cause words near the end of that set to be missed when the selection
	// grows.
	//
	// When aTextLookup is longer than aWord, we match without truncating, as
	// aWord is necessarily too short to match the sequences following
	// aTextLookup:
	if (aWord.length > aTextLookup.length)
		aWord = aWord.substr(0, aTextLookup.length);
	return Search.uCompareStrFast(aTextLookup, aWord);
}

/** Stores properties representing word search outcomes. */
export const OutsLookup = {
	/** The word was not found. */
	Miss: "Miss",
	/** A word was found that begins with the letters of the sought word, but is
	 *  longer. */
	Frag: "Frag",
	/** An exact match was found. */
	Match: "Match"
};
Object.freeze(OutsLookup);
