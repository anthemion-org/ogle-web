// PoolText.js
// -----------
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tConfigPoolText, tPoolText } from "../PoolText.js";
//

/** Stores configuration data for `tPoolText`. This class is immutable. */
export class tConfigPoolText {
	constructor(aCtMinStart, aDropCt, aCtMinDraw) {
		/** The minimum starting text count. Increase this number to see more rare
		 *  letter dice. */
		this.CtMinStart = aCtMinStart;
		/** The amount by which each text count drops, after it is drawn. Increase
		 *  this number to see fewer duplicates and more rare letter dice. */
		this.DropCt = aDropCt;
		/** The minimum allowable text count, after a given text has been drawn.
		 *  Increase this number to see more duplicate letter dice. */
		this.CtMinDraw = aCtMinDraw;
	}

	/** Returns a short string that describes this configuration. */
	uDesc() {
		return `${this.CtMinStart}/${this.DropCt}/${this.CtMinDraw}`;
	}
}

/** Stores a pool of text values, which can then be drawn one by one. Each value
 *  has a count, which is decremented when the value is drawn. If a count
 *  reaches zero, the associated value will not be drawn again.
 *
 *  This class is mutable. */
export class tPoolText {
	/** Derives a new counts object from `aCtsBaseByText`, with each count equal
	 *  to `aCtMinStart` or greater. */
	static _suCtsAdjFromBase(aCtsBaseByText, aCtMinStart) {
		const oCtsAdj = { ...aCtsBaseByText };
		for (const on in oCtsAdj) {
			if (oCtsAdj[on] < aCtMinStart) oCtsAdj[on] = aCtMinStart;
		}
		return oCtsAdj;
	}

	/** Returns the total value count in the specified entries object. */
	static _suCt(aCtsByText) {
		const ouSum = (aTtl, aVal) => (aTtl + aVal);
		const oCt = Object.values(aCtsByText).reduce(ouSum);
		if (isNaN(oCt))
			throw Error("tPoolText.suCt: Invalid count");
		return oCt;
	}

	/** Creates a new pool containing text values and counts derived from
	 *  `tConfigPoolText` instance `aConfig`. */
	constructor(aGenRnd, aCtsBaseByText, aConfig) {
		if (!aGenRnd)
			throw Error("tPoolText: Number generator not provided");
		if (!aCtsBaseByText)
			throw Error("tPoolText: Base counts not provided");
		if (!aConfig)
			throw Error("tPoolText: Configuration not provided");

		this._GenRnd = aGenRnd;
		this._Config = aConfig;

		/** An object that associates text values with counts, which minimum
		 *  starting counts applied. These counts will be decremented as the values
		 *  are drawn. */
		this._CtsByText = tPoolText._suCtsAdjFromBase(aCtsBaseByText,
			aConfig.CtMinStart);
		/** The total value count available to be drawn. */
		this._Ct = tPoolText._suCt(this._CtsByText);
	}

	/** Selects and returns a random text value, after decrementing its count. */
	uDraw() {
		let oPosDraw = this._GenRnd.uFloat() * this._Ct;
		for (const onText in this._CtsByText) {
			oPosDraw -= this._CtsByText[onText];
			if (oPosDraw < 0) {
				const oCtOld = this._CtsByText[onText];
				const oCtNew = Math.max(
					(oCtOld - this._Config.DropCt),
					this._Config.CtMinDraw
				);

				this._Ct += (oCtNew - oCtOld);
				this._CtsByText[onText] = oCtNew;
				return onText;
			}
		}
		throw Error("tPoolText.uDraw: Pool exhausted");
	}
}
