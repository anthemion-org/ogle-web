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
import * as Misc from "./Misc.js";

import _ from "lodash";

// Pt2
// ---
// Each Pt2 stereotype represents a two-dimensional point. This stereotype is
// immutable.

/** Creates a Pt2 stereotype with the specified coordinates. */
export function uNew(aX, aY) {
	const oPt = { X: aX, Y: aY };
	if (Misc.CkDev) Object.freeze(oPt);
	return oPt;
}

/** Creates a Pt2 stereotype from an object produced by `JSON.parse`, and
 *  returns it, or returns `null` if `aParse` is falsy. */
export function uFromParse(aParse) {
	if (!aParse) return null;

	return uNew(
		UtilJSON.uNumFromNumFix(aParse.X),
		UtilJSON.uNumFromNumFix(aParse.Y)
	);
}

/** Returns `true` if either coordinate is `NaN`. */
export function uCkNaN(aPt) {
	return isNaN(aPt.X) || isNaN(aPt.Y);
}

/** Returns `true` if the specified points are equivalent. */
export function uCkEq(aPtL, aPtR) {
	return _.eq(aPtL.X, aPtR.X) && _.eq(aPtL.Y, aPtR.Y);
}

/** Returns `true` if the specified points are horizontally, vertically, or
 *  diagonally adjacent. */
export function uCkAdjacent(aPtL, aPtR) {
	if (uCkNaN(aPtL) || uCkNaN(aPtR)) return false;

	return (Math.abs(aPtR.X - aPtL.X) <= 1)
		&& (Math.abs(aPtR.Y - aPtL.Y) <= 1)
		&& !uCkEq(aPtL, aPtR);
}

/** Returns a new instance that is the sum of the specified points. */
export function uSum(aPtL, aPtR) {
	return uNew((aPtL.X + aPtR.X), (aPtL.Y + aPtR.Y));
}

/** Returns a new instance that equals the first specified point less the
 *  second. */
export function uDiff(aPtL, aPtR) {
	return uNew((aPtL.X - aPtR.X), (aPtL.Y - aPtR.Y));
}
