// LookText.js
// -----------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tLookText } from "./LookText.js";
//

import * as Search from "../Util/Search.js";

// tLookText
// ---------

/** Performs a binary search within the searchable word list, and stores the
 *  state of that search, allowing it to be extended and shared as the board is
 *  enumerated. This class is mutable. */
export class tLookText {
	/** Returns a new instance that searches for aText, while reusing the search
	 *  state produced by a previous tLookText instance. */
	static suFromPrev(aLook, aText) {
		return new tLookText(aLook.Words, aText, aLook.jFore, aLook.jAft);
	}

	/** Creates an instances that searches array aWords for aText. Leave ajFore
	 *  and ajAft undefined to start a new search. */
	constructor(aWords, aText, ajFore, ajAft) {
		/** The words to be searched. */
		this.Words = aWords;
		/** The text to be sought by this instance. */
		this.Text = aText;
		/** The word index before the search window. */
		this.jFore = ajFore ?? -1;
		/** The word index after the search window. */
		this.jAft = ajAft ?? aWords.length;
	}

	/** Searches Words for Text, narrowing the window until a match or a miss is
	 *  identified. If aCkStopFrag is 'true', the search will also stop when a
	 *  fragment is identified. Returns the reason the search stopped. */
	uExec(aCkStopFrag) {
		if (this.Words.length < 1) return OutsLook.Miss;

		while (true) {
			const ojMid = Math.floor((this.jFore + this.jAft) / 2);
			const oWord = this.Words[ojMid];
			const oCompare = uCompare(this.Text, oWord);
			// Text sorts before oWord:
			if (oCompare < 0) this.jAft = ojMid;
			// Text sorts after oWord:
			else if (oCompare > 0) this.jFore = ojMid;
			else {
				if (this.Text === oWord) return OutsLook.Match;
				if (aCkStopFrag) return OutsLook.Frag;
				// oWord begins with the letters in Text, but it is longer, so the match
				// (if any) must precede ojMid:
				this.jAft = ojMid;
			}

			// The word in the middle of the window has just been checked. If the
			// window is now one word or less in size, no match will be found:
			if ((this.jAft - this.jFore) <= 1) return OutsLook.Miss;
		}
	}
}

/** Compares aTextLook with aWord, and returns a negative number if it sorts
 *  before, a positive number if it sorts after, and zero if it matches the
 *  beginning or entirety of aWord. */
function uCompare(aTextLook, aWord) {
	// aTextLook represents the current board selection. Because the selection
	// grows as the board is enumerated, we must stop when the search identifies a
	// set of potential future matches. Going further would narrow and focus the
	// window on the start of the word sequence beginning with aTextLook, which
	// could cause words near the end of that set to be missed when the selection
	// grows.
	//
	// When aTextLook is longer than aWord, we match without truncating, as aWord
	// is necessarily too short to match the sequences following aTextLook:
	if (aWord.length > aTextLook.length)
		aWord = aWord.substr(0, aTextLook.length);
	return Search.uCompareStrFast(aTextLook, aWord);
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
