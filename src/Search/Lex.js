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

export class tLex {
	constructor() {
		// All 'searchable' words, which include built-in words, plus user-entered
		// words that have been merged. Only these words can be found with the Ogle
		// word search.
		this.yWordsSearch = Array.from(yWordsOgle);

		// User-entered words that have yet to be merged.
		this.yWordsUserPend = localStorage.yWordsUser;
	}

	// Returns the number of 'searchable' words.
	uCtSearch() {
		return this.yWordsSearch.length;
	}

	// Returns the 'searchable' word at the specified index.
	uAtSearch(aj) {
		if (isNaN(aj) || (aj < 0) || (aj >= this.yWordsSearch.length))
			throw new Error("tLex.uAt: Invalid index");
		return this.yWordsSearch[aj];
	}

	// Returns 'true' if the specified word is known. This includes searchable
	// words, and user-entered words that have yet to be merged.
	uCkAll(aWord) {
		// Ogle does not allow capital letters or accents, so this fast comparison
		// is good enough.
		const ouCompare = Search.uCompareStr;

		let [ oCk ] = Search.uBin(this.yWordsSearch, aWord, ouCompare);
		if (oCk) return true;

		[ oCk ] = Search.uBin(this.yWordsUserPend, aWord, ouCompare);
		return oCk;
	}

	// Add user words...
	// Merge user words...
	// Expose word elements...
}
