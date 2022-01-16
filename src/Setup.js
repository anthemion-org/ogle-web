// Setup.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tSetup } from "../Setup.js";
//

import { tRg } from "./Util/Rg.js";

// tSetup
// ------
// In the desktop app, this type stored settings as indices that referenced
// specific selections in the UI, and translated those on demand into concrete
// data, such as word count ranges or time bonuses. That approach makes it
// difficult to change settings options later, however, so this class stores
// settings in concrete terms, and leaves the UI to map those onto specific UI
// states.

export class tSetup {
	/** Creates and returns an instance after initializing it with untyped data. */
	static suFromData(aData) {
		return new tSetup(
			tRg.suFromData(aData.Yield),
			aData.PaceStart,
			aData.PaceBonus
		);
	}

	constructor(aYield, aPaceStart, aPaceBonus) {
		/** A tRg instance giving the number of words allowed in the board. */
		this.Yield = aYield;

		/** The number of seconds to be awarded at the start of the game. */
		this.PaceStart = aPaceStart;
		/** The number of seconds to be awarded for each letter over three. */
		this.PaceBonus = aPaceBonus;
	}

	/** Creates and returns a copy of this instance. */
	uClone(aSetup) {
		return new tSetup(aSetup.Yield, aSetup.Pace);
	}
}
