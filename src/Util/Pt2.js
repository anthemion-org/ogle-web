// Pt2.js
// ------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tPt2 } from "../Util/Pt2.js";
//

// Represents a two-dimensional point.
export class tPt2 {
	constructor(aX, aY) {
		if (isNaN(aX) || isNaN(aY))
			throw new Error("tPt2.constructor: Invalid coordinate");
		this.X = aX;
		this.Y = aY;
	}
}
