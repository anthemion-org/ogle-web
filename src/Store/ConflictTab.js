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
// In earlier versions, opening Ogle in a second tab would cause both instances
// to run with separate copies of the store. Both would write to local storage
// as the app was used. This created two problems:
//
// 1) The user could 'cheat' by finishing the round in one tab, and then copying
//    words from the Score view into the still-active Play view in the other
//    tab;
//
// 2) State inconsistencies could be produced by interacting with both tabs, and
//    then refreshing one of them. As an example:
//
//    a) Open Ogle in two tabs, with the Setup view displayed;
//
//    b) Start play in the first tab;
//
//    c) Change the setup in the second tab;
//
//    d) End the game in the first tab;
//
//    e) Refresh the Score view in the first tab, and observe that the displayed
//       setup would change from the first tab's selection to that of the
//       second. This even allowed high scores to be recorded against the wrong
//       setups.
//
// I don't care about the cheating, not least because the user can always cheat
// by modifying their local storage data. The second problem was significant,
// however, so this system disables the app in one tab when a second tab is
// opened. We will call this 'scramming'.
//
// The system works by writing the current time to the 'TimeStartSession' local
// storage key when it starts. This value identifies the current session, and
// also allows newer sessions to be distinguished from older. The system then
// monitors the DOM 'storage' event for local storage changes made by other
// tabs. If a change is detected, and if the persisted 'TimeStartSession' value
// is found to exceed the in-memory value, the `CkScram` flag is set within this
// tab's store, causing the Scram view to be displayed.
//
// As explained in the Scram view, the user can close this tab and continue in
// the other as usual. Alternatively, they can refresh this tab, which:
//
// - Replaces all state data in this tab with the content of the local storage
//   (this being the other tab's state when it last wrote to the storage);
//
// - Updates 'TimeStartSession' in the local storage with a new value;
//
// - Scrams the other tab instance.
//
// This approach is relatively simple, and it ensures that the user can always
// proceed without finding the other Ogle tab, which might be difficult. It
// provides no way to recover game state in scrammed tabs, but those are older
// instances, so I'm not bothered by that.

/** The UNIX time when this app instance started. */
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
// This event is triggered when another 'document' (in our case, a tab) writes
// to Ogle's local storage. For more on this:
//
//   https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
//
window.addEventListener("storage", _uCkConflictTab);
