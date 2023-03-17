// Persist.js
// ==========
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

// Import with:
//
//   import * as Persist from "./Persist.js";
//

// This module persists user data as JSON in the root of browser's local
// storage. All key names are automatically prefixed with `_PrefixNameStore`.
//
// While most Ogle store data is persisted, not all persistant data is part of
// the store. Data (like 'WordsUser') that are not used to render pages can be
// persisted directly.

import * as UtilJSON from "./Util/UtilJSON.js";
import * as Misc from "./Util/Misc.js";
// This exposes 'package.json' to the client, which is said to have security
// implications in some cases. Ours is already open to the public:
import Pack from "../package.json";

/** The prefix to be used for all local storage names. */
const _PrefixNameStore = "Ogle";

/** Prefixes `anBase` with `_PrefixNameStore`, then writes `anVal` to the local
 *  storage, after converting unserializable numbers to strings. Also updates
 *  the `VerApp` value in the store. */
export function uWrite(anBase, aVal) {
	Misc.uCkThrow_Params({ anBase }, String, "Persist uWrite");

	// Write the version number. Note that this value is not drawn from the store:
	localStorage.setItem(
		_PrefixNameStore + "VerApp",
		JSON.stringify(Pack.version)
	);
	// Write the value:
	localStorage.setItem(
		_PrefixNameStore + anBase,
		// Whatever happens during deserialization, writing `null` for infinite or
		// `NaN` values cannot be correct, as it cannot be deserialized accurately:
		JSON.stringify(aVal, UtilJSON.uNumFix)
	);
}

/** Prefixes `anBase` with `_PrefixNameStore`, then returns the associated value
 *  from local storage, or `aDef`, if the key is not found. */
export function uRead(anBase, aDef = undefined) {
	Misc.uCkThrow_Params({ anBase }, String, "Persist uRead");

	const onFull = _PrefixNameStore + anBase;
	const oJSON = localStorage.getItem(onFull);
	// Because we are storing everything as a string, this lets us discern between
	// values that were explicitly set to `null`, and those that are missing
	// entirely. The `localStorage` API, incredibly, does not provide a direct way
	// to make that distinction:
	if (oJSON === null) return aDef;
	// It would be nice to reverse the `UtilJSON.uNumFix` conversion here, but the
	// string 'Infinity' is a likely value for some fields, and the original Ogle
	// code did not need or use `UtilJSON.uNumFix`, so there are `null` values in
	// production that can't be interpreted without context that is lacking here.
	// Records that store numbers perform this conversion with `uFromParse`
	// functions:
	return JSON.parse(oJSON);
}
