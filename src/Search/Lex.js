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
// current game. We do want to find the new words if the user re-enters them in
// the same game, however. Now I wonder whether immediate merging would be
// better. If so, this can be greatly simplified. [to do]

/** Manages the Ogle lexicon, including built-in Ogle words, and user-entered
 *  words. */
export class tLex {
	/** Uses the specified POD to create and return a new tLex instance. */
	static suFromPOD(aPOD) {
		return new tLex(aPOD.WordsSearch, aPOD.WordsUserPend);
	}

	/** Provide no arguments to load searchable words from the WordsOgle file, and
	 *  from the WordsUser property in the Store. */
	constructor(aWordsSearch, aWordsUserPend) {
		if (aWordsSearch)
			/** All searchable words. This array will be shared with tLookLex when a
			 *  search is performed. */
			this.WordsSearch = aWordsSearch;
		else {
			const oWordsUser = Store.uGet("WordsUser");
			this.WordsSearch = Array.from(WordsOgle).concat(oWordsUser);
			this.WordsSearch.sort(Search.uCompareStr);
		}

		/** User-entered words that have yet to be merged. */
		this.WordsUserPend = aWordsUserPend ?? [];
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
		const oWordsUser = Store.uGet("WordsUser");
		oWordsUser.push(aWord);
		Store.uSet("WordsUser", oWordsUser);

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
