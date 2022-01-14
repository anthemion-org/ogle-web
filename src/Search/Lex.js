// Lex.js
// ------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tLex } from "./Lex.js";
//

import * as Search from "../Util/Search.js";

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
// 'Known' words include built-in words and all user-entered words, including
// unmerged words. These can be checked with uCkKnown, but they cannot
// necessarily be found with a word search.
//
// We distinguish these because the tLook search requires random access to the
// searchable words, and we don't want to sort those every time the user adds a
// new word, especially when it is already too late to include those words in
// the current game. We do want to find the new words if the user re-enters them
// in the same game, however.

/** Stores the Ogle lexicon, including built-in Ogle words, and user-entered
 *  words. */
export class tLex {
	constructor() {
		const oWordsUser = localStorage.WordsUser
			? JSON.parse(localStorage.WordsUser)
			: [];

		/** All searchable words. */
		this.WordsSearch = Array.from(WordsOgle).concat(oWordsUser);
		this.WordsSearch.sort(Search.uCompareStr);

		/** User-entered words that have yet to be merged. */
		this.WordsUserPend = [];
	}

	/** Returns the number of searchable words. */
	uCtSearch() {
		return this.WordsSearch.length;
	}

	/** Returns the searchable word at the specified index. */
	uAtSearch(aj) {
		if ((aj < 0) || (aj >= this.WordsSearch.length))
			throw Error("tLex.uAtSearch: Invalid index");
		return this.WordsSearch[aj];
	}

	/** Returns 'true' if the specified word is known. */
	uCkKnown(aWord) {
		// Ogle does not allow capital letters or accents, so this fast comparison
		// is good enough:
		const ouCompare = Search.uCompareStr;

		let [oCk] = Search.uBin(this.WordsSearch, aWord, ouCompare);
		if (oCk) return true;

		[oCk] = Search.uBin(this.WordsUserPend, aWord, ouCompare);
		return oCk;
	}

	/** Adds the specified word to the user storage and the unmerged user word
	 *  list. */
	uAdd_WordUser(aWord) {
		const oWordsUser = localStorage.WordsUser
			? JSON.parse(localStorage.WordsUser)
			: [];
		oWordsUser.push(aWord);
		localStorage.WordsUser = JSON.stringify(oWordsUser);

		this.WordsUserPend.push(aWord);
		// We must keep this sorted for uCkKnown:
		this.WordsUserPend.sort(Search.uCompareStr);
	}

	/** Merges recent user words into the searchable word list, then empties the
	 *  unmerged user word list. */
	uMerge_WordsUser() {
		if (!this.WordsUserPend.length) return;

		this.WordsSearch.push(...this.WordsUserPend);
		this.WordsSearch.sort(Search.uCompareStr);

		this.WordsUserPend = [];
	}
}
