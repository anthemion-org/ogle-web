// EntWord.js
// ----------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tEntWord, uCompareEntWord } from "./Round/EntWord.js";
//

import * as Search from "../Util/Search.js";
import { tPt2 } from "../Util/Pt2.js";
import * as Text from "../Util/Text.js";
import * as Cfg from "../Cfg.js";

// tEntWord
// --------

/** Stores the details of a single board selection, for use when selecting text
 *  during play, and for displaying entries in the Score view. */
export class tEntWord {
	/** Creates an instance from the specified POD and returns it. */
	static suFromPOD(aPod) {
		if (!aPod) return null;

		const oPosi = aPod.Posi.map(a => tPt2.suFromPOD(a));
		return new tEntWord(oPosi, aPod.Texts);
	}

	/** Creates and returns a new instance that ends with the specified position
	 *  and text. Define aEntPrev to create an instance that extends that one. */
	static suFromPosText(aPos, aText, aEntPrev) {
		const oPosi = aEntPrev ? [...aEntPrev.Posi, aPos] : [aPos];
		const oTexts = aEntPrev ? [...aEntPrev.Texts, aText] : [aText];
		return new tEntWord(oPosi, oTexts);
	}

	/** Creates an entry from the specified position and text arrays. */
	constructor(aPosi, aTexts) {
		if (aPosi.length !== aTexts.length)
			throw Error("tEntWord: Position/text mismatch");

		/* An array of board positions, in selection order. */
		this.Posi = aPosi;
		/* An array of board text values, in selection order, with their original
		 * case. */
		this.Texts = aTexts;
	}

	/** Returns 'true' if the specified position is selected. */
	uCkAt(aPos) {
		return this.Posi.some(a => a.uCkEq(aPos));
	}

	/** Returns 'true' if the specified position can be added to the end of this
	 *  entry. */
	uCkAddAt(aPos) {
		return Cfg.RectBoard.uCkContain(aPos)
			&& this.uPosEnd()?.uCkAdjacent(aPos)
			&& !this.uCkAt(aPos);
	}

	/** Returns 'true' if the specified position can be selected or unselected. */
	uCkTogAt(aPos) {
		return Cfg.RectBoard.uCkContain(aPos)
			&& (this.uCkAddAt(aPos) || this.uCkAt(aPos));
	}

	/** Returns the position that precedes the specified position in this entry,
	 *  or 'null' if the position is not part of this entry, or if there is no
	 *  predecessor. */
	uPosPrev(aPos) {
		for (let oj = 1; oj < this.Posi.length; ++oj)
			if (this.Posi[oj].uCkEq(aPos))
				return this.Posi[oj - 1];
		return null;
	}

	/** Returns last the position in this entry, or 'null' if the entry is empty. */
	uPosEnd() {
		if (!this.Posi.length) return null;
		return this.Posi[this.Posi.length - 1];
	}

	/** Returns the text selected by this entry, in lowercase. */
	uTextAll() {
		return this.Texts.join("").toLowerCase();
	}

	/** Returns a new instance that selects the positions in this entry, but stops
	 *  just before the specified position. Returns 'null' instead if the position
	 *  is not part of this entry, or if there is no predecessor. */
	uEntPrev(aPos) {
		for (let oj = 1; oj < this.Posi.length; ++oj)
			if (this.Posi[oj].uCkEq(aPos)) {
				const oPosi = this.Posi.slice(0, oj);
				const oTexts = this.Texts.slice(0, oj);
				return new tEntWord(oPosi, oTexts);
			}
		return null;
	}
}

/** Compares tEntWord instances by their uTextAll values, sorting longer words
 *  before shorter words when one follow the other. This makes it easier to
 *  exclude followed words when processing raw search output with tCard.uAdd.
 *  The specific board positions used to define each entry are ignored. */
export function uCompareEntWord(aL, aR) {
	const oTextL = aL.uTextAll();
	const oTextR = aR.uTextAll();

	if (Text.uCkEqBegin(oTextL, oTextR)) {
		if (oTextL.length > oTextR.length) return -1;
		if (oTextL.length < oTextR.length) return 1;
		return 0;
	}

	return Search.uCompareStrFast(oTextL, oTextR);
}
