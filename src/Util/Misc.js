// Misc.js
// -------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Misc from "../Util/Misc.js";
//

/** Creates and returns a new array of the specified length, with each element
 *  set to aVal. */
export function Gen_Arr(aLen, aVal) {
	return Array(aLen).fill(aVal);
}

/** Returns true if the app is running on a mobile device. */
export function CkMob() {
	return /Mobi/.test(navigator.userAgent);
}
