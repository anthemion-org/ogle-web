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
	constructor(aLeftTop, aSize) {
		/** The left-top corner of the rectangle. */
		this.LeftTop = aLeftTop;
		/** The size of the rectangle. */
		this.Size = aSize;
	}

	/** Returns the tPt2 position of the top-right corner. Because the rectangle
	 *  has integer coordinates, this corner is 'Size - (1, 1)' from LeftTop,
	 *  not Size from it. */
	uTopRight() {
		return new tPt2(
			(this.LeftTop.X + this.Size.X - 1),
			(this.LeftTop.Y + this.Size.Y - 1)
		);
	}

	/** Returns 'true' if the specified position is contained by this instance. */
	uCkContain(aPos) {
		const oTopRight = this.uTopRight();
		return (aPos.X >= this.LeftTop.X) && (aPos.X <= oTopRight.X)
			&& (aPos.Y >= this.LeftTop.Y) && (aPos.Y <= oTopRight.Y);
	}

	/** Returns a generator object that iterates all tPt2 positions contained by
	 *  this instance. Positions are iterated from left to right, and then from
	 *  top to bottom. */
	* uPosi() {
		const oTopRight = this.uTopRight();
		for (let oY = this.LeftTop.Y; oY <= oTopRight.Y; ++oY)
			for (let oX = this.LeftTop.X; oX <= oTopRight.X; ++oX)
				yield new tPt2(oX, oY);
	}
}
