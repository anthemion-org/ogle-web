// Util.js
// =======
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Util from "./Util/Util.js";
//

/** Waits for `aMS` milliseconds before returning. */
export async function wWait(aMS) {
	return new Promise((auResolve, auReject) => {
		setTimeout(auResolve, aMS);
	});
}
