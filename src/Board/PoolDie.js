// PoolDie.js
// ==========
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tConfigPoolDie, tPoolDie } from "../Board/PoolDie.js";
//

import { tConfigPoolText, tPoolText } from "./PoolText.js";
import * as Die from "./Die.js";
import * as Dir4 from "../Util/Dir4.js";
import * as Misc from "../Util/Misc.js";
import * as Const from "../Const.js";

/** Stores configuration data for the die pool used to generate a board. This
 *  class is immutable. */
export class tConfigPoolDie {
	/** Returns a new instance containing default values. This is the original
	 *  configuration, which often generates more than 200 words. */
	static suDef() {
		return new tConfigPoolDie(1.0, 4.0, 0.1, 1.0, 4.0, 0.1);
	}

	/** Returns a new instance appropriate for the specified Setup record. */
	static suFromSetup(aSetup) {
		Misc.uCkThrow_Params({ aSetup }, Object, "tConfigPoolDie.suFromSetup");

		let oConfig;
		if (aSetup.Yield.End < 20)
			oConfig = new tConfigPoolDie(1.0, 4.0, 0.1, 8.0, 6.0, 0.1)
		else if (aSetup.Yield.End < 40)
			oConfig = new tConfigPoolDie(1.0, 4.0, 0.1, 3.0, 4.0, 0.1)
		else oConfig = tConfigPoolDie.suDef();
		return oConfig;
	}

	constructor(
		aCtMinStartVow, aDropCtVow, aCtMinDrawVow,
		aCtMinStartConson, aDropCtConson, aCtMinDrawConson
	) {

		Misc.uCkThrow_Params({
			aCtMinStartVow, aDropCtVow, aCtMinDrawVow,
			aCtMinStartConson, aDropCtConson, aCtMinDrawConson
		}, Number, "tConfigPoolDie constructor");

		/** The vowel text pool. */
		this.Vow = new tConfigPoolText(aCtMinStartVow, aDropCtVow, aCtMinDrawVow);
		/** The consonant text pool. */
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

/** Stores two pools of text values, which can be drawn randomly as Die records
 *  to produce a board. Set `aConfig` to a `tConfigPoolDie` instance that
 *  determines counts within the pools. This class is mutable. */
export class tPoolDie {
	constructor(aGenRnd, aConfig) {
		Misc.uCkThrow_Params({ aGenRnd }, Object, "tPoolDie constructor");
		Misc.uCkThrow_Params({ aConfig }, tConfigPoolDie, "tPoolDie constructor");

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

	/** Selects and returns a random Die record, after decrementing the vowel or
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
		return Die.uNew(oText, oDir);
	}
}

