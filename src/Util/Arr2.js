// Arr2.js
// -------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tArr2 } from "../Util/Arr2.js";
//

/** A rectangular array backed by a linear JavaScript array, for fast copying. */
export class tArr2 {
	/** Creates a new instance with the specified tPt2 size. If apOpts is defined,
	 *  the new elements will be copied from JavaScript array apOpts.Src, or set
	 *  to default value apOpts.Def. If it is not defined, the elements will be
	 *  left undefined. */
	constructor(aSize, aOpts) {
		/** The dimensions of this instance. */
		this.Size = aSize;

		const oSrc = aOpts?.Src;
		const oCt = aSize.X * aSize.Y;
		if (oSrc) {
			if (oSrc.length !== oCt)
				throw Error("tArr2.constructor: Source dimensions do not match");

			/** The linear JavaScript array that backs this instance. */
			this.Els = Array.from(oSrc);
		}
		else {
			this.Els = Array(oCt);

			const oDef = aOpts?.Def;
			if (oDef !== undefined) this.Els.fill(oDef);
		}
	}

	/** Returns the value at the specified tPt2 position. */
	uGet(aPos) {
		const oj = uIdxCk(this, aPos, "uGet");
		return this.Els[oj];
	}

	/** Sets the value at the specified tPt2 position. */
	uSet(aPos, aVal) {
		const oj = uIdxCk(this, aPos, "uSet");
		this.Els[oj] = aVal;
	}

	/** Returns a copy of this instance. */
	uClone() {
		return new tArr2(this.Size, { Src: this.Els });
	}
}

function uIdxCk(aArr, aPos, aName) {
	const oj = (aPos.Y * aArr.Size.X) + aPos.X;
	if ((oj < 0) || (oj >= aArr.Els.length))
		throw Error("tArr2." + aName + ": Invalid position");
	return oj;
}
