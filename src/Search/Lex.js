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
// We distinguish these because the tLook search requires random access to the
// searchable words, and we don't want to sort those every time the user adds a
// new word, especially when it is already too late to include them in the
// current round. We do want to find the new words if the user re-enters them in
// the same round, however. Now I wonder whether immediate merging would be
// better. If so, this can be greatly simplified. [to do]

/** Manages the Ogle lexicon, including built-in Ogle words, and user-entered
 *  words. */
class tLex {
	constructor() {
		const oWordsUser = Store.uGetPOD("WordsUser");
		/** All searchable words. This array will be shared with tLookText when a
		 *  search is performed. */
		this.WordsSearch = Array.from(WordsOgle).concat(oWordsUser);
		this.WordsSearch.sort(Search.uCompareStrFast);

		/** User-entered words that have yet to be merged. */
		this.WordsUserPend = [];
	}

	/** Returns 'true' if the specified word is known. */
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
		const oWordsUser = Store.uGetPOD("WordsUser");
		oWordsUser.push(aWord);
		Store.uSet("WordsUser", oWordsUser);

		this.WordsUserPend.push(aWord);
		// We must keep this sorted for uCkKnown:
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
