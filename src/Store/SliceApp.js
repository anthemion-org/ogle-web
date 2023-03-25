// SliceApp.js
// ===========
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import SliceApp from "./Store/SliceApp.js";
//

import * as Cfg from "../Cfg.js";
import * as Setup from "../Round/Setup.js";
import StsApp from "../StsApp.js";
import * as Persist from "../Persist.js";

import { createSlice } from "@reduxjs/toolkit";

// Slice
// -----

export const Slice = createSlice({
	name: "App",

	initialState: {
		/** The Cfg stereotype for the app. */
		Cfg: Cfg.uFromParse(Persist.uRead("Cfg")) ?? Cfg.uDef(),
		/** The Setup stereotype for the next, current, or just completed round. */
		Setup: Setup.uFromParse(Persist.uRead("Setup")) ?? Setup.uDef(),
		/** A `StsApp` value that determines which view is visible. */
		//
		// 'App' seems redundant in this name, but remember that the local storage
		// keys must be unique across all slices:
		StApp: Persist.uRead("StApp") ?? StsApp.Sets,
		/** Set to `true` if this app instance has been scrammed. */
		//
		// See `ConflictTab.js` for more on this:
		CkScram: false
	},

	reducers: {
		Set_Cfg: (aSt, aAct) => { aSt.Cfg = aAct.payload; },
		Set_Setup: (aSt, aAct) => { aSt.Setup = aAct.payload; },
		Set_StApp: (aSt, aAct) => { aSt.StApp = aAct.payload; },
		Set_CkScram: (aSt, aAct) => { aSt.CkScram = aAct.payload; }
	}
});
export default Slice;

export const { Set_Cfg, Set_Setup, Set_StApp, Set_CkScram } = Slice.actions;

// Selectors
// ---------

export const uSelCfg = (aSt) => aSt.App.Cfg;
export const uSelSetup = (aSt) => aSt.App.Setup;
export const uSelStApp = (aSt) => aSt.App.StApp;
export const uSelCkScram = (aSt) => aSt.App.CkScram;
