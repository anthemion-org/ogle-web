// Rect.js
// -------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tRect } from "../Util/Rect.js";
//

import { tPt2 } from "./Pt2.js";

/** Represents a rectangle with integer coordinates. */
export class tRect {
	/** Creates an instance with the specified tPt2 position and size. */
	constructor(aLeftBtm, aSize) {
		/** The left-bottom corner of the rectangle. */
		this.LeftBtm = aLeftBtm;
		/** The size of the rectangle. */
		this.Size = aSize;
	}

	/** Returns the tPt2 position of the top-right corner. Because the rectangle
	 *  has integer coordinates, this corner is 'Size - (1, 1)' from qLeftBtm,
	 *  not Size from it. */
	uTopRight() {
		return new tPt2(
			(this.LeftBtm.X + this.Size.X - 1),
			(this.LeftBtm.Y + this.Size.Y - 1)
		);
	}

	/** Returns 'true' if the specified position is contained by this instance. */
	uCkContain(aPos) {
		const oTopRight = this.uTopRight();
		return (aPos.X >= this.LeftBtm.X) && (aPos.X <= oTopRight.X)
			&& (aPos.Y >= this.LeftBtm.Y) && (aPos.Y <= oTopRight.Y);
	}

	/** Returns a generator object that iterates all tPt2 positions contained by
	 *  this instance. Positions are iterated from left to right, and then from
	 *  bottom to top. */
	* uPosi() {
		const oTopRight = this.uTopRight();
		for (let oY = this.LeftBtm.Y; oY <= oTopRight.Y; ++oY)
			for (let oX = this.LeftBtm.X; oX <= oTopRight.X; ++oX)
				yield new tPt2(oX, oY);
	}
}
