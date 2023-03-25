// Arr2.js
// =======
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Arr2 from "../Util/Arr2.js";
//

import * as Pt2 from "../Util/Pt2.js";
import * as Misc from "../Util/Misc.js";

// Arr2
// ----
// Each Arr2 stereotype represents a rectangular array. This stereotype is
// mutable.

/** Creates an instance with the specified Pt2 size. If `aOpts` is defined, the
 *  new elements will be copied from linear array `aOpts.Src`, or set to default
 *  value `aOpts.Def`. If it is not defined, the elements will be left
 *  undefined. */
export function uNew(aSize, aOpts) {
	const oArr2 = {
		/** The dimensions of the rectangle. */
		Size: aSize,
		/** The linear array that backs the stereotype. */
		//
		// We use a linear array for fast copying:
		_Els: undefined
	};

	const oSrc = aOpts?.Src;
	const oCt = aSize.X * aSize.Y;
	if (oSrc) {
		if (oSrc.length !== oCt)
			throw Error("Arr2: Source dimensions do not match");
		oArr2._Els = Array.from(oSrc);
	}
	else {
		oArr2._Els = Array(oCt);

		const oDef = aOpts?.Def;
		if (oDef !== undefined) oArr2._Els.fill(oDef);
	}

	return oArr2;
}

/** Returns the value in an Arr2 stereotype at the specified Pt2 position. */
export function uGet(aArr2, aPos) {
	const oj = _uIdxCk(aArr2, aPos, "uGet");
	return aArr2._Els[oj];
}

/** Sets the value in an Arr2 stereotype at the specified Pt2 position. */
export function uSet(aArr2, aPos, aVal) {
	const oj = _uIdxCk(aArr2, aPos, "uSet");
	aArr2._Els[oj] = aVal;
}

/** Returns a shallow copy of an Arr2 stereotype. */
export function uCopy(aArr2) {
	return uNew(aArr2.Size, { Src: aArr2._Els });
}

/** Returns a deep copy of an Arr2 stereotype. The array elements must implement
 *  `uClone`. */
export function uClone(aArr2) {
	const oArr2 = uNew(aArr2.Size, { Src: aArr2._Els });
	// Maybe we could check for the existance of `uClone`, and assume the elements
	// are immutable if it is not found?: [refactor]
	oArr2._Els = oArr2._Els.map(a => a.uClone());
	return oArr2;
}

function _uIdxCk(aArr, aPos, aNameCaller) {
	const oj = (aPos.Y * aArr.Size.X) + aPos.X;
	if ((oj < 0) || (oj >= aArr._Els.length))
		throw Error("Arr2 " + aNameCaller + ": Invalid position");
	return oj;
}
