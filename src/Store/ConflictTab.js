// ConflictTab.js
// ==============
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org

// Import with:
//
//   import ConflictTab from "./Store/ConflictTab.js";
//

import { Set_CkScram, uSelCkScram } from "./SliceApp.js";
import Store from "./Store.js";
import * as Persist from "../Persist.js";

// Tab conflict check
// ------------------

const _TimeStartSess = Date.now();
console.log(`Starting session ${_TimeStartSess}...`);

Persist.uWrite("TimeStartSession", _TimeStartSess);

function _uCkConflictTab(aEvt) {
	console.log(`Session ${_TimeStartSess}: Local storage updated in foreign tab...`);

	const oCkScram = uSelCkScram(Store.getState());
	if (oCkScram) return;

	const oTimeStartSessPersist = Persist.uRead("TimeStartSession");
	if (oTimeStartSessPersist > _TimeStartSess) {
		console.log(`Session ${_TimeStartSess}: Scramming this session!`);
		Store.dispatch(Set_CkScram(true));
	}
};
window.addEventListener("storage", _uCkConflictTab);
