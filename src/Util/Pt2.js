// Pt2.js
// ======
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Pt2 from "./Util/Pt2.js";
//

import * as _ from "lodash";

// Pt2
// ---
// Each Pt2 record represents a two-dimensional point.

/** Creates a Pt2 record from an object produced by `JSON.parse`, and returns
 *  it, or returns `null` if `aParse` is falsy. This converts strings like
 *  'Infinity' and 'NaN' to `Number` values, as JSON cannot represent these
 *  without help. */
export function suFromParse(aParse) {
	if (!aParse) return null;

	const oPt2 = { ...aParse };
	for (const on in oPt2) {
		switch (oPt2[on]) {
			case "-Infinity":
				oPt2[on] = -Infinity;
				break;

			case "Infinity":
				oPt2[on] = Infinity;
				break;

			case "NaN":
			case null:
				oPt2[on] = NaN;
				break;
		}
	}
	return oPt2;
}

export function uNew(aX, aY) {
	return { X: aX, Y: aY };
}

/** Returns `true` if the specified records are equal. */
export function uCkEq(aPtL, aPtR) {
	// `_.eq` returns `true` if both are `NaN`:
	return _.eq(aPtL.X, aPtR.X) && _.eq(aPtL.Y, aPtR.Y);
}

/** Returns `true` if the horizontal and vertical distances between the points
 *  are less than or equal to one, without the points being equal. */
export function uCkAdjacent(aPtL, aPtR) {
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
