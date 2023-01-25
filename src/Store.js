// Store.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// This module persists user data as JSON in the browser’s local storage.
//
// `uSet` stores objects and values in the `localStorage` root, after prefixing
// their names with `_PrefixNameStore`.
//
// Ogle uses classes like `tSetup` to store data within the app, but these types
// are lost when their data is serialized. When class instance is restored, the
// untyped data returned by `uGetPOD` must be converted with the static
// `suFromPOD` method provided by the destination class.
//
// Import with:
//
//   import * as Store from "./Store.js";
//

import StsApp from "./StsApp.js";
import { tSetup } from "./Round/Setup.js";
// This exposes 'package.json' to the client, which is said to have security
// implications in some cases. Ours is already open to the public:
import Pack from "../package.json";

/** Returns a POD representation of the value or object with the specified name,
 *  or the default value, if such is defined, or 'undefined'. */
export function uGetPOD(aName) {
	if (_PODsByName[aName] === undefined) return _DefsByName[aName];
	return _PODsByName[aName];
}

/** Overwrites the value or object with the specified name, then updates the
 *  associated key in the local storage. */
export function uSet(aName, aVal) {
	_PODsByName[aName] = aVal;
	_uWrite_Val(aName, aVal);
}

// Private
// -------

/** The prefix to be used for all localStorage names. */
const _PrefixNameStore = "Ogle";
/** The cached user data. */
const _PODsByName = _uRead_DataPOD();
/** The default user data. Notice that some of these values are not PODs. That
 *  should be okay, as long as they are usable as PODs. */
const _DefsByName = {
	StApp: StsApp.Setup,
	Setup: tSetup.suDef(),
	ScoresHigh: {},
	WordsUser: []
};

/** Creates and returns an single object containing POD data from all
 *  `localStorage` keys that begin with `_PrefixNameStore`. */
function _uRead_DataPOD() {
	const oDataAll = {};
	for (let oj = 0; oj < localStorage.length; ++oj) {
		const onFull = localStorage.key(oj);
		if (!onFull.startsWith(_PrefixNameStore)) continue;

		const onBase = onFull.slice(_PrefixNameStore.length);
		oDataAll[onBase] = JSON.parse(localStorage[onFull]);
	}
	return oDataAll;
}

/** Writes the specified value to the local storage, after prefixing `aName` with
 *  `_PrefixNameStore`. Also updates the `VerApp` value. */
function _uWrite_Val(aName, aData) {
	localStorage[_PrefixNameStore + "VerApp"] = JSON.stringify(Pack.version);
	localStorage[_PrefixNameStore + aName] = JSON.stringify(aData);
}
