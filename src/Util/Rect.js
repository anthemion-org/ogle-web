// Rect.js
// =======
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Rect from "../Util/Rect.js";
//

import * as Pt2 from "./Pt2.js";
import * as Misc from "./Misc.js";

// Rect
// ----
// Each Rect stereotype represents a rectangle with integer coordinates. This
// stereotype is immutable.

/** Creates an instance with the specified Pt2 position and size stereotypes. */
export function uNew(aLeftTop, aSize) {
	const oRect = {
		/** The left-top corner of the rectangle. */
		LeftTop: aLeftTop,
		/** The size of the rectangle. */
		Size: aSize
	};
	if (Misc.CkDev) Object.freeze(oRect);
	return oRect;
}

/** Returns the Pt2 position of the top-right corner of a Rect stereotype.
 *  Because the rectangle has integer coordinates, this corner is 'Size - (1,
 *  1)' from `LeftTop`, not `Size` from it. */
export function uTopRight(aRect) {
	return Pt2.uNew(
		(aRect.LeftTop.X + aRect.Size.X - 1),
		(aRect.LeftTop.Y + aRect.Size.Y - 1)
	);
}

/** Returns `true` if the specified Pt2 position is contained by `aRect`. */
export function uCkContain(aRect, aPos) {
	const oTopRight = uTopRight(aRect);
	return (aPos.X >= aRect.LeftTop.X) && (aPos.X <= oTopRight.X)
		&& (aPos.Y >= aRect.LeftTop.Y) && (aPos.Y <= oTopRight.Y);
}

/** Returns a generator object that iterates all Pt2 positions contained by
 *  a Rect stereotype. Positions are iterated from left to right, and then from
 *  top to bottom. */
export function* uiPosi(aRect) {
	const oTopRight = uTopRight(aRect);
	for (let oY = aRect.LeftTop.Y; oY <= oTopRight.Y; ++oY)
		for (let oX = aRect.LeftTop.X; oX <= oTopRight.X; ++oX)
			yield Pt2.uNew(oX, oY);
}
