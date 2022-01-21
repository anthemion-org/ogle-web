// ActPlay.js
// ----------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as ActPlay from "./ActPlay.js";
//

/** Lists the 'play' actions that can be performed while ViewPlay is accepting
 *  input. 'Meta' actions (like pausing or ending the round) are not listed
 *  here. */
export const Vals = {
	/** Selects or unselects a die in the board. */
	Tog: "Tog",
	/** Enters the selected word. */
	Ent: "Ent",
	/** Clears the selected word. */
	Clear: "Clear"
};
Object.freeze(Vals);
