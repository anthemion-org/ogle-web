// EntWord.js
// ==========
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as EntWord from "./Round/EntWord.js";
//

import * as Search from "../Util/Search.js";
import * as Rect from "../Util/Rect.js";
import * as Pt2 from "../Util/Pt2.js";
import * as Text from "../Util/Text.js";
import * as Misc from "../Util/Misc.js";
import * as Const from "../Const.js";

// EntWord
// -------
// Each EntWord record stores the details of a single board selection, for use
// when selecting text during play, and for displaying entries in the Score
// view.

/** Creates an entry from the specified position and text arrays. */
export function uNew(aPosi, aTexts) {
	Misc.uCkThrow_Params({ aPosi, aTexts }, Array, "EntWord uNew");
	if (aPosi.length !== aTexts.length)
		throw Error("EntWord uNew: Position/text mismatch");

	const oEnt = {
		/* An array of Pt2 board positions, in selection order. */
		Posi: aPosi,
		/* An array of board text values, in selection order, with their original
		 * case. */
		Texts: aTexts
	};
	// Keep this?: [todo]
	Object.freeze(oEnt);
	return oEnt;
}

/** Creates an EntWord record from an object produced by `JSON.parse`, and
 *  returns it, or returns `null` if `aParse` is falsy. */
export function uFromParse(aPlain) {
	if (!aPlain) return null;
	Misc.uCkThrow_Params({ aPlain }, Object, "EntWord uFromParse");

	const oPosi = aPlain.Posi.map(a => Pt2.uFromParse(a));
	return uNew(oPosi, aPlain.Texts);
}

/** Returns an EntWord record that ends with the specified position and text.
 *  Define `aEntPrev` to create a record that extends that one. */
export function uFromPosText(aPos, aText, aEntPrev) {
	Misc.uCkThrow_Params({ aPos }, Object, "EntWord uFromPosText");
	Misc.uCkThrow_Params({ aText }, String, "EntWord uFromPosText");
	if (aEntPrev)
		Misc.uCkThrow_Params({ aEntPrev }, Object, "EntWord uFromPosText");

	const oPosi = aEntPrev ? [ ...aEntPrev.Posi, aPos ] : [ aPos ];
	const oTexts = aEntPrev ? [ ...aEntPrev.Texts, aText ] : [ aText ];
	return uNew(oPosi, oTexts);
}

/** Returns `true` if the specified position is selected by `aEntWord`. */
export function uCkAt(aEntWord, aPos) {
	Misc.uCkThrow_Params({ aEntWord, aPos }, Object, "EntWord uCkAt");

	return aEntWord.Posi.some(aPosSel => Pt2.uCkEq(aPos, aPosSel));
}

/** Returns `true` if the specified position can be added to the end of
 *  `aEntWord`. */
export function uCkAddAt(aEntWord, aPos) {
	Misc.uCkThrow_Params({ aEntWord, aPos }, Object, "EntWord uCkAddAt");

	if (!Rect.uCkContain(Const.RectBoard, aPos)) return false;

	const oPosEnd = uPosEnd(aEntWord);
	if (!oPosEnd) return false;

	return Pt2.uCkAdjacent(aPos, oPosEnd) && !uCkAt(aEntWord, aPos);
}

/** Returns `true` if `Pos` can be selected or unselected within `aEntWord`. */
export function uCkTogAt(aEntWord, aPos) {
	Misc.uCkThrow_Params({ aEntWord, aPos }, Object, "EntWord uCkTogAt");

	return Rect.uCkContain(Const.RectBoard, aPos)
		&& (uCkAddAt(aEntWord, aPos) || uCkAt(aEntWord, aPos));
}

/** Returns the position that precedes the specified position in `aEntWord`,
 *  or `null` if the position is not part of that record, or if there is no
 *  predecessor. */
export function uPosPrev(aEntWord, aPos) {
	Misc.uCkThrow_Params({ aEntWord, aPos }, Object, "EntWord uPosPrev");

	for (let oj = 1; oj < aEntWord.Posi.length; ++oj)
		if (Pt2.uCkEq(aPos, aEntWord.Posi[oj]))
			return aEntWord.Posi[oj - 1];
	return null;
}

/** Returns the last position in `aEntWord`, or `null` if it is empty. */
export function uPosEnd(aEntWord) {
	Misc.uCkThrow_Params({ aEntWord }, Object, "EntWord uPosEnd");

	if (!aEntWord.Posi.length) return null;
	return aEntWord.Posi[aEntWord.Posi.length - 1];
}

/** Returns the text selected by `aEntWord`, in lowercase. */
export function uTextAll(aEntWord) {
	Misc.uCkThrow_Params({ aEntWord }, Object, "EntWord uTextAll");

	return aEntWord.Texts.join("").toLowerCase();
}

/** Returns an EntWord record that selects the positions in `aEntWord`, but
 *  stops just before `aPos`. Returns `null` instead if the position is not part
 *  of `aEntWord`, or if there is no predecessor. */
export function uClonePrev(aEntWord, aPos) {
	Misc.uCkThrow_Params({ aEntWord, aPos }, Object, "EntWord uClonePrev");

	for (let oj = 1; oj < aEntWord.Posi.length; ++oj)
		if (Pt2.uCkEq(aPos, aEntWord.Posi[oj])) {
			const oPosi = aEntWord.Posi.slice(0, oj);
			const oTexts = aEntWord.Texts.slice(0, oj);
			return uNew(oPosi, oTexts);
		}
	return null;
}

/** Compares two EntWord records by their `uTextAll` values, sorting longer
 *  words before shorter words when one follow the other. This makes it easier
 *  to exclude followed words when processing raw search output with
 *  `Card.uAdd`. The specific board positions used to define each entry are
 *  ignored. */
export function uCompare(aEntWordL, aEntWordR) {
	Misc.uCkThrow_Params({ aEntWordL, aEntWordR }, Object, "EntWord uCompare");

	const oTextL = uTextAll(aEntWordL);
	const oTextR = uTextAll(aEntWordR);

	if (Text.uCkEqBegin(oTextL, oTextR)) {
		if (oTextL.length > oTextR.length) return -1;
		if (oTextL.length < oTextR.length) return 1;
		return 0;
	}

	return Search.uCompareStrFast(oTextL, oTextR);
}
