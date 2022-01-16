// Store.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Store from "./Store.js";
//
// All Ogle user data is stored in a single object referenced by the
// localStorage property named by nRoot. The values referenced by uGet and uSet
// are stored in the root of that object.
//
// Ogle uses types like tSetup to store data internally, but these types are
// lost when their data is serialized. Clients of this class must convert the
// untyped data with 'suFromData' methods in the source types.

import * as Cfg from "./Cfg.js";

/** Returns the value or object with the specified name. */
export function uGet(aName) {
	return Data[aName];
}

/** Overwrites the value or object with the specified name, then writes all
 *  data to the local storage. */
export function uSet(aName, aVal) {
	Data[aName] = aVal;
	uWrite(Data);
}

// Implementation
// --------------

/** The name of the localStorage object that contains all Ogle user data. */
const NameRoot = "Ogle";

/** The current user data, or 'null' if it has not been read. */
let Data = uRead();
if (!Data) {
	Data = uDef();
	uWrite(Data);
}

/** Returns the default user data. */
function uDef() {
	return {
		WordsUser: []
	};
}

/** Reads and returns user data from the nRoot local storage object, or 'null'
 *  if there is no user data. */
function uRead() {
	return localStorage[NameRoot]
		? JSON.parse(localStorage[NameRoot])
		: null;
}

/** Adds the current Ogle version to the specified data, then writes the data to
 *  the nRoot local storage. */
function uWrite(aData) {
	aData.Ver = Cfg.Ver;
	localStorage[NameRoot] = JSON.stringify(aData);
}
