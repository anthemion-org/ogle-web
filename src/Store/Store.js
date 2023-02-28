// Store.js
// ========
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org

import SliceScore from "./SliceScore";
import * as Persist from "../Persist.js";

import { configureStore } from "@reduxjs/toolkit";

const Store = configureStore({
	reducer: {
		Score: SliceScore.reducer
	}
});
export default Store;

// Persistence
// -----------

/** The names of any values that should _not_ be persisted. */
//
// Data should not be added to the store unless it is shared by two or more
// components. Shared data is likely to require persistence, so we will persist
// everything by default:
const NamesPersistSkip = [];

/** All values that have been persisted by `Persist_Store`. */
//
// This object start out empty, so the first store update causes all values to
// be persisted, instead of just the one that changed. I'm not worried about it:
const ValsPersistLast = {};

function Persist_Store() {
	Log(1, "Persisting store...");

	const oSt = Store.getState();
	for (const onSlice in oSt) {
		const oSlice = oSt[onSlice];
		for (const onVal in oSlice) {
			if (NamesPersistSkip.includes(onVal)) {
				Log(2, `Skipping value '${onVal}'...`);
				continue;
			}

			const oVal = oSlice[onVal];
			if (oVal === ValsPersistLast[onVal]) {
				Log(2, `No change to value '${onVal}'...`);
				continue;
			}

			Log(2, `Writing value '${onVal}'...`);
			Persist.uWrite(onVal, oVal);
			ValsPersistLast[onVal] = oVal;
		}
	}
}
Store.subscribe(Persist_Store);

// Logging
// -------

/** Set to zero to disable logging in this module. */
const LvlLog = 2;

/** Logs `aText` if `LvlLog` is `aLvlLogMin` or greater. */
function Log(aLvlLogMin, aText) {
	if (LvlLog >= aLvlLogMin) console.log(aText);
}
