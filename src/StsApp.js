// StsApp.js
// =========
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

// Import with:
//
//   import StsApp from "./StsApp.js";
//

/** This object lists the top-level application states. These are used as
 *  reducer actions when requesting state transitions. */
const StsApp = {
	/** Displays the Settings view. */
	Sets: "Sets",
	/** Displays the About view. */
	About: "About",
	/** Displays the Play view. */
	Play: "Play",
	/** Displays the Score view. */
	Score: "Score"
};
Object.freeze(StsApp);

export default StsApp;
