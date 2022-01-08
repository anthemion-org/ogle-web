// Pool.js
// -------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tPool } from "../Pool.js";
//

import { tDie } from "./Die.js";
import * as Rnd from "../Util/Rnd.js";
import * as Dir4 from "../Util/Dir4.js";
import * as Cfg from "../Cfg.js";

// Stores a 'pool' of text values, which can be drawn randomly as tDie instances
// to produce a board. A fixed number of vowels will be found in any board, once
// the entire board has been drawn.
export class tPool {
	constructor() {
		// The desired vowel frequency.
		const oRatioVow = 9 / 25;

		// The number of vowels yet to be drawn.
		this.CtVow = Math.round(oRatioVow * Cfg.CtDie);
		// The number of consonants yet to be drawn.
		this.CtConson = Cfg.CtDie - this.CtVow;

		// The vowel pool.
		this.qSubVow = new tPoolSub({
			E: 6,
			A: 4, O: 4,
			I: 3,
			U: 1, Y: 1
		});

		// The consonant pool.
		this.qSubConson = new tPoolSub({
			T: 7, N: 7,
			S: 6, H: 6, R: 6,
			D: 4, L: 4,
			C: 3,
			M: 2, W: 2, F: 2, G: 2, P: 2,
			B: 1, V: 1, K: 1, J: 1, X: 1, Z: 1, Qu: 1
		});
	}

	// Selects and returns a random die instance, after decrementing the vowel or
	// consonant count, as appropriate.
	uDie() {
		const oCtText = this.CtVow + this.CtConson;
		if (oCtText < 1)
			throw new Error("tPool.uDie: Cannot draw text");

		const ojDraw = Rnd.uInt(oCtText);

		let oText;
		if (ojDraw < this.CtVow) {
			oText = this.qSubVow.uDraw();
			--this.CtVow;
		}
		else {
			oText = this.qSubConson.uDraw();
			--this.CtConson;
		}

		const oDir = Dir4.uRnd();
		return new tDie(oText, oDir);
	}
}

// Stores a 'pool' of text values, which can then be drawn one by one. Each
// value has a count, which is decremented when the value is drawn. When a count
// reaches zero, the associated value will be drawn no more.
class tPoolSub {
	// Instead of storing and decrementing counts for each text, we could create a
	// separate text object for each draw. This would be simpler, and the
	// performance would be acceptable, given the small pool sizes.
	//
	// It might be desirable later to support fractional counts, however. These
	// would allow finer probability distinctions between letters like 'M' and
	// 'W', which both have counts of 'two' at present. With integer counts,
	// distinctions like this can be made only by increasing all the counts
	// together, which is inconvenient, and which then allows the same letter to
	// be drawn many times, since each draw has a much smaller effect on the
	// remaining count.

	// Returns the total value count in the specified entries object.
	static suCt(aoEnts) {
		const ouSum = (aTtl, aVal) => (aTtl + aVal);
		const oCt = Object.values(aoEnts).reduce(ouSum);
		if (isNaN(oCt))
			throw new Error("tPoolSub.suCt: Invalid count");
		return oCt;
	}

	// Creates a new pool containing text values drawn from the properties of
	// aqEnts, with counts equal to the aqEnts values.
	constructor(aqEnts) {
		// The total value count available to be drawn.
		this.Ct = tPoolSub.suCt(aqEnts);
		// An object that associates text values with counts. These counts will be
		// decremented as the values are drawn.
		this.qEnts = { ...aqEnts };
	}

	// Selects and returns a random text value, after decrementing its count.
	uDraw() {
		// Replace this with a fractional draw index, so that text values can have
		// non-integer counts? See the tPoolSub comments for more on this:
		let ojDraw = Rnd.uInt(this.Ct);
		for (const onText in this.qEnts) {
			ojDraw -= this.qEnts[onText];
			if (ojDraw < 0) {
				--this.Ct;
				--this.qEnts[onText];
				return onText;
			}
		}
		throw new Error("tPoolSub.uDraw: Cannot draw text value");
	}
}

export const ForTest = {
	tPoolSub
};
