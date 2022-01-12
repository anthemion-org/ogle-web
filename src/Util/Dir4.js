// Dir4.js
// --------
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

/** Returns 'true' if the specified value is a Vals member. */
export function uCk(aDir) {
	return Vals.hasOwnProperty(aDir);
}

/** Returns a random Vals member. */
export function uRnd(aqGenRnd) {
	return aqGenRnd.uEl(Object.values(Vals));
}
