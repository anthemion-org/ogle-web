// Store.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Store from "./Store.js";
//
// uSet stores objects and values in the localStorage root, after prefixing
// their names with PrefixNameStore.
//
// Ogle uses types like tSetup to store data within the app, but these types are
// lost when their data is serialized. Clients of this class must convert the
// untyped data with the 'suFromPOD' methods in the source types.

import StsApp from "./StsApp.js";
import { tSetup } from "./Round/Setup.js";
// This exposes 'package.json' to the client, which is said to have security
// implications in some cases, but ours is already open to the public:
import Pack from "../package.json";

/** Returns a POD representation of the value or object with the specified name,
 *  or the default value, if any, or 'undefined'. */
export function uGetPOD(aName) {
	if (DataPOD[aName] === undefined) return DataDef[aName];
	return DataPOD[aName];
}

/** Overwrites the value or object with the specified name, then updates the
 *  associated key in the local storage. */
export function uSet(aName, aVal) {
	DataPOD[aName] = aVal;
	uWrite_Val(aName, aVal);
}

/** The prefix to be used for all localStorage names. */
const PrefixNameStore = "Ogle";
/** The cached user data. */
const DataPOD = uRead_DataPOD();
/** The default user data. Notice that some of these values are not PODs. That
 *  should be okay, as long as they are usable as PODs. */
const DataDef = {
	StApp: StsApp.Setup,
	Setup: tSetup.suDef(),
	ScoresHigh: {},
	WordsUser: []
};

/** Creates and returns a single object containing POD data from all
 *  localStorage keys that begin with PrefixNameStore. */
function uRead_DataPOD() {
	const oDataAll = {};
	for (let oj = 0; oj < localStorage.length; ++oj) {
		const onFull = localStorage.key(oj);
		if (!onFull.startsWith(PrefixNameStore)) continue;

		const onBase = onFull.slice(PrefixNameStore.length);
		oDataAll[onBase] = JSON.parse(localStorage[onFull]);
	}
	return oDataAll;
}

/** Writes the specified value to the local storage, after prefixing aName with
 *  PrefixNameStore. Also updates the VerApp value. */
function uWrite_Val(aName, aData) {
	localStorage[PrefixNameStore + "VerApp"] = JSON.stringify(Pack.version);
	localStorage[PrefixNameStore + aName] = JSON.stringify(aData);
}
