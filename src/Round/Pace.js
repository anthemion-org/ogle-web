// Pace.js
// -------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Pace from "./Round/Pace.js";
//

import * as Text from "../Util/Text.js";

/** Pace values to be offered to the user. Each element stores the starting time
 *  and the bonus time. */
export const Vals = [
	[48, 8],
	[36, 6],
	[30, 5],
	[24, 4],
	[18, 3],
	[15, 2.5],
	[12, 2],
	[9, 1.5],
	[6, 1]
];
Object.freeze(Vals);

/** The `Vals` index of the default pace. */
const jValDef = 2;

/** Returns an array containing the default starting time and bonus time. */
export function uDef() {
	return Vals[jValDef];
}

/** Returns the `Paces` index that matches `aSetup`, or the default index, if no
 *  match is found. */
export function uIdxValMatchOrDef(aSetup) {
	for (let oj = 0; oj < Vals.length; ++oj) {
		const [oPaceStart, oPaceBonus] = Vals[oj];
		if ((oPaceStart === aSetup.PaceStart)
			&& (oPaceBonus === aSetup.PaceBonus))
			return oj;
	}
	return jValDef;
}

/** Returns a short, user-friendly description of the specified pace. */
export function uDesc(ajPace) {
	const oPace = Vals[ajPace];
	const oStart = Text.uProseNum(oPace[0]);
	const oBonus = Text.uProseNum(oPace[1]);
	const oSuffBonus = ((oPace[1] > 1) ? "s" : "");
	const oText = `Start with ${oStart} seconds and gain ${oBonus} second${oSuffBonus} for each letter over three in every entered word`;
	return Text.uFracNice(oText);
}
