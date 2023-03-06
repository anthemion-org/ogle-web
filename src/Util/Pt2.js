// Pt2.js
// ======
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Pt2 from "./Util/Pt2.js";
//

import * as UtilJSON from "./UtilJSON.js";

import * as _ from "lodash";

// Pt2
// ---
// Each Pt2 record represents a two-dimensional point.

/** Creates a Pt2 record from an object produced by `JSON.parse`, and returns
 *  it, or returns `null` if `aParse` is falsy. */
export function uFromParse(aParse) {
	if (!aParse) return null;

	return uNew(
		UtilJSON.uNumFromNumFix(aParse.X),
		UtilJSON.uNumFromNumFix(aParse.Y)
	);
}

/** Creates a Pt2 record with the specified coordinates. */
export function uNew(aX, aY) {
	return { X: aX, Y: aY };
}

/** Returns `true` if either coordinate is `NaN`. */
export function uCkNaN(aPt) {
	return isNaN(aPt.X) || isNaN(aPt.Y);
}

/** Returns `true` if the specified records are equal. */
export function uCkEq(aPtL, aPtR) {
	return _.eq(aPtL.X, aPtR.X) && _.eq(aPtL.Y, aPtR.Y);
}

/** Returns `true` if the horizontal and vertical distances between the points
 *  are less than or equal to one, without the points being equal. */
export function uCkAdjacent(aPtL, aPtR) {
	if (uCkNaN(aPtL) || uCkNaN(aPtR)) return false;

	return (Math.abs(aPtR.X - aPtL.X) <= 1)
		&& (Math.abs(aPtR.Y - aPtL.Y) <= 1)
		&& !uCkEq(aPtL, aPtR);
}

/** Returns a new instance that is the sum of the points. */
export function uSum(aPtL, aPtR) {
	return uNew((aPtL.X + aPtR.X), (aPtL.Y + aPtR.Y));
}

/** Returns a new instance that is equal to `aPtL` less `aPtR`. */
export function uDiff(aPtL, aPtR) {
	return uNew((aPtL.X - aPtR.X), (aPtL.Y - aPtR.Y));
}
