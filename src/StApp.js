// StApp.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as StApp from "./StApp.js";
//

/** A list of the forms and other views that can be displayed by this app. These
 *  are used to represent the general application state, and also as reducer
 *  action values that are used to request state transitions. */
export const Views = {
	/** Displays the Setup view. */
	Setup: "Setup",
	/** Displays the About view. */
	About: "About",
	/** Displays the Play view. */
	Play: "Play"
};
Object.freeze(Views);
