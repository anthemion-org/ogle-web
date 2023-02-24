// PoolDie.js
// ---------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tPoolDie } from "../PoolDie.js";
//

import { tDie } from "./Die.js";
import * as Dir4 from "../Util/Dir4.js";
import * as Const from "../Const.js";

/** Stores configuration data for a single pool of texts. This class is
 *  immutable. */
class tConfigPoolText {
	constructor(aCtMinStart, aDropCt, aCtMinDraw) {
		/** The minimum starting text count. Increase this number to see more rare
		 *  letter dice. */
		this.CtMinStart = aCtMinStart;
		/** The amount by which each text count drops, after it is drawn. Increase
		 *  this number to see fewer duplicates and more rare letter dice. */
		this.DropCt = aDropCt;
		/** The minimum allowable text count, after a given text has been drawn.
		 *  Increase this number to see more duplicate letter dice. */
		this.CtMinDraw = aCtMinDraw;
	}

	/** Returns a short string that describes this configuration. */
	uDesc() {
		return `${this.CtMinStart}-${this.DropCt}-${this.CtMinDraw}`;
	}
}

/** Stores configuration data for all the pools used to generate a board. This
 *  class is immutable. */
export class tConfigPoolDie {
	/** Returns a new instance containing default values. This is the original
	 *  configuration, which often generates more than 200 words. */
	static suDef() {
		return new tConfigPoolDie(1.0, 4.0, 0.1, 1.0, 4.0, 0.1);
	}

	/** Returns a new instance appropriate for the given `tSetup` instance. */
	static suFromSetup(aSetup) {
		if (!aSetup)
			throw Error("tConfigPoolDie.suFromSetup: Setup not provided");

		let oConfig;
		if (aSetup.Yield.End < 20)
			oConfig = new tConfigPoolDie(1.0, 4.0, 0.1, 8.0, 6.0, 0.1)
		else if (aSetup.Yield.End < 40)
			oConfig = new tConfigPoolDie(1.0, 4.0, 0.1, 3, 4.0, 0.1)
		else oConfig = tConfigPoolDie.suDef();
		return oConfig;
	}

	constructor(
		aCtMinStartVow, aDropCtVow, aCtMinDrawVow,
		aCtMinStartConson, aDropCtConson, aCtMinDrawConson
	) {
		this.Vow = new tConfigPoolText(aCtMinStartVow, aDropCtVow, aCtMinDrawVow);
		this.Conson = new tConfigPoolText(
			aCtMinStartConson, aDropCtConson, aCtMinDrawConson
		);
	}

	/** Returns a short string that describes this configuration. */
	uDesc() {
		return `Vowels '${this.Vow.uDesc()}', `
			+ `Consonants '${this.Conson.uDesc()}'`;
	}
}

/** Stores a pool of text values, which can be drawn randomly as `tDie`
 *  instances to produce a board. This class is mutable. */
export class tPoolDie {
	constructor(aGenRnd, aConfig) {
		if (!aConfig)
			throw Error("tPoolDie: Configuration not provided");

		this._GenRnd = aGenRnd;

		// Ready text pools
		// ----------------
		// We want every board to have the same number of vowels.

		/** The desired vowel frequency. */
		const oRatioVow = 9 / 25;

		/** The number of vowels yet to be drawn. */
		this._CtVow = Math.round(oRatioVow * Const.CtDie);
		/** The number of consonants yet to be drawn. */
		this._CtConson = Const.CtDie - this._CtVow;

		// Wikipedia:
		//
		//   https://en.wikipedia.org/wiki/Letter_frequency
		//
		// gives these letter percentage frequencies, as drawn from dictionaries and
		// texts:
		//
		//      Dicts  Texts         Dicts  Texts
		//      -----  -----         -----  -----
		//   E   11.0   13.0      P    2.8    1.9
		//   S    8.7    6.3      M    2.7    2.5
		//   I    8.2    7.0      K    2.5    0.8
		//   A    7.8    8.2      H    2.3    6.1
		//   R    7.3    6.0      B    2.0    1.5
		//   N    7.2    6.7      Y    1.6    2.0
		//   T    6.7    9.1      F    1.4    2.2
		//   O    6.1    7.5      V    1.0    1.0
		//   L    5.3    4.0      W    0.9    2.4
		//   C    4.0    2.8      Z    0.4    0.1
		//   D    3.8    4.3      X    0.3    0.2
		//   U    3.3    2.8      J    0.2    0.2
		//   G    3.0    2.0      Q    0.2    0.1
		//
		// Using the dictionary distribution makes it easier to produce boards with
		// 200+ words, but I prefer to include more of the uncommon letters, so I am
		// setting the start minimum to '1.0'.

		const oCtsVow = {
			E: 11.0, I: 8.2, A: 7.8, O: 6.1,
			U: 3.3, Y: 1.6
		};
		/** The vowel text pool. */
		this._TextsVow = new tPoolText(aGenRnd, oCtsVow, aConfig.Vow);

		const oCtsConson = {
			S: 8.7, R: 7.3, N: 7.2, T: 6.7, L: 5.3,
			C: 4.0, D: 3.8, G: 3.0, P: 2.8, M: 2.7, K: 2.5, H: 2.3, B: 2.0,
			F: 1.4, V: 1.0, W: 0.9, Z: 0.4,
			X: 0.3, J: 0.2, Qu: 0.2
		};
		/** The consonant text pool. */
		this._TextsConson = new tPoolText(aGenRnd, oCtsConson, aConfig.Conson);
	}

