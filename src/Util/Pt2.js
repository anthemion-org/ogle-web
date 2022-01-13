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
	constructor(aX, aY) {
		this.X = aX;
		this.Y = aY;
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
