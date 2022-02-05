// Yield.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Yield from "./Round/Yield.js";
//

import { tRg } from "../Util/Rg.js";

/** Yield ranges to be offered to the user. */
export const Vals = [
	[new tRg(1, 40)],
	[new tRg(60, 100)],
	[new tRg(120, 160)],
	[new tRg(180, Infinity)]
];

/** The Vals index of the default yield. */
const jValDef = 2;

/** Returns the default yield range. */
export function uDef() {
	return Vals[jValDef];
}

/** Returns the Vals index that matches aSetup, or the default index, if no
 *  match is found. */
export function uIdxVal(aSetup) {
	for (let oj = 0; oj < Vals.length; ++oj)
		if (Vals[oj][0].uCkEq(aSetup.Yield)) return oj;
	return jValDef;
}

export function uInstruct(ajYield) {
	const oYield = Vals[ajYield][0];
	if (!isFinite(oYield.Start))
		return `At most ${oYield.End} words.`;
	if (!isFinite(oYield.End))
		return `At least ${oYield.Start} words.`;
	return `Between ${oYield.Start} and ${oYield.End} words.`;
}