	/** Selects and returns a random `tDie` instance, after decrementing the vowel
	 *  or consonant count, as appropriate. */
	uDraw() {
		const oCtText = this._CtVow + this._CtConson;
		if (oCtText < 1)
			throw Error("tPoolDie.uDraw: Pool exhausted");

		const ojDraw = this._GenRnd.uInt(oCtText);

		let oText;
		if (ojDraw < this._CtVow) {
			oText = this._TextsVow.uDraw();
			--this._CtVow;
		}
		else {
			oText = this._TextsConson.uDraw();
			--this._CtConson;
		}

		const oDir = Dir4.uRnd(this._GenRnd);
		return new tDie(oText, oDir);
	}
}

/** Derives a new counts object from `aCtsBaseByText`, with each count equal
 *  to `aCtMinStart` or greater. */
function uCtsAdjFromBase(aCtsBaseByText, aCtMinStart) {
	const oCtsAdj = { ...aCtsBaseByText };
	for (const on in oCtsAdj) {
		if (oCtsAdj[on] < aCtMinStart) oCtsAdj[on] = aCtMinStart;
	}
	return oCtsAdj;
}

/** Stores a pool of text values, which can then be drawn one by one. Each value
 *  has a count, which is decremented when the value is drawn. If a count
 *  reaches zero, the associated value will be drawn no more.
 *
 *  This class is mutable. */
class tPoolText {
	/** Returns the total value count in the specified entries object. */
	static suCt(aCtsByText) {
		const ouSum = (aTtl, aVal) => (aTtl + aVal);
		const oCt = Object.values(aCtsByText).reduce(ouSum);
		if (isNaN(oCt))
			throw Error("tPoolText.suCt: Invalid count");
		return oCt;
	}

	/** Creates a new pool containing text values and counts derived from the
	 *  `tConfigPoolText` instance `aConfig`. */
	constructor(aGenRnd, aCtsBaseByText, aConfig) {
		this._GenRnd = aGenRnd;
		this._Config = aConfig;

		/** An object that associates text values with counts, which minimum
		 *  starting counts applied. These counts will be decremented as the values
		 *  are drawn. */
		this._CtsByText = uCtsAdjFromBase(aCtsBaseByText, aConfig.CtMinStart);
		/** The total value count available to be drawn. */
		this._Ct = tPoolText.suCt(this._CtsByText);
	}

	/** Selects and returns a random text value, after decrementing its count. */
	uDraw() {
		let oPosDraw = this._GenRnd.uFloat() * this._Ct;
		for (const onText in this._CtsByText) {
			oPosDraw -= this._CtsByText[onText];
			if (oPosDraw < 0) {
				const oCtOld = this._CtsByText[onText];
				const oCtNew = Math.max(
					(oCtOld - this._Config.DropCt),
					this._Config.CtMinDraw
				);

				this._Ct += (oCtNew - oCtOld);
				this._CtsByText[onText] = oCtNew;
				return onText;
			}
		}
		throw Error("tPoolText.uDraw: Pool exhausted");
	}
}

export const ForTest = {
	tPoolText
};
