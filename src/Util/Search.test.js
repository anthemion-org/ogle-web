// Search.test.js
// --------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import * as Search from "../Util/Search.js";

test.each([
	[ 0, 0 ],
	[ 5, 5 ],
	[ 7, 7 ]
])("uBin: Num match", (aVal, ajIns) => {
	const oyEls = [ 0, 1, 2, 3, 4, 5, 6, 7 ];
	const [ oCk, ojIns ] = Search.uBin(oyEls, aVal);
	expect(oCk).toBe(true);
	expect(ojIns).toBe(ajIns);
});

test.each([
	[ [], 1, 0 ],
	[ [ 0, 1, 2, 4, 5, 6, 7 ], 3, 3 ],
	[ [ 0, 1, 2, 3, 5, 6, 7 ], 4, 4 ],
	[ [ 0, 1, 2, 3, 4, 6, 7 ], 5, 5 ],
	[ [ 1, 2, 3, 4, 5, 6, 7 ], 0, 0 ],
	[ [ 0, 1, 2, 3, 5, 6, 7 ], 4, 4 ],
	[ [ 0, 1, 2, 3, 4, 5, 6 ], 7, 7 ]
])("uBin: Num no match", (ayEls, aVal, ajIns) => {
	const [ oCk, ojIns ] = Search.uBin(ayEls, aVal);
	expect(oCk).toBe(false);
	expect(ojIns).toBe(ajIns);
});

test.each([
	[ "AA", 0 ],
	[ "EE", 4 ],
	[ "HH", 7 ]
])("uBin: String match", (aVal, ajIns) => {
	const oyEls = [ "AA", "BB", "CC", "DD", "EE", "FF", "GG", "HH" ];
	const [ oCk, ojIns ] = Search.uBin(oyEls, aVal, Search.uCompareStr);
	expect(oCk).toBe(true);
	expect(ojIns).toBe(ajIns);
});

test.each([
	[ [], "A", 0 ],
	[ [ "AA", "BB", "CC", "EE", "FF", "GG", "HH" ], "DD", 3 ],
	[ [ "AA", "BB", "CC", "DD", "FF", "GG", "HH" ], "EE", 4 ],
	[ [ "AA", "BB", "CC", "DD", "EE", "GG", "HH" ], "FF", 5 ],
	[ [ "BB", "CC", "DD", "EE", "FF", "GG", "HH" ], "AA", 0 ],
	[ [ "AA", "BB", "CC", "DD", "FF", "GG", "HH" ], "EE", 4 ],
	[ [ "AA", "BB", "CC", "DD", "EE", "FF", "GG" ], "HH", 7 ]
])("uBin: String no match", (ayEls, aVal, ajIns) => {
	const [ oCk, ojIns ] = Search.uBin(ayEls, aVal, Search.uCompareStr);
	expect(oCk).toBe(false);
	expect(ojIns).toBe(ajIns);
});
