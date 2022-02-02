// Search.js
// ---------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Search from "../Util/Search.js";
//

// Comparison functions
// --------------------

/** Compares numbers. */
export function uCompareNum(aL, aR) {
	return (aL - aR);
}

/** Compares strings by code point, so capital letters and accented letters are
 *  sorted away from their lowercase and unaccented counterparts. */
export function uCompareStrFast(aL, aR) {
	if (aL < aR) return -1;
	if (aL > aR) return 1;
	return 0;
}

/** Compares strings with 'localeCompare', so capital letters and accented
 *  letters are sorted next to their lowercase and unaccented counterparts. */
export function uCompareStrSmart(aL, aR) {
	// This function may be slow:
	//
	//   https://stackoverflow.com/questions/14677060/400x-sorting-speedup-by-switching-a-localecompareb-to-ab-1ab10
	//
	return aL.localeCompare(aR, "en", { sensitivity: "base" });
}

// Search functions
// ----------------

/** Uses a binary search to find aVal within sorted array aEls. Set auCompare to
 *  a custom comparison function, or leave it undefined to compare elements as
 *  numbers. Returns a two-element array containing a boolean value that tells
 *  whether aVal was found, plus the index where a match was or would have been
 *  found.
 *
 *  If provided, the comparison function must accept two arguments, and return a
 *  negative number, zero, or a positive number to signal the first argument's
 *  position relative to the second. */
export function uBin(aEls, aVal, auCompare) {
	if (aEls.length < 1) return [false, 0];

	if (!auCompare) auCompare = uCompareNum;

	let ojLo = 0;
	let ojHi = aEls.length - 1;
	while (ojLo !== ojHi) {
		const ojMid = Math.ceil((ojLo + ojHi) / 2);
		const oPosMid = auCompare(aEls[ojMid], aVal);
		if (oPosMid < 0) {
			ojLo = ojMid;
			continue;
		}
		else if (oPosMid > 0) {
			ojHi = ojMid - 1;
			continue;
		}
		return [true, ojMid];
	}

	const oPosEnd = auCompare(aEls[ojLo], aVal);
	const ojIns = (oPosEnd < 0) ? (ojLo + 1) : ojLo;
	return [!oPosEnd, ojIns];
}
