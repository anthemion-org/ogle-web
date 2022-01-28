// StsApp.js
// ---------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import StsApp from "./StsApp.js";
//

/** Lists the top-level application states. These are used as reducer actions
 *  when requesting state transitions. */
const StsApp = {
	/** Displays the Setup view. */
	Setup: "Setup",
	/** Displays the About view. */
	About: "About",
	/** Resets the play state, then display the Play view. */
	PlayInit: "PlayInit",
	/** Displays the Play view. */
	Play: "Play",
	/** Displays the Result view. */
	Result: "Result",
};
Object.freeze(StsApp);

export default StsApp;
