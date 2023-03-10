// Store.js
// ========
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org

import SliceApp from "./SliceApp";
import SlicePlay from "./SlicePlay";
import SliceScore from "./SliceScore";
import * as Persist from "../Persist.js";

import { configureStore } from "@reduxjs/toolkit";

// All slice-level values must have names that are unique across all slices! See
// `_uPersist_Store` for more on that:
const Store = configureStore({
	reducer: {
		App: SliceApp.reducer,
		Play: SlicePlay.reducer,
		Score: SliceScore.reducer
	}
});
export default Store;

// Persistence
// -----------

/** The names of any values that should _not_ be persisted. */
//
// Data should not be added to the store unless it is used by two or more
// components. Shared data is likely to require persistence, so we will persist
// everything by default:
const _NamesPersistSkip = [];

/** Returns an object containing all slice-level values in the store, without
 *  the slice objects themselves. */
function _uValsStore() {
	const oVals = {};
	const oSt = Store.getState();
	for (const onSlice in oSt) {
		const oSlice = oSt[onSlice];
		for (const onVal in oSlice)
			if (!_NamesPersistSkip.includes(onVal)) oVals[onVal] = oSlice[onVal];
	}
	return oVals;
}

/** All values that have been persisted by `_uPersist_Store`. */
//
// Without `_uValsStore()`, this object would start out empty, and the first
// store update would cause all values to be persisted, instead of just the one
// that changed. Not a big deal, but:
const _ValsPersistLast = _uValsStore();

/** Persists recently-changed store values, excepting those in
 *  `_NamesPersistSkip`. */
//
// Early versions of this app did not use Redux, so there were no slice names. I
// want to use the same local storage keys, so for now at least, I will not add
// slice names to those keys. Therefore, though slice names are normally used to
// avoid action type collisions, keys in this project must be unique _across all
// slices_.
//
// There is a Redux middleware called 'redux-persist' that does something like
// this, but it looks like overkill, and that project has 492 open issues. This
// works fine:
function _uPersist_Store() {
	_Log(1, "Persisting store...");

	const oSt = Store.getState();
	for (const onSlice in oSt) {
		const oSlice = oSt[onSlice];
		for (const onVal in oSlice) {
			// Skip specified values:
			if (_NamesPersistSkip.includes(onVal)) {
				_Log(2, `Skipping value '${onVal}'...`);
				continue;
			}

			// Skip values that haven't changed:
			const oVal = oSlice[onVal];
			if (oVal === _ValsPersistLast[onVal]) {
				_Log(2, `No change to value '${onVal}'...`);
				continue;
			}

			// Write everything else:
			_Log(2, `Writing value '${onVal}'...`);
			Persist.uWrite(onVal, oVal);
			_ValsPersistLast[onVal] = oVal;
		}
	}
}
Store.subscribe(_uPersist_Store);

// Logging
// -------

/** Set to zero to disable logging in this module. */
const _LvlLog = 0;

/** Logs `aText` if `_LvlLog` is `aLvlLogMin` or greater. */
function _Log(aLvlLogMin, aText) {
	if (_LvlLog >= aLvlLogMin) console.log(aText);
}
