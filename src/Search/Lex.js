// Lex.js
// ======
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import Lex from "./Lex.js";
//

// For performance reasons, we should not `uCkThrow_Params` in this module!

import * as Search from "../Util/Search.js";
import * as Persist from "../Persist.js";

// This import adds almost one half-second to the test time. Is it that slow in
// the browser? [optimize]
//
/** Words in the built-in Ogle lexicon. */
import WordsOgle from "./WordsOgle.json";

// _tLex
// -----
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
// be better. If so, this can be greatly simplified. [refactor]

/** Manages the Ogle lexicon, including built-in Ogle words, and user-entered
 *  words. This class is mutable. */
class _tLex {
	constructor() {
		/** An array of strings representing all user-entered words. */
		//
		// There is no need for this data to be moved to the store; it is not used
		// to render pages, and `_tLex` is instantiated only once, when the app
		// loads.
		//
		// Jest mocks the `localStorage` object, so the `Persist` system will run,
		// but it will not return anything. We could inject this particular
		// dependency, but there is no need right now:
		this.WordsUser = Persist.uRead("WordsUser", []);
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
		Persist.uWrite("WordsUser", this.WordsUser);

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

const Lex = new _tLex();
export default Lex;

export const ForTest = {
	_tLex
};
