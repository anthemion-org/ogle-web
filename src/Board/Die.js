// Die.js
// ------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tDie } from "../Die.js";
//

import * as Dir4 from "../Util/Dir4.js";

/** Represents one die within the board. This class is immutable. */
export class tDie {
	/** Creates an instance from the specified plain object and returns it. */
	static suFromPlain(aPlain) {
		if (!aPlain) return null;

		return new tDie(aPlain.Text, Dir4.Vals[aPlain.Dir4]);
	}

	/** Creates an instance with the specified text and orientation. Throws if
	 *  aDir4 is not a member of Dir4.Vals. */
	constructor(aText, aDir4) {
		if (!Dir4.uCk(aDir4))
			throw Error(`tDie: Invalid direction '${this.Dir4}'`);

		/** The die text. */
		this.Text = aText;
		/** The side of the die with which the text top aligns. */
		this.Dir4 = aDir4;
		/** Set to 'true' if the text should be underlined. */
		this.CkUnder = ["L", "T", "N", "Z", "W"].includes(aText);

		Object.freeze(this);
	}
}
