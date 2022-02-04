// Pt2.js
// ------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tPt2 } from "../Util/Pt2.js";
//

/** Represents a two-dimensional point. */
export class tPt2 {
	/** Creates an instance from the specified POD and returns it. */
	static suFromPOD(aPOD) {
		if (!aPOD) return null;

		// Recall that 'JSON.stringify' writes Infinity as 'null'. Is that likely to
		// become a problem here?:
		return new tPt2(aPOD.X, aPOD.Y);
	}

	constructor(aX, aY) {
		this.X = aX;
		this.Y = aY;
	}

	/** Returns 'true' if the specified instance is equal to this one. */
	uCkEq(aPt) {
		return (aPt.X === this.X) && (aPt.Y === this.Y);
	}

	/** Returns 'true' if the specified instance is adjacent, horizontally,
	 *  vertically, or diagonally, from this one. */
	uCkAdjacent(aPt) {
		return (Math.abs(aPt.X - this.X) <= 1) && (Math.abs(aPt.Y - this.Y) <= 1);
	}

	/** Returns a new instance that is the sum of this and the specified instance. */
	uSum(aPt) {
		return new tPt2((this.X + aPt.X), (this.Y + aPt.Y));
	}

	/** Returns a new instance that is equal to this instance, less the specified
	 *  instance. */
	uDiff(aPt) {
		return new tPt2((this.X - aPt.X), (this.Y - aPt.Y));
	}
}
