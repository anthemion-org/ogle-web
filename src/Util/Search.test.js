// Search.test.js
// --------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import * as Search from "../Util/Search.js";

test.each([
	// First element:
	[0, 0],
	// Middle element:
	[5, 5],
	// Last element:
	[7, 7]
])("uBin: Num match", (aVal, ajIns) => {
	const oEls = [0, 1, 2, 3, 4, 5, 6, 7];
	const [oCk, ojIns] = Search.uBin(oEls, aVal);
	expect(oCk).toBe(true);
	expect(ojIns).toBe(ajIns);
});

test.each([
	// Empty array:
	[[], 1, 0],
	// Odd index missing:
	[[0, 1, 2, 4, 5, 6, 7], 3, 3],
	// Even index missing:
	[[0, 1, 2, 3, 5, 6, 7], 4, 4],
	// First element missing:
	[[1, 2, 3, 4, 5, 6, 7], 0, 0],
	// Last element missing:
	[[0, 1, 2, 3, 4, 5, 6], 7, 7]
])("uBin: Num no match", (aEls, aVal, ajIns) => {
	const [oCk, ojIns] = Search.uBin(aEls, aVal);
	expect(oCk).toBe(false);
	expect(ojIns).toBe(ajIns);
});

test.each([
	// First element:
	["AA", 0],
	// Middle element:
	["EE", 4],
	// Last element:
	["HH", 7]
])("uBin: String match", (aVal, ajIns) => {
	const oEls = ["AA", "BB", "CC", "DD", "EE", "FF", "GG", "HH"];
	const [oCk, ojIns] = Search.uBin(oEls, aVal, Search.uCompareStrFast);
	expect(oCk).toBe(true);
	expect(ojIns).toBe(ajIns);
});

test.each([
	// Empty array:
	[[], "A", 0],
	// Odd index missing:
	[["AA", "BB", "CC", "EE", "FF", "GG", "HH"], "DD", 3],
	// Even index missing:
	[["AA", "BB", "CC", "DD", "FF", "GG", "HH"], "EE", 4],
	// First element missing:
	[["BB", "CC", "DD", "EE", "FF", "GG", "HH"], "AA", 0],
	// Last element missing:
	[["AA", "BB", "CC", "DD", "EE", "FF", "GG"], "HH", 7]
])("uBin: String no match", (aEls, aVal, ajIns) => {
	const [oCk, ojIns] = Search.uBin(aEls, aVal, Search.uCompareStrFast);
	expect(oCk).toBe(false);
	expect(ojIns).toBe(ajIns);
});
