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
		/** A Cfg record containing the player's app-level configuration selections. */
		Cfg: Persist.uRead("Cfg") ?? Cfg.uDef(),
		/** A Setup record containing the player's game configuration selections for
		 *  the pending, current, or completed round. */
		Setup: Setup.uFromParse(Persist.uRead("Setup")) ?? Setup.uDef(),
		/** A `StsApp` value that determines which view is visible. */
		//
		// 'App' seems redundant in this name, but remember that the local storage
		// keys must be unique across all slices:
		StApp: Persist.uRead("StApp") ?? StsApp.Sets
	},

	reducers: {
		Set_Cfg: (aSt, aAct) => { aSt.Cfg = aAct.payload; },
		Set_Setup: (aSt, aAct) => { aSt.Setup = aAct.payload; },
		Set_StApp: (aSt, aAct) => { aSt.StApp = aAct.payload; }
	}
});
export default Slice;

export const { Set_Cfg, Set_Setup, Set_StApp } = Slice.actions;

// Selectors
// ---------

export const uSelCfg = (aSt) => aSt.App.Cfg;
export const uSelSetup = (aSt) => aSt.App.Setup;
export const uSelStApp = (aSt) => aSt.App.StApp;
