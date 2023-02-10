// Lex.js
// ------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import Lex from "./Lex.js";
//

import * as Search from "../Util/Search.js";
import * as Store from "../Store.js";

// This import adds almost one half-second to the test time. Is it that slow in
// the browser? [optimize]
//
/** Words in the built-in Ogle lexicon. */
import WordsOgle from "./WordsOgle.json";

// tLex
// ----
// 'Searchable' words include built-in words, plus user-entered words that have
// been merged. Only these words can be found with the Ogle word search.
//
// 'Known' words include built-in words and user-entered words, whether merged
// or not. These can be checked with uCkKnown, but they cannot necessarily be
// found with a word search.
//
// I distinguished these because the tLookupText search requires random access
// to the searchable words, and I didn't want to sort those every time the user
// adds a new word, especially when it is already too late to include them in
// the current round. We do want to find the new words if the user re-enters
// them in the same round, however. Now I wonder whether immediate merging would
// be better. If so, this can be greatly simplified. [todo]

/** Manages the Ogle lexicon, including built-in Ogle words, and user-entered
 *  words. This class is mutable. */
class tLex {
	constructor() {
		/** An array of strings representing all user-entered words. */
		this.WordsUser = Store.uGetPlain("WordsUser");
		this.WordsUser.sort(Search.uCompareStrFast);

		/** An array of strings representing all searchable words. This array will
		 *  be shared with tLookupText when a search is performed. */
		this.WordsSearch = Array.from(WordsOgle).concat(this.WordsUser);
		this.WordsSearch.sort(Search.uCompareStrFast);

		/** An array of strings representing user-entered words that have yet to be
		 *  merged. */
		this.WordsUserPend = [];
	}

	/** Returns `true` if the specified word is user-entered. */
	uCkUser(aWord) {
		// Ogle does not allow capital letters or accents, so this fast comparison
		// is good enough:
		const ouCompare = Search.uCompareStrFast;
		const [oCk] = Search.uBin(this.WordsUser, aWord, ouCompare);
		return oCk;
	}

	/** Returns `true` if the specified word is known. */
	uCkKnown(aWord) {
		// Ogle does not allow capital letters or accents, so this fast comparison
		// is good enough:
		const ouCompare = Search.uCompareStrFast;

		let [oCk] = Search.uBin(this.WordsSearch, aWord, ouCompare);
		if (oCk) return true;

		[oCk] = Search.uBin(this.WordsUserPend, aWord, ouCompare);
		return oCk;
	}

	/** Adds the specified word to the user storage and the unmerged user word
	 *  list. */
	uAdd_WordUser(aWord) {
		this.WordsUser.push(aWord);
		this.WordsUser.sort(Search.uCompareStrFast);
		Store.uSet("WordsUser", this.WordsUser);

		this.WordsUserPend.push(aWord);
		this.WordsUserPend.sort(Search.uCompareStrFast);
	}

	/** Merges recent user words into the searchable word list, then empties the
	 *  unmerged user word list. */
	uMerge_WordsUser() {
		if (!this.WordsUserPend.length) return;

		this.WordsSearch.push(...this.WordsUserPend);
		this.WordsSearch.sort(Search.uCompareStrFast);

		this.WordsUserPend = [];
	}
}

const Lex = new tLex();
export default Lex;

export const ForTest = {
	tLex
};
