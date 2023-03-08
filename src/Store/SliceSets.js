// SliceSets.js
// ============
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import SliceSets from "./Store/SliceSets.js";
//

import * as Cfg from "../Cfg.js";
import * as Setup from "../Round/Setup.js";
import * as Persist from "../Persist.js";

import { createSlice } from "@reduxjs/toolkit";

// Slice
// -----

export const Slice = createSlice({
	name: "Sets",

	initialState: {
		/** The Cfg record containing the player's app-level configuration
		 *  selections. */
		Cfg: Persist.uGetPlain("Cfg") ?? Cfg.uDef(),
		/** The Setup record containing the player's game configuration selections. */
		Setup: Setup.uFromParse(Persist.uGetPlain("Setup")) ?? Setup.uDef()
	},

	reducers: {
		Set_Cfg: (aSt, aAct) => { aSt.Cfg = aAct.payload; },
		Set_Setup: (aSt, aAct) => { aSt.Setup = aAct.payload; },
	}
});
export default Slice;

export const { Set_Cfg, Set_Setup } = Slice.actions;

// Selectors
// ---------

export const uSelCfg = (aSt) => aSt.Sets.Cfg;
export const uSelSetup = (aSt) => aSt.Sets.Setup;
