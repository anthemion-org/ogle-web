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
import * as Text from "../Util/Text.js";

// tSetup
// ------
// In the desktop app, this type stored settings values that referenced specific
// UI states (particularly slider positions) and translated those on demand into
// real data, such as word count ranges or time bonuses. That approach makes it
// difficult to change settings options later, however, so this class stores
// settings in real terms, and lets the UI map those onto specific UI states.

/** Stores the setup options for one round. This class is immutable. */
export class tSetup {
	/** Creates an instance from the specified plain object and returns it. */
	static suFromPlain(aPlain) {
		if (!aPlain) return null;

		return new tSetup(
			tRg.suFromPlain(aPlain.Yield),
			aPlain.PaceStart,
			aPlain.PaceBonus
		);
	}

	/** Returns a new instance containing default values. */
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

		Object.freeze(this);
	}

	/** Returns a short string that summarizes the values in this instance. */
	uTag() {
		return `Y:(${this.Yield.uTag()}) `
			+ `PS:${this.PaceStart} PB:${this.PaceBonus}`;
	}

	/** Returns a short string describing the yield. */
	uTextShortYield() {
		if (!isFinite(this.Yield.End))
			return this.Yield.Start + "+";
		return this.Yield.Start + "-" + this.Yield.End;
	}

	/** Returns a short string describing the pace. */
	uTextShortPace() {
		return this.PaceStart + " + " + Text.uFracNice(this.PaceBonus);
	}
}
