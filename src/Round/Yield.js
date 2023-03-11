// Yield.js
// =======
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Yield from "./Round/Yield.js";
//

import * as Rg from "../Util/Rg.js";
import * as Misc from "../Util/Misc.js";

/** Yield ranges to be offered to the user. */
export const Vals = [
	Rg.uNew(1, 10),
	Rg.uNew(1, 40),
	Rg.uNew(60, 100),
 	Rg.uNew(120, 160),
	Rg.uNew(180, Infinity)
];
Object.freeze(Vals);

/** The `Vals` index of the default yield. */
//
// Defining the default this way causes trouble when the array is modified:
// [refactor]
const jValDef = 4;

/** Returns the default yield range. */
export function uDef() {
	return Vals[jValDef];
}

/** Returns the `Vals` index that matches the specified Setup record, or the
 *  default index, if no match is found. */
export function uIdxValMatchOrDef(aSetup) {
	Misc.uCkThrow_Params({ aSetup }, Object, "Yield uIdxValMatchOrDef");

	for (let oj = 0; oj < Vals.length; ++oj)
		if (Rg.uCkEq(Vals[oj], aSetup.Yield)) return oj;
	return jValDef;
}

/** Returns a description of the yield range at the specified `Vals` index. */
export function uDesc(ajYield) {
	Misc.uCkThrow_Params({ ajYield }, Number, "Yield uDesc");

	const oYield = Vals[ajYield];
	if (!isFinite(oYield.Start))
		return `At most ${oYield.End} words in the board`;
	if (!isFinite(oYield.End))
		return `${oYield.Start} or more words in the board`;
	return `${oYield.Start} to ${oYield.End} words in the board`;
}
