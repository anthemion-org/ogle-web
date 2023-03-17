// Cfg.js
// ======
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Cfg from "./Cfg.js";
//

import * as Misc from "./Util/Misc.js";

// Cfg
// ---
// The Cfg record stores the player's app-level configuration selections. This
// record is immutable.

export function uNew(aNameTheme) {
	Misc.uCkThrow_Params({ aNameTheme }, String, "Cfg uNew");

	const oCfg = {
		/** The name of the selected UI theme. */
		NameTheme: aNameTheme
	};
	Object.freeze(oCfg);
	return oCfg;
}

/** Creates a Cfg record from an object produced by `JSON.parse`, or returns
 *  `null` if `aParse` is falsy. */
export function uFromParse(aParse) {
	// This function does nothing at present, but it seems better to use it from
	// the start, in case JSON-incompatible data is added later.

	if (!aParse) return null;
	Misc.uCkThrow_Params({ aParse }, Object, "Cfg uFromParse");

	return uNew(aParse.NameTheme);
}

/** Returns a new instance containing default values. */
export function uDef() {
	return uNew("Dk");
}

/** Returns a short string that summarizes the values in a Cfg record. */
export function uTag(aCfg) {
	Misc.uCkThrow_Params({ aCfg }, Object, "Cfg uTag");

	return `NT:(${aCfg.NameTheme})`;
}
