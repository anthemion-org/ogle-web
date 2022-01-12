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

/** Represents one die within the board. */
export class tDie {
	/** Creates an instance with the specified text and orientation. Throws if
	 *  aDir4 is not a member of Dir4.Vals. */
	constructor(aText, aDir4) {
		/** The die text. */
		this.Text = aText;
		/** The side of the die with which the text top aligns. */
		this.Dir4 = aDir4;
		/** Set to 'true' if the text should be underlined. */
		this.CkUnder = ["L", "T", "N", "Z", "W"].includes(aText);

		if (!Dir4.uCk(this.Dir4))
			throw new Error("tDie: Invalid direction");
	}
}
