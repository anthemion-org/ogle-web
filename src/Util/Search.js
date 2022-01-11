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

// Compares numbers.
export function uCompareNum(aL, aR) {
	return (aL - aR);
}

// Compares strings by code point, so capital letters and accented letters are
// sorted away from their lowercase and unaccented counterparts.
export function uCompareStr(aL, aR) {
	// Strings can also be compared with 'localeCompare':
	//
	//   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
	//
	// but that function may be slow:
	//
	//   https://stackoverflow.com/questions/14677060/400x-sorting-speedup-by-switching-a-localecompareb-to-ab-1ab10
	//

	if (aL < aR) return -1;
	if (aL > aR) return 1;
	return 0;
}

// Search functions
// ----------------

// Uses a binary search to find aVal within array 'ay'. Set auComp to a custom
// comparison function, or leave it undefined to compare elements as numbers.
// Returns a two-element array containing a boolean value that tells whether
// aVal was found, plus the index where a match was or would have been found.
//
// If provided, the comparison function must accept two arguments, and return a
// negative number, zero, or a positive number to signal the first argument's
// position relative to the second.
export function uBin(ay, aVal, auCompare) {
	// Adapted from the Bottenbruch algorithm at:
	//
	//   https://en.wikipedia.org/wiki/Binary_search_algorithm
	//

	if (!ay || !ay.length)
		throw new Error("Search uBin: Invalid array");

	if (!auCompare) auCompare = uCompareNum;

	let ojL = 0;
	let ojR = ay.length - 1;
	while (ojL !== ojR) {
		const ojM = Math.ceil((ojL + ojR) / 2);
		if (auCompare(ay[ojM], aVal) > 0) ojR = ojM - 1;
		else ojL = ojM;
	}
	return [
		auCompare(ay[ojL], aVal) !== 0,
		ojL
	];
}
