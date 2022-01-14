// Store.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Store from "./Store.js";
//
// All Ogle user data will be stored in a single object referenced by the
// localStorage property named by NameRoot. All values are stored in the root of
// that object.

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

/** Reads and returns user data from the Ogle local storage object, or 'null' if
 *  there is no user data. */
function uRead() {
	return localStorage[NameRoot] ? JSON.parse(localStorage[NameRoot]) : null;
}

/** Writes the specified data to the Ogle local storage. */
function uWrite(aData) {
	localStorage[NameRoot] = JSON.stringify(aData);
}
