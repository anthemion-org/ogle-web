// Misc.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Misc from "../Util/Misc.js";
//

/** Returns 'true' if aNum is an integer 'number' instance. */
export function uCkNumInt(aNum) {
	return (typeof aNum === "number")
		&& !isNaN(aNum)
		&& (Math.floor(aNum) === aNum);
}
