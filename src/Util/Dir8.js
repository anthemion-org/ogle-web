// Dir8.js
// =======
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Dir8 from "../Util/Dir8.js";
//

/** Stores properties representing the eight cardinal and intermediate
 *  directions. */
export const Vals = {
	E: "E",
	NE: "NE",
	N: "N",
	NW: "NW",
	W: "W",
	SW: "SW",
	S: "S",
	SE: "SE"
};
Object.freeze(Vals);

/** Returns `true` if the specified value is a `Vals` member. */
export function uCk(aDir8) {
	return Vals.hasOwnProperty(aDir8);
}

/** Throws if the specified value is not a `Vals` member. */
export function uCkThrow(aDir8, aNameCaller) {
	if (!uCk(aDir8))
		throw Error(`${aNameCaller}: Invalid Dir8 '${aDir8}'`);
}

/** Returns a random Vals member. */
export function uRnd(aGenRnd) {
	return aGenRnd.uEl(Object.values(Vals));
}

