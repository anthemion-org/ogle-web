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
	 *  the new elements will be copied from JavaScript array apOpts.ySrc, or set
	 *  to default value apOpts.Def. If it is not defined, the elements will be
	 *  left undefined. */
	constructor(aqSize, apOpts) {
		/** The dimensions of this instance. */
		this.qSize = aqSize;

		const oySrc = apOpts?.ySrc;
		const oCt = aqSize.X * aqSize.Y;
		if (oySrc) {
			if (oySrc.length !== oCt)
				throw Error("tArr2.constructor: Source dimensions do not match");

			/** The linear JavaScript array that backs this instance. */
			this.yEls = Array.from(oySrc);
		}
		else {
			this.yEls = Array(oCt);

			const oDef = apOpts?.Def;
			if (oDef !== undefined) this.yEls.fill(oDef);
		}
	}

	/** Returns the value at the specified tPt2 position. */
	uGet(aqPos) {
		const oj = uIdxCk(this, aqPos, "uGet");
		return this.yEls[oj];
	}

	/** Sets the value at the specified tPt2 position. */
	uSet(aqPos, aVal) {
		const oj = uIdxCk(this, aqPos, "uSet");
		this.yEls[oj] = aVal;
	}

	/** Returns a copy of this instance. */
	uClone() {
		return new tArr2(this.qSize, { ySrc: this.yEls });
	}
}

function uIdxCk(aqArr, aqPos, aName) {
	const oj = (aqPos.Y * aqArr.qSize.X) + aqPos.X;
	if ((oj < 0) || (oj >= aqArr.yEls.length))
		throw Error("tArr2." + aName + ": Invalid position");
	return oj;
}
