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
import * as Cfg from "../Cfg.js";

/** Stores a pool of text values, which can be drawn randomly as tDie instances
 *  to produce a board. This class is mutable. */
export class tPoolDie {
	constructor(aGenRnd) {
		this._GenRnd = aGenRnd;

		// Ready text pools
		// ----------------
		// We want every board to have the same number of vowels.

		/** The desired vowel frequency. */
		const oRatioVow = 9 / 25;

		/** The number of vowels yet to be drawn. */
		this._CtVow = Math.round(oRatioVow * Cfg.CtDie);
		/** The number of consonants yet to be drawn. */
		this._CtConson = Cfg.CtDie - this._CtVow;

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
		// Using that distribution makes it easier to produce boards with 200+
		// words, but I prefer to include more of the uncommon letters.

		/** The vowel text pool. */
		this._TextsVow = new tPoolText(aGenRnd, {
			E: 11.0, I: 8.2, A: 7.8, O: 6.1,
			U: 3.3, Y: 1.6
		});

		/** The consonant text pool. */
		this._TextsConson = new tPoolText(aGenRnd, {
			S: 8.7, R: 7.3, N: 7.2, T: 6.7, L: 5.3,
			C: 4.0, D: 3.8, G: 3.0, P: 2.8, M: 2.7, K: 2.5, H: 2.3, B: 2.0,
			F: 1.4, V: 1.0, W: 1.0, Z: 1.0,
			X: 1.0, J: 1.0, Qu: 1.0
		});
	}

	/** Selects and returns a random die instance, after decrementing the vowel or
	 *  consonant count, as appropriate. */
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

/** Stores a pool of text values, which can then be drawn one by one. Each value
 *  has a count, which is decremented when the value is drawn. If a count
 *  reaches zero, the associated value will be drawn no more. */
class tPoolText {
	/** Returns the total value count in the specified entries object. */
	static suCt(aCtsByText) {
		const ouSum = (aTtl, aVal) => (aTtl + aVal);
		const oCt = Object.values(aCtsByText).reduce(ouSum);
		if (isNaN(oCt))
			throw Error("tPoolText.suCt: Invalid count");
		return oCt;
	}

	/** Creates a new pool containing text values drawn from the properties of
	 *  aCtsByText, with counts equal to the aCtsByText values. */
	constructor(aGenRnd, aCtsByText) {
		this._GenRnd = aGenRnd;

		/** The total value count available to be drawn. */
		this._Ct = tPoolText.suCt(aCtsByText);
		/** An object that associates text values with counts. These counts will be
		 *  decremented as the values are drawn. */
		this._CtsByText = { ...aCtsByText };
	}

	/** Selects and returns a random text value, after decrementing its count. */
	uDraw() {
		let oPosDraw = this._GenRnd.uFloat() * this._Ct;
		for (const onText in this._CtsByText) {
			oPosDraw -= this._CtsByText[onText];
			if (oPosDraw < 0) {
				// The amount by which a text count drops when it is drawn. Increase
				// this number to see fewer duplicates, and more rare values:
				const oDrop = 4.0;
				// The minimum text count. Increase this number to see more duplicates
				// among rare values:
				const oMin = 0.25;

				const oCtOld = this._CtsByText[onText];
				const oCtNew = Math.max((oCtOld - oDrop), oMin);

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
