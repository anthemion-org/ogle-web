// Dir4.js
// =======
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Dir4 from "../Util/Dir4.js";
//

/** Stores properties representing the four cardinal directions. */
export const Vals = {
	E: "E",
	N: "N",
	W: "W",
	S: "S"
};
Object.freeze(Vals);

/** Returns `true` if the specified value is a `Vals` member. */
export function uCk(aDir4) {
	return Vals.hasOwnProperty(aDir4);
}

/** Throws if the specified value is not a `Vals` member. */
export function uCkThrow(aDir4, aNameCaller) {
	if (!uCk(aDir4))
		throw Error(`${aNameCaller}: Invalid Dir4 '${aDir4}'`);
}

/** Returns the direction, in degrees, referenced by the specified Dir4 value. */
export function uDeg(aDir4) {
	switch (aDir4) {
		case "E": return 0;
		case "N": return 90;
		case "W": return 180;
		case "S": return 270;
	}
	throw Error(`Dir4 uDeg: Invalid Dir4 '${aDir4}'`);
}

/** Returns a random Vals member. */
export function uRnd(aGenRnd) {
	return aGenRnd.uEl(Object.values(Vals));
}
