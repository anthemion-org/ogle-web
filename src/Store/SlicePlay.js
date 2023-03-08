// SlicePlay.js
// ============
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import SlicePlay from "./Store/SlicePlay.js";
//

import StsApp from "../StsApp.js";
import { Set_StApp } from "./SliceApp.js";
import * as Persist from "../Persist.js";

import { createSlice } from "@reduxjs/toolkit";

// Slice
// -----

export const Slice = createSlice({
	name: "Play",

	initialState: {
		EntWord: {}
	},

	reducers: {
		Set_EntWord: (aSt, aAct) => {
		},
	},

	extraReducers(aBuild) {
		aBuild.addCase(Set_StApp.type, (aSt, aAct) => {
			if (aAct.payload === StsApp.Play) {
				Persist.uSet("Board", null);
				Persist.uSet("CardOgle", null);
				Persist.uSet("CardUser", null);
				Persist.uSet("TimeElap", 0);
			}
		});
	}
});
export default Slice;

export const { Set_EntWord } = Slice.actions;

// Selectors
// ---------

export const uSelEntWord = (aSt) => aSt.Play.EntWord;
