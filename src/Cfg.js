// Cfg.js
// ------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tCfg } from "./Cfg.js";
//

// tCfg
// ----
// Why should this class exist? We can't really use it; the configuration
// instance is actually managed by `useState`, so we can't control its type.
// [todo]

/** Stores general configuration choices for the app. This class is immutable. */
export class tCfg {
	/** Creates an instance from the specified POD and returns it. */
	static suFromPlain(aPlain) {
		if (!aPlain) return null;

		return new tCfg(
			aPlain.NameTheme
		);
	}

	/** Returns a new instance containing default values. */
	static suDef() {
		return new tCfg("Dk");
	}

	constructor(aNameTheme) {
		/** The name of the selected UI theme. */
		this.NameTheme = aNameTheme;

		Object.freeze(this);
	}

	/** Returns a short string that summarizes the values in this instance. */
	uTag() {
		return `NT:(${this.NameTheme})`;
	}
}
