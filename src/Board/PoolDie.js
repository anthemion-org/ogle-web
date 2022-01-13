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
 *  to produce a board. A fixed number of vowels will be found in any board,
 *  once the entire board has been drawn. */
export class tPoolDie {
	constructor(aqGenRnd) {
		this.GenRnd = aqGenRnd;

		// Ready text pools
		// ----------------

		/** The desired vowel frequency. */
		const oRatioVow = 9 / 25;

		/** The number of vowels yet to be drawn. */
		this.CtVow = Math.round(oRatioVow * Cfg.CtDie);
		/** The number of consonants yet to be drawn. */
		this.CtConson = Cfg.CtDie - this.CtVow;

		/** The vowel text pool. Not all of these are expected to be drawn. */
		this.qTextsVow = new tPoolText(aqGenRnd, {
			E: 6,
			A: 4, O: 4,
			I: 3,
			U: 1, Y: 1
		});

		/** The consonant text pool. Not all of these are expected to be drawn. */
		this.qTextsConson = new tPoolText(aqGenRnd, {
			T: 7, N: 7,
			S: 6, H: 6, R: 6,
			D: 4, L: 4,
			C: 3,
			M: 2, W: 2, F: 2, G: 2, P: 2,
			B: 1, V: 1, K: 1, J: 1, X: 1, Z: 1, Qu: 1
		});
	}

	/** Selects and returns a random die instance, after decrementing the vowel or
	 *  consonant count, as appropriate. */
	uDraw() {
		const oCtText = this.CtVow + this.CtConson;
		if (oCtText < 1)
			throw Error("tPoolDie.uDraw: Pool exhausted");

		const ojDraw = this.GenRnd.uInt(oCtText);

		let oText;
		if (ojDraw < this.CtVow) {
			oText = this.qTextsVow.uDraw();
			--this.CtVow;
		}
		else {
			oText = this.qTextsConson.uDraw();
			--this.CtConson;
		}

		const oDir = Dir4.uRnd(this.GenRnd);
		return new tDie(oText, oDir);
	}
}

/** Stores a pool of text values, which can then be drawn one by one. Each value
 *  has a count, which is decremented when the value is drawn. When a count
 *  reaches zero, the associated value will be drawn no more. */
class tPoolText {
	// Instead of storing and decrementing counts for each text, we could create a
	// separate object for each possible draw. That would be simpler, and the
	// performance would be acceptable, given the small pool sizes.
	//
	// It might be desirable later to support fractional counts, however. These
	// would allow finer probability distinctions between letters like 'M' and
	// 'W', which both have counts of 'two' at present. With integer counts,
	// distinctions like this can be made only by increasing all the counts
	// together, which is inconvenient. It also becomes necessary to increase the
	// amount by which a count is decremented when the text is drawn; otherwise,
	// the draw has a much smaller effect on the remaining count, and it becomes
	// possible to draw the same text many times.

	/** Returns the total value count in the specified entries object. */
	static suCt(aoEnts) {
		const ouSum = (aTtl, aVal) => (aTtl + aVal);
		const oCt = Object.values(aoEnts).reduce(ouSum);
		if (isNaN(oCt))
			throw Error("tPoolText.suCt: Invalid count");
		return oCt;
	}

	/** Creates a new pool containing text values drawn from the properties of
	 *  aqEnts, with counts equal to the aqEnts values. */
	constructor(aqGenRnd, aqEnts) {
		this.GenRnd = aqGenRnd;

		/** The total value count available to be drawn. */
		this.Ct = tPoolText.suCt(aqEnts);
		/** An object that associates text values with counts. These counts will be
		 *  decremented as the values are drawn. */
		this.qEnts = { ...aqEnts };
	}

	/** Selects and returns a random text value, after decrementing its count. */
	uDraw() {
		// Replace this with a fractional draw index, so that text values can have
		// non-integer counts? See the tPoolText comments for more on this:
		let ojDraw = this.GenRnd.uInt(this.Ct);
		for (const onText in this.qEnts) {
			ojDraw -= this.qEnts[onText];
			if (ojDraw < 0) {
				--this.Ct;
				--this.qEnts[onText];
				return onText;
			}
		}
		throw Error("tPoolText.uDraw: Pool exhausted");
	}
}

export const ForTest = {
	tPoolText
};
