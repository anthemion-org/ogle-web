// Rg.js
// =====
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Rg from "../Util/Rg.js";
//

import * as UtilJSON from "./UtilJSON.js";

import _ from "lodash";

// Rg
// --
// Each Rg record represents an integer range. This record is mutable.
//
// Maybe this one should be immutable? [refactor]

/** Creates an Rg record that spans the specified integer range, inclusive of
 *  both `aStart` and `aEnd`. Use `-Infinity` or `-Infinity` to define a range
 *  with no lower or upper bound. If `aStart` is greater than `aEnd`, the
 *  range will have zero length. */
export function uNew(aStart, aEnd) {
	return {
		/** The lowest value in the range, or `-Infinity` if there is no lower
		 *  limit. */
		Start: aStart,
		/** The highest value in the range, or `Infinity` if there is no upper
		 *  limit. */
		End: aEnd
	};
}

/** Creates a Rg record from an object produced by `JSON.parse`, or returns
 *  `null` if `aParse` is falsy. */
export function uFromParse(aParse) {
	if (!aParse) return null;

	const oStart = UtilJSON.uNumFromNumFix(aParse.Start, -Infinity);
	const oEnd = UtilJSON.uNumFromNumFix(aParse.End, Infinity);
	return uNew(oStart, oEnd);
}

export function uClone(aRg) {
	return uNew(aRg.Start, aRg.End);
}

/** Returns a short string that summarizes the values in a Rg record. */
export function uTag(aRg) {
	return `S:${aRg.Start} E:${aRg.End}`;
}

/** Returns `true` if `Start` or `End` are `NaN`. */
export function uCkNaN(aRg) {
	return isNaN(aRg.Start) || isNaN(aRg.End);
}

/** Returns the integer length of the range. */
export function uLen(aRg) {
	if (uCkNaN(aRg)) return NaN;
	if (aRg.Start > aRg.End) return 0;
	if (!isFinite(aRg.Start) || !isFinite(aRg.End)) return Infinity;
	return aRg.End - aRg.Start + 1;
}

/** Returns `true` if the specified ranges are equal. */
export function uCkEq(aRgL, aRgR) {
	return _.eq(aRgL.Start, aRgR.Start) && _.eq(aRgL.End, aRgR.End);
}

/** Returns `true` if `aVal` is within `aRg`. */
export function uCkContain(aRg, aVal) {
	if (uCkNaN(aRg) || isNaN(aVal)) return false;
	return (aVal >= aRg.Start) && (aVal <= aRg.End);
}
