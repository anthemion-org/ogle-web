// Cfg.js
// ======
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Cfg from "./Cfg.js";
//

// Cfg
// ---
// The Cfg record stores the player's app-level configuration selections.

export function uNew(aNameTheme) {
	const oCfg = {
		/** The name of the selected UI theme. */
		NameTheme: aNameTheme
	};
	Object.freeze(oCfg);
	return oCfg;
}

/** Returns a new instance containing default values. */
export function uDef() {
	return uNew("Dk");
}

/** Returns a short string that summarizes the values in a Cfg record. */
export function uTag(aCfg) {
	return `NT:(${aCfg.NameTheme})`;
}
