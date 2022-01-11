// Lex.js
// ------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tLex } from "../Lex.js";
//

import * as Search from "../Util/Search.js";

// Words in the built-in Ogle lexicon.
//
// This import adds almost one half-second to the test time. Is it that slow in
// the browser? [optimize]
import yWordsOgle from "./WordsOgle.json";

// tLex
// ----
// 'Searchable' words include built-in words, plus user-entered words that have
// been merged. Only these words can be found with the Ogle word search.
//
// 'Known' words include built-in words and all user-entered words, including
// unmerged words. These can be checked with uCkKnown, but they cannot
// necessarily be found with a word search.

export class tLex {
	constructor() {
		// All 'searchable' words.
		this.yWordsSearch = Array.from(yWordsOgle);

		// Merge stored user words into the 'searchable' list:
		const oyWordsUser = localStorage.yWordsUser
			? JSON.parse(localStorage.yWordsUser)
			: [];
		this.yWordsSearch.push(...oyWordsUser);
		this.yWordsSearch.sort(Search.uCompareStr);

		// User-entered words that have yet to be merged.
		this.yWordsUserPend = [];
	}

	// Returns the number of 'searchable' words.
	uCtSearch() {
		return this.yWordsSearch.length;
	}

	// Returns the 'searchable' word at the specified index.
	uAtSearch(aj) {
		if (isNaN(aj) || (aj < 0) || (aj >= this.yWordsSearch.length))
			throw new Error("tLex.uAtSearch: Invalid index");
		return this.yWordsSearch[aj];
	}

	// Returns 'true' if the specified word is 'known'.
	uCkKnown(aWord) {
		// Ogle does not allow capital letters or accents, so this fast comparison
		// is good enough.
		const ouCompare = Search.uCompareStr;

		let [oCk] = Search.uBin(this.yWordsSearch, aWord, ouCompare);
		if (oCk) return true;

		[oCk] = Search.uBin(this.yWordsUserPend, aWord, ouCompare);
		return oCk;
	}

	// Adds the specified word to the user storage and the unmerged user word
	// list.
	uAdd_WordUser(aWord) {
		const oyWordsUser = localStorage.yWordsUser
			? JSON.parse(localStorage.yWordsUser)
			: [];
		oyWordsUser.push(aWord);
		localStorage.yWordsUser = JSON.stringify(oyWordsUser);

		this.yWordsUserPend.push(aWord);
		// We must keep this sorted for uCkKnown:
		this.yWordsUserPend.sort(Search.uCompareStr);
	}

	// Merges recent user words into the 'searchable' word list, then empties the
	// unmerged user word list.
	uMerge_WordsUser() {
		if (!this.yWordsUserPend.length) return;

		this.yWordsSearch.push(...this.yWordsUserPend);
		this.yWordsSearch.sort(Search.uCompareStr);

		this.yWordsUserPend = [];
	}
}
