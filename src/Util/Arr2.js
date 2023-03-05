// Arr2.js
// =======
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tArr2 } from "../Util/Arr2.js";
//

/** A rectangular array backed by a linear array, for fast copying. This class
 *  is mutable.*/
export class tArr2 {
	/** Creates an instance with the specified Pt2 size. If `aOpts` is defined,
	 *  the new elements will be copied from linear array `aOpts.Src`, or set to
	 *  default value `aOpts.Def`. If it is not defined, the elements will be left
	 *  undefined. */
	constructor(aSize, aOpts) {
		/** The dimensions of this instance. */
		this.Size = aSize;

		const oSrc = aOpts?.Src;
		const oCt = aSize.X * aSize.Y;
		if (oSrc) {
			if (oSrc.length !== oCt)
				throw Error("tArr2: Source dimensions do not match");

			/** The linear array that backs this instance. */
			this._Els = Array.from(oSrc);
		}
		else {
			this._Els = Array(oCt);

			const oDef = aOpts?.Def;
			if (oDef !== undefined) this._Els.fill(oDef);
		}
	}

	/** Returns the value at the specified Pt2 position. */
	uGet(aPos) {
		const oj = uIdxCk(this, aPos, "uGet");
		return this._Els[oj];
	}

	/** Sets the value at the specified Pt2 position. */
	uSet(aPos, aVal) {
		const oj = uIdxCk(this, aPos, "uSet");
		this._Els[oj] = aVal;
	}

	/** Returns a shallow copy of this instance. */
	uCopy() {
		return new tArr2(this.Size, { Src: this._Els });
	}

	/** Returns a deep copy of this instance. */
	uClone() {
		const oArr = new tArr2(this.Size, { Src: this._Els });
		oArr._Els = oArr._Els.map(a => a.uClone());
		return oArr;
	}
}

function uIdxCk(aArr, aPos, aName) {
	const oj = (aPos.Y * aArr.Size.X) + aPos.X;
	if ((oj < 0) || (oj >= aArr._Els.length))
		throw Error("tArr2." + aName + ": Invalid position");
	return oj;
}
