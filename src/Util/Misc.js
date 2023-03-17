// Misc.js
// =======
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Misc from "../Util/Misc.js";
//

// Checks
// ------

/** Accepts an object `aParams` containing one or more function parameters, plus
 *  constructor `aTypeExpect` that should be common to those parameters. Throws
 *  if any parameter is `undefined` or `null`, or if any parameter fails to
 *  match `aTypeExpect`. If `aNameCaller` is defined, the exception message will
 *  be prefixed with that text. Does nothing if the app is running in
 *  production.
 *
 *  Beware, this function is not fast! It's fine for general use (including the
 *  UI) but it should not be used in the critical path of any high-performance
 *  code, particularly the low-level word search functions. */
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
	// As noted, this function is not fast, and it has not been tested with
	// minified code; the `aTypeExpect` check should work as usual, but error
	// messages will reference the minified names of any custom classes. I see
	// this as a development and testing tool, in any event:
	if (CkProduction) return;

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

// Environment
// -----------

// These environment checks were surprisingly slow when implemented as functions
// with full-string comparisons:
//
/** Returns `true` if the app is running in the development environment. */
export const CkDev = (process.env.NODE_ENV === "development");
/** Returns `true` if the app is running in the test environment. */
export const CkTest = (process.env.NODE_ENV === "test");
/** Returns `true` if the app is running in the production environment. */
export const CkProduction = (process.env.NODE_ENV === "production");

/** Returns `true` if the app is running on a phone or tablet. */
export function uCkMob() {
	// MDN suggests just checking for 'Mobi':
	//
	//   https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
	//
	// They don't explain what they mean by 'mobile', however, and it seems like
	// they exclude tablets from that category. In any event, 'Mobi' does not work
	// for the Samsung Galaxy Tab, so we will check the OS instead:
	const oPlats = /Android|BlackBerry|iPad|iPhone|iPod|webOS|Windows Phone/i;
	return oPlats.test(navigator.userAgent);
}

/** Returns `true` if the app has been installed as a PWA, and if it was started
 *  as an app, rather than running in the browser. */
export function uCkRunInstall() {
	return window.matchMedia("(display-mode: standalone)").matches;
}

// Arrays
// ------

/** Returns a new array of the specified length, with each element set to aVal. */
export function uGen_Arr(aLen, aVal) {
	return Array(aLen).fill(aVal);
}

// Miscellanea
// -----------

/** Waits for `aMS` milliseconds before returning. */
export async function wWait(aMS) {
	return new Promise((auResolve, auReject) => {
		setTimeout(auResolve, aMS);
	});
}
