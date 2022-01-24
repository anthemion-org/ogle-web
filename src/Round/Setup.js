// Setup.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tSetup } from "./Round/Setup.js";
//

import { tRg } from "../Util/Rg.js";

// tSetup
// ------
// In the desktop app, this type stored settings as indices that referenced
// specific selections in the UI, and translated those on demand into real data,
// such as word count ranges or time bonuses. That approach makes it difficult
// to change settings options later, however, so this class stores settings in
// real terms, and leaves the UI to map those onto specific UI states.

export class tSetup {
	/** Creates an instance from the specified POD and returns it. */
	static suFromPOD(aData) {
		if (!aData) return null;

		return new tSetup(
			tRg.suFromPOD(aData.Yield),
			aData.PaceStart,
			aData.PaceBonus
		);
	}

	/** Creates and returns an instance containing default values. */
	static suDef() {
		// These values will be ignored by the Setup view unless they match the
		// settings that view is able to display:
		return new tSetup(
			new tRg(100, Infinity),
			30, 5
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
