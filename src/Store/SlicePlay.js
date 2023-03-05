// SlicePlay.js
// ============
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import SlicePlay from "./Store/SlicePlay.js";
//

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
	}
});
export default Slice;

export const { Set_EntWord } = Slice.actions;

// Selectors
// ---------

export const uSelEntWord = (aSt) => aSt.Play.EntWord;
