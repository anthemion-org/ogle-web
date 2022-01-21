// StApp.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as StApp from "./StApp.js";
//

/** Lists the forms and other views that can be displayed by this app. These
 *  represent the general application state, and are used as reducer action
 *  values when requesting state transitions. */
export const Views = {
	/** Display the Setup view. */
	Setup: "Setup",
	/** Display the About view. */
	About: "About",
	/** Display the Play view. */
	Play: "Play"
};
Object.freeze(Views);
