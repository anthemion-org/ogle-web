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
import * as Util from "../Util/Util.js";

// Setup
// -----
// Each Setup record stores play options for one round of the game.
//
// In the desktop app, this type stored settings values that referenced specific
// UI selections (particularly slider positions) and translated those on demand
// into real data, such as word count ranges or time bonuses. That approach made
// it difficult to change settings options later, so this record stores settings
// in real terms, and lets the UI map those onto UI selections at display time.
// The UI can select a default if this data fails to match the selections on
// offer.

/** Creates a Setup record from the specified yield and pace values. */
export function uNew(aYield, aPaceStart, aPaceBonus) {
	Util.uCkThrow_Params({ aYield }, Object, "Setup uNew");
	Util.uCkThrow_Params({ aPaceStart, aPaceBonus }, Number, "Setup uNew");

	const oSetup = {
		/** A Rg record giving the number of words allowed in the board. */
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

/** Creates a Setup record from an object produced by `JSON.parse`, and returns
 *  it, or returns `null` if `aParse` is falsy. */
export function uFromParse(aParse) {
	if (!aParse) return null;
	Util.uCkThrow_Params({ aParse }, Object, "Setup uFromParse");

	return uNew(
		Rg.uFromParse(aParse.Yield),
		aParse.PaceStart,
		aParse.PaceBonus
	);
}

/** Returns a short string that summarizes the values in a Setup record. */
export function uTag(aSetup) {
	Util.uCkThrow_Params({ aSetup }, Object, "Setup uTag");

	// This output must not change! High scores are marked with these values in
	// the local storage, and changing them would cause those scores to be lost:
	return `Y:(${Rg.uTag(aSetup.Yield)}) `
		+ `PS:${aSetup.PaceStart} PB:${aSetup.PaceBonus}`;
}

/** Returns a short string describing the yield within a Setup record. */
export function uTextShortYield(aSetup) {
	Util.uCkThrow_Params({ aSetup }, Object, "Setup uTextShortYield");

	if (!isFinite(aSetup.Yield.End))
		return aSetup.Yield.Start + "+";
	return aSetup.Yield.Start + "-" + aSetup.Yield.End;
}

/** Returns a short string describing the pace within a Setup record. */
export function uTextShortPace(aSetup) {
	Util.uCkThrow_Params({ aSetup }, Object, "Setup uTextShortPace");

	return aSetup.PaceStart + " + " + Text.uFracNice(aSetup.PaceBonus);
}
