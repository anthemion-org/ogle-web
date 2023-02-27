// Misc.js
// =======
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Misc from "../Util/Misc.js";
//

/** Returns a new array of the specified length, with each element set to aVal. */
export function uGen_Arr(aLen, aVal) {
	return Array(aLen).fill(aVal);
}

/** Returns true if the app is running on a mobile device. */
export function uCkMob() {
	// MDN suggests just checking for 'Mobi':
	//
	//   https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
	//
	// They don't explain what they mean by 'mobile', however, and it seems like
	// they exclude tablets from that category. In any event, 'Mobi' does not work
	// for the Samsung Galaxy Tab, so we will check the OS instead:
	const oPlats = /Android|BlackBerry|iPad|iPhone|iPod|webOS|Windows Phone/i;
	return oPlats.test(navigator.userAgent);
}

/** Returns `true` if the app has been installed, and if it was started as an
 *  app, rather than running in the browser. */
export function uCkRunInstall() {
	return window.matchMedia("(display-mode: standalone)").matches;
}
