// Setup.js
// ========
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Setup from "./Round/Setup.js";
//

import * as Yield from "./Yield.js";
import * as Pace from "./Pace.js";
import * as Rg from "../Util/Rg.js";
import * as Text from "../Util/Text.js";
import * as Misc from "../Util/Misc.js";

// Setup
// -----
// Each Setup stereotype stores play options for one round of the game. This
// stereotype is immutable.
//
// In the desktop app, this type stored settings values that referenced specific
// UI selections (particularly slider positions) and translated those on demand
// into real data, such as word count ranges or time bonuses. That approach made
// it difficult to change settings options later, so this stereotype stores
// settings in real terms, and lets the UI map those onto UI selections at
// display time. The UI can select a default if this data fails to match the
// selections on offer.

/** Creates a Setup stereotype from the specified yield and pace values. */
export function uNew(aYield, aPaceStart, aPaceBonus) {
	Misc.uCkThrow_Params({ aYield }, Object, "Setup uNew");
	Misc.uCkThrow_Params({ aPaceStart, aPaceBonus }, Number, "Setup uNew");

	const oSetup = {
		/** A Rg stereotype giving the number of words allowed in the board. */
		Yield: aYield,
		/** The number of seconds to be awarded at the start of the round. */
		PaceStart: aPaceStart,
		/** The number of seconds to be awarded for each letter over three. */
		PaceBonus: aPaceBonus
	};
	Object.freeze(oSetup);
	return oSetup;
}

/** Returns a new instance containing default values. */
export function uDef() {
	const [ oPaceStart, oPaceBonus ] = Pace.uDef();
	return uNew(Yield.uDef(), oPaceStart, oPaceBonus);
}

/** Creates a Setup stereotype from an object produced by `JSON.parse`, and
 *  returns it, or returns `null` if `aParse` is falsy. */
export function uFromParse(aParse) {
	if (!aParse) return null;
	Misc.uCkThrow_Params({ aParse }, Object, "Setup uFromParse");

	return uNew(
		Rg.uFromParse(aParse.Yield),
		aParse.PaceStart,
		aParse.PaceBonus
	);
}

/** Returns a short string that summarizes the values in a Setup stereotype. */
export function uTag(aSetup) {
	Misc.uCkThrow_Params({ aSetup }, Object, "Setup uTag");

	// This output must not change! High scores are marked with these values in
	// the local storage, and changing them would cause those scores to be lost:
	return `Y:(${Rg.uTag(aSetup.Yield)}) `
		+ `PS:${aSetup.PaceStart} PB:${aSetup.PaceBonus}`;
}

/** Returns a short string describing the yield within a Setup stereotype. */
export function uTextShortYield(aSetup) {
	Misc.uCkThrow_Params({ aSetup }, Object, "Setup uTextShortYield");

	if (!isFinite(aSetup.Yield.End))
		return aSetup.Yield.Start + "+";
	return aSetup.Yield.Start + "-" + aSetup.Yield.End;
}

/** Returns a short string describing the pace within a Setup stereotype. */
export function uTextShortPace(aSetup) {
	Misc.uCkThrow_Params({ aSetup }, Object, "Setup uTextShortPace");

	return aSetup.PaceStart + " + " + Text.uFracNice(aSetup.PaceBonus);
}
