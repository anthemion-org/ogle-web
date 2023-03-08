// Persist.js
// ==========
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

// Import with:
//
//   import * as Persist from "./Persist.js";
//

// This module persists user data as JSON in the browser's local storage. It
// also defines default values for some data, and caches data read from and
// written to local storage.
//
// `uSet` stores objects and values in the local storage root, after prefixing
// their names with `_PrefixNameStore`.
//
// Ogle uses types like Setup to store data in memory, but these types are lost
// when their content is serialized. When a class instance is restored, the
// untyped data returned by `uGetPlain` must be converted with the static
// `suFromPlain` method provided by the destination class. See 'Plain data and
// persistence' in `README.md` for more on this. [todo]

import StsApp from "./StsApp.js";
import * as Setup from "./Round/Setup.js";
import * as UtilJSON from "./Util/UtilJSON.js";
// This exposes 'package.json' to the client, which is said to have security
// implications in some cases. Ours is already open to the public:
import Pack from "../package.json";

/** Reads the specified value from local storage, after prefixing name `an` with
 *  `_PrefixNameStore`. */
export function uRead(an) {
	const onFull = _PrefixNameStore + an;
	const oJSON = localStorage.getItem(onFull);

	if (oJSON === null) return undefined;
	// It would be nice to reverse the `_uNumsSpecialToStr` conversion here, but
	// the string 'Infinity' is a likely value for some fields, and the original
	// Ogle code did not need or use `_uNumsSpecialToStr`, so there are `null`
	// values in production that can't be restored without context that is lacking
	// here. Records that store numbers should implement `uFromParse` functions,
	// to be invoked when the store is initialized:
	return JSON.parse(oJSON);
}

/** Writes the specified value to the local storage, after prefixing `an` with
 *  `_PrefixNameStore`. Also updates the `VerApp` value. */
export function uWrite(an, aVal) {
	// Write the version number. Note that this value is not drawn from the store:
	localStorage.setItem(
		_PrefixNameStore + "VerApp",
		JSON.stringify(Pack.version)
	);
	// Write the value:
	localStorage.setItem(
		_PrefixNameStore + an,
		// Whatver else happens, writing `null` for infinite or `NaN` values cannot
		// be correct, as it cannot be deserialized accurately:
		JSON.stringify(aVal, UtilJSON.uNumFix)
	);
}



// [todo]

/** Returns a plain representation of the stored value or object with name `an`,
 *  or the default value, if there is a default, or 'undefined'. */
export function uGetPlain(an) {
	if (_PlainsByName[an] === undefined) return _DefsByName[an];
	return _PlainsByName[an];
}

/** Assigns value or object `aVal` to name `an` within the local storage. If
 *  `an` is already in use, its value is overwritten. */
export function uSet(an, aVal) {
	_PlainsByName[an] = aVal;
	_uWrite_Val(an, aVal);
}

// Private
// -------

/** The prefix to be used for all local storage names. */
const _PrefixNameStore = "Ogle";

/** An object representation of all Ogle data in local storage. Properties may
 *  be primitive types, arrays, or plain or non-plain objects. */
const _PlainsByName = _uRead_Plains();

/** Default values to be returned when keys are read before they have been
 *  written. */
const _DefsByName = {
	StApp: StsApp.Sets,
	Setup: Setup.uDef(),
	ScoresHigh: {},
	WordsUser: []
};

/** Returns a single object containing plain representations of all Ogle data in
 *  local storage. */
function _uRead_Plains() {
	const oPlains = {};
	for (let oj = 0; oj < localStorage.length; ++oj) {
		const onFull = localStorage.key(oj);
		if (!onFull.startsWith(_PrefixNameStore)) continue;

		const onBase = onFull.slice(_PrefixNameStore.length);
		oPlains[onBase] = JSON.parse(localStorage.getItem(onFull));
	}
	return oPlains;
}

/** Writes the specified value to the local storage, after prefixing `an` with
 *  `_PrefixNameStore`. Also updates the `VerApp` value. */
function _uWrite_Val(an, aVal) {
	localStorage.setItem(_PrefixNameStore + "VerApp",
		JSON.stringify(Pack.version));
	localStorage.setItem(_PrefixNameStore + an, JSON.stringify(aVal));
}
