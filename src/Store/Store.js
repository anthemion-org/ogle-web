// Store.js
// ========
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org

import SliceScore from "./SliceScore";
import { configureStore } from "@reduxjs/toolkit";

const Store = configureStore({
	reducer: {
		Score: SliceScore.reducer
	}
});
export default Store;

Store.subscribe(() => {
	const oSt = Store.getState();
	for (const onSlice in oSt) {
		for (const onVal in oSt[onSlice]) {
			console.log(onVal);
		}
	}
});
