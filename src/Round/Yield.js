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
import * as Pt2 from "../Util/Pt2.js";

/** Yield ranges to be offered to the user. */
export const Vals = [
	// I guess we're storing arrays here in case another value is needed, as in
	// the pace elements?:
	[ Rg.uNew(1, 10) ],
	[ Rg.uNew(1, 20) ],
	[ Rg.uNew(1, 40) ],
	[ Rg.uNew(60, 100)],
 	[ Rg.uNew(120, 160) ],
	[ Rg.uNew(180, Infinity) ]
];
Object.freeze(Vals);

/** The `Vals` index of the default yield. */
//
// Defining the default this way causes trouble when the array is modified:
// [refactor]
const jValDef = 5;

/** Returns the default yield range. */
export function uDef() {
	return Vals[jValDef];
}

/** Returns the `Vals` index that matches `aSetup`, or the default index, if no
 *  match is found. */
export function uIdxValMatchOrDef(aSetup) {
	for (let oj = 0; oj < Vals.length; ++oj)
		if (Rg.uCkEq(Vals[oj][0], aSetup.Yield)) return oj;
	return jValDef;
}

/** Returns a description of the yield range at the specified `Vals` index. */
export function uDesc(ajYield) {
	const oYield = Vals[ajYield][0];
	if (!isFinite(oYield.Start))
		return `At most ${oYield.End} words`;
	if (!isFinite(oYield.End))
		return `${oYield.Start} or more words`;
	return `Between ${oYield.Start} and ${oYield.End} words`;
}
