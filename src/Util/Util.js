// Util.js
// =======
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Util from "../Util/Util.js";
//

/** Returns `true` if the app is running in production. */
export function uCkProduction() {
	return (process.env.NODE_ENV === 'production');
}

/** Accepts an object `aParams` containing one or more function parameters, plus
 *  constructor `aTypeExpect` that should be common to those parameters. Throws
 *  if any parameter is `undefined` or `null`, or if any parameter fails to
 *  match `aTypeExpect`. If `aNameCaller` is defined, the exception message will
 *  be prefixed with that text. Does nothing if the app is running in
 *  production. */
//
// Examples:
//
//   function uUseNums(aNum0, aNum1) {
//     Util.uCkThrow_Params({ aNum0, aNum1 }, Number, "uUseNums");
//     ...
//
//   function uUseSuper(aSuper) {
//     Util.uCkThrow_Params({ aSuper }, tSuper, "uUseSuper");
//     ...
//
export function uCkThrow_Params(aParams, aTypeExpect, aNameCaller) {
	// This function has not been tested with minified code. The `aTypeExpect`
	// check should work as usual, but error messages will reference the minified
	// names of any custom classes.

	// Right now I'm thinking of this function as more of a development and
	// testing tool. The app already runs well in production, so any exceptions it
	// throws are likely to be a nuisance for real users, rather than a help.
	// Maybe we will remove this later, however:
	if (uCkProduction()) return;

	const oEnts = Object.entries(aParams);
	for (const [ on, oVal ] of oEnts) {
		if ((oVal === undefined) || (oVal === null))
			uThrowUnset(on);

		// Lots of discussion about this here:
		//
		//   https://stackoverflow.com/a/332429/3728155
		//

		// Recall that `typeof` returns one of:
		//
		//   "undefined",
		//   "boolean", "number", "bigint", "string", "symbol",
		//   "object", "function"
		//
		const oTypeofActual = typeof oVal;
		// Check for non-function `Object`, or class instance:
		if (oTypeofActual === "object") {
			if (!(oVal instanceof aTypeExpect))
				// `constructor.name` gives the correct case, unlike `oTypeofActual`:
				uThrowType(on, oVal.constructor.name);
		}
		// Check for other primitives, including functions:
		else {
			if (oTypeofActual !== aTypeExpect.name.toLowerCase())
				uThrowType(on, oVal.constructor.name);
		}
	}

	// Exceptions
	// ----------

	function uThrowUnset(aNameParam) {
		const oPrefix = aNameCaller ? (aNameCaller + ": ") : "";
		const oMsg = `${oPrefix}${aNameParam} is not set`;
		throw Error(oMsg);
	};

	function uThrowType(aNameParam, aNameTypeActual) {
		const oPrefix = aNameCaller ? (aNameCaller + ": ") : "";
		const oMsg = `${oPrefix}${aNameParam} is ${aNameTypeActual}, `
			+ `should be ${aTypeExpect.name}`;
		throw Error(oMsg);
	};
}

/** Waits for `aMS` milliseconds before returning. */
export async function wWait(aMS) {
	return new Promise((auResolve, auReject) => {
		setTimeout(auResolve, aMS);
	});
}
