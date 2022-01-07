// Pool.js
// -------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import * as Rnd from "../Util/Rnd.js";

// Stores a set of 'entries', which associate text values with counts, and
// allows values to be drawn at random.
class tPoolSub {
	// Instead of storing and decrementing counts for each text, we could have
	// created a separate text object for each draw. That would have been okay,
	// given the small pool size, but it might be desirable later to allow
	// fractional counts. These would allow finer probability distinctions between
	// letters like 'M' and 'W', which both have counts of two at present. With
	// integer counts, distinctions like this can be made only by increasing all
	// the counts together, which is inconvenient, and which then allows the same
	// letter to be drawn many times, since each draw has a much smaller effect on
	// the remaining count.

	// Returns the total number of text values in aoEnts.
	static suCt(aoEnts) {
		const ouSum = (aTtl, aVal) => (aTtl + aVal);
		const oCt = Object.values(aoEnts).reduce(ouSum);
		if (isNaN(oCt))
			throw new Error("tPoolSub.suCt: Invalid count");
		return oCt;
	}

	// Set aoEnts to an object that associates text values with counts.
	constructor(aqEnts) {
		// The number of text values available to be drawn.
		this.Ct = tPoolSub.suCt(aqEnts);
		// An object that associates text values with counts. These counts will be
		// decremented as the values are drawn.
		this.qEnts = { ...aqEnts };
	}

	// Selects and returns a random text value, after decrementing its count.
	uDraw() {
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
