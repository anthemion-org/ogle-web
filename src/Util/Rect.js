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
	constructor(aqLeftBtm, aqSize) {
		if (!aqLeftBtm instanceof tPt2)
			throw Error("tRect.constructor: Invalid position");
		if (!aqSize instanceof tPt2)
			throw Error("tRect.constructor: Invalid size");

		/** The left-bottom corner of the rectangle. */
		this.qLeftBtm = aqLeftBtm;
		/** The size of the rectangle. */
		this.qSize = aqSize;
	}

	/** Returns the tPt2 position of the top-right corner. Because the rectangle
	 *  has integer coordinates, this corner is 'qSize - (1, 1)' from qLeftBtm,
	 *  not qSize from it. */
	uTopRight() {
		return new tPt2(
			(this.qLeftBtm.X + this.qSize.X - 1),
			(this.qLeftBtm.Y + this.qSize.Y - 1)
		);
	}

	/** Returns 'true' if the specified position is contained by this instance. */
	uCkContain(aqPos) {
		if (!aqPos instanceof tPt2)
			throw Error("tRect.uCkContain: Invalid point");

		const oqTopRight = this.uTopRight();
		return (aqPos.X >= this.qLeftBtm.X) && (aqPos.X <= oqTopRight.X)
			&& (aqPos.Y >= this.qLeftBtm.Y) && (aqPos.Y <= oqTopRight.Y);
	}
}
