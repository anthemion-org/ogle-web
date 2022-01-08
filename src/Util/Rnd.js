// Rnd.js
// ------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Rnd from "../Util/Rnd.js";
//

// Returns an integer less than aCeil, and greater than or equal to zero.
export function uInt(aCeil) {
	return Math.floor(Math.random() * aCeil);
}

// Returns a random array element from ayEls, throwing instead if it is empty.
export function uEl(ayEls) {
	if (!ayEls.length)
		throw new Error("Rnd uEl: Empty array");
	return ayEls[uInt(ayEls.length)];
}
