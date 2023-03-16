// UtilJSON.js
// ===========
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as UtilJSON from "./Util/UtilJSON.js";
//

/** Returns a string representation of `aVal` if it is infinite or `NaN`, or the
 *  original value, if it is not. */
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

/** Converts a value processed with `uNumFix` to its original `Number` value, or
 *  `aDef`, if the value is `null`. */
export function uNumFromNumFix(aVal, aDef = NaN) {
	switch (aVal) {
		case "-Infinity": return -Infinity;
		case "Infinity": return Infinity;
		case "NaN": return NaN;
		case null: return aDef;
	}
	return aVal;
}
