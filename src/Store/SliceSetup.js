// SliceSetup.js
// =============
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import SliceSetup from "./Store/SliceSetup.js";
//

import * as Setup from "../Round/Setup.js";
import * as Persist from "../Persist.js";

import { createSlice } from "@reduxjs/toolkit";

// Slice
// -----

export const Slice = createSlice({
	name: "Setup",

	initialState: {
		/** The Setup record containing the player's yield and pace selections. */
		Setup: Setup.uFromParse(Persist.uGetPlain("Setup")) ?? Setup.uDef()
	},

	reducers: {
		Set_Setup: (aSt, aAct) => {
			aSt.Setup = aAct.payload;
		},
	}
});
export default Slice;

export const { Set_Setup } = Slice.actions;

// Selectors
// ---------

export const uSelSetup = (aSt) => aSt.Setup.Setup;
