// UtilJSON.js
// ===========
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as UtilJSON from "./Util/UtilJSON.js";
//

import * as _ from "lodash";

/** Returns a string representation of `aVal` if it is infinite or `NaN`.
 *  Otherwise, returns the original value. */
//
// This is a `JSON.stringify` replacer function:
//
//   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#the_replacer_parameter
//
// It accepts key and value arguments representing properties to be serialized.
// This particular replacer works around JSON's idiotic inability to represent
// infinite or `NaN` values:
export function uNumFix(aKey, aVal) {
	if (typeof aVal !== "number") return aVal;

	if (aVal === Infinity) return "Infinity";
	if (aVal === -Infinity) return "-Infinity";
	if (isNaN(aVal)) return "NaN";
	return aVal;
}

export function uNumFromNumFix(aVal) {
	switch (aVal) {
		case "-Infinity":
			return -Infinity;

		case "Infinity":
			return Infinity;

		case "NaN":
		case null:
			return NaN;
	}
	return aVal;
}
