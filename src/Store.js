// Store.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

// This module persists user data as JSON in the browser’s local storage.
//
// `uSet` stores objects and values in the `localStorage` root, after prefixing
// their names with `_PrefixNameStore`.
//
// Ogle uses classes like `tSetup` to store data in memory, but these types are
// lost when their content is serialized. When class instance is restored, the
// untyped data returned by `uGetPlain` must be converted with the static
// `suFromPlain` method provided by the destination class. See ‘Plain data and
// persistence’ in `README.md` for more on this.

// Import with:
//
//   import * as Store from "./Store.js";
//

import StsApp from "./StsApp.js";
import { tSetup } from "./Round/Setup.js";
// This exposes 'package.json' to the client, which is said to have security
// implications in some cases. Ours is already open to the public:
import Pack from "../package.json";

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

/** The prefix to be used for all localStorage names. */
const _PrefixNameStore = "Ogle";

/** An object representation of all Ogle data in local storage. Properties may
 *  be primitive types, arrays, or plain or non-plain objects. */
const _PlainsByName = _uRead_Plains();

/** Default values to be returned when keys are read before they have been
 *  written. */
const _DefsByName = {
	StApp: StsApp.Setup,
	Setup: tSetup.suDef(),
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
		oPlains[onBase] = JSON.parse(localStorage[onFull]);
	}
	return oPlains;
}

/** Writes the specified value to the local storage, after prefixing `an` with
 *  `_PrefixNameStore`. Also updates the `VerApp` value. */
function _uWrite_Val(an, aVal) {
	localStorage[_PrefixNameStore + "VerApp"] = JSON.stringify(Pack.version);
	localStorage[_PrefixNameStore + an] = JSON.stringify(aVal);
}
