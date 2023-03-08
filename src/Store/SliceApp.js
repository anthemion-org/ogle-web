// SliceApp.js
// ===========
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import SliceApp from "./Store/SliceApp.js";
//

import StsApp from "../StsApp.js";
import * as Persist from "../Persist.js";

import { createSlice } from "@reduxjs/toolkit";

// Slice
// -----
// Not much in this slice right now, but there could be more later.

export const Slice = createSlice({
	name: "App",

	initialState: {
		/** A `StsApp` value that determines which view is visible. */
		//
		// 'App' seems redundant now, but removing it would change the local storage
		// key:
		StApp: Persist.uGetPlain("StApp") ?? StsApp.Sets
	},

	reducers: {
		Set_StApp: (aSt, aAct) => {
			aSt.StApp = aAct.payload;

			switch (aAct.payload) {
				case StsApp.PlayInit: {
					// Move to Play slice `extraReducers`: [todo]
					Persist.uSet("Board", null);
					Persist.uSet("CardOgle", null);
					Persist.uSet("CardUser", null);
					Persist.uSet("TimeElap", 0);
					aSt.StApp = StsApp.Play;
					break;
				}
			}
		}
	}
});
export default Slice;

export const { Set_StApp } = Slice.actions;

// Selectors
// ---------

export const uSelStApp = (aSt) => aSt.App.StApp;
