// Setup.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tSetup } from "./Round/Setup.js";
//

import * as Yield from "./Yield.js";
import * as Pace from "./Pace.js";
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
	static suFromPOD(aPOD) {
		if (!aPOD) return null;

		return new tSetup(
			tRg.suFromPOD(aPOD.Yield),
			aPOD.PaceStart,
			aPOD.PaceBonus
		);
	}

	/** Creates and returns an instance containing default values. */
	static suDef() {
		const [oPaceStart, oPaceBonus] = Pace.uDef();;
		return new tSetup(Yield.uDef(), oPaceStart, oPaceBonus);
	}

	constructor(aYield, aPaceStart, aPaceBonus) {
		/** A tRg instance giving the number of words allowed in the board. */
		this.Yield = aYield;

		/** The number of seconds to be awarded at the start of the round. */
		this.PaceStart = aPaceStart;
		/** The number of seconds to be awarded for each letter over three. */
		this.PaceBonus = aPaceBonus;
	}

	/** Creates and returns a copy of this instance. */
	uClone(aSetup) {
		return new tSetup(aSetup.Yield, aSetup.Pace);
	}

	/** Returns a short string describing the yield. */
	uTextShortYield() {
		if (!isFinite(this.Yield.End))
			return this.Yield.Start + "+";
		return this.Yield.Start + "-" + this.Yield.End;
	}

	/** Returns a short string describing the pace. */
	uTextShortPace() {
		return this.PaceStart + " + " + this.PaceBonus;
	}
}
