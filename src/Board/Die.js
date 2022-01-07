// Die.js
// ------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import * as Dir4 from "../Util/Dir4.js";

export default class tDie {
	// Creates an instance with the specified text and orientation. Throws if
	// aDir4 is not a member of Dir4.Vals.
	constructor(aText, aDir4) {
		// The die text.
		this.Text = aText;

		if (!Dir4.uCk(aDir4))
			throw new Error("tDie: Invalid direction");
		// The side of the die with which the text top aligns.
		this.Dir4 = aDir4;

		// Set to 'true' if the text should be underlined.
		this.CkUnder = ["L", "T", "N", "Z", "W"].includes(aText);
	}
}
