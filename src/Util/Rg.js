// Rg.js
// -----
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tRg } from "../Util/Rg.js";
//

/** Represents an integer range. */
export class tRg {
	/** If aStart is greater than aEnd, the range will have zero length. */
	constructor(aStart, aEnd) {
		/** The lowest value in the range, or -Infinity if there is no lower limit. */
		this.Start = aStart;
		/** The highest value in the range, or Infinity if there is no upper limit. */
		this.End = aEnd;
	}

	/** Returns the integer length of the range. */
	uLen() {
		if (this.Start > this.End) return 0;
		if (!isFinite(this.Start) || !isFinite(this.End)) return Infinity;
		return this.End - this.Start + 1;
	}

	/** Returns 'true' if the specified range is equal to this range. */
	uCkEqual(aVal) {
		return (aVal.Start === this.Start) && (aVal.End === this.End);
	}

	/** Returns 'true' if the specified value is within the range. */
	uCkContain(aVal) {
		return (aVal >= this.Start) && (aVal <= this.End);
	}
}
