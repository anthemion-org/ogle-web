// Setup.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tSetup } from "../Setup.js";
//

export class tSetup {
	constructor(aYield, aPace) {
		/** The game yield. */
		this.Yield = aYield;
		/** The game pace. */
		this.Pace = aPace;
	}


}

/** The maximum game yield. */
tSetup.sYieldMax = 2;
/** The maximum game pace. */
tSetup.sPaceMax = 6;
