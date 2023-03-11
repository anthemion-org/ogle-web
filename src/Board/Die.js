// Die.js
// ======
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Die from "../Die.js";
//

import * as Dir4 from "../Util/Dir4.js";
import * as Misc from "../Util/Misc.js";

// Die
// ---
// Each Die record represents one die within a board.

/** Creates a Die record with the specified text and orientation. Throws if
 *  `aDir4` is not a member of `Dir4.Vals`. */
export function uNew(aText, aDir4) {
	Misc.uCkThrow_Params({ aText }, String, "Die uNew");
	Dir4.uCkThrow(aDir4, "Die uNew");

	const oDie = {
		/** The die text. */
		Text: aText,
		/** The side of the die with which the text top aligns. */
		Dir4: aDir4,
		/** Set to `true` if the text should be underlined. */
		CkUnder: [ "L", "T", "N", "Z", "W" ].includes(aText)
	};
	Object.freeze(oDie);
	return oDie;
}

/** Creates a Die record from an object produced by `JSON.parse`, and returns
 *  it, or returns `null` if `aParse` is falsy. */
export function uFromParse(aParse) {
	if (!aParse) return null;
	Misc.uCkThrow_Params({ aParse }, Object, "Die uFromParse");

	return uNew(aParse.Text, Dir4.Vals[aParse.Dir4]);
}
