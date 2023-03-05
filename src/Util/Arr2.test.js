// Arr2.test.js
// ============
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import * as Arr2 from "./Arr2.js";
import * as Pt2 from "./Pt2.js";

test("Arr2: Create undefined", () => {
	const oSize = Pt2.uNew(4, 3);
	const oArr = Arr2.uNew(oSize);

	for (let oY = 0; oY < oSize.Y; ++oY)
		for (let oX = 0; oX < oSize.X; ++oX) {
			const oPos = Pt2.uNew(oX, oY);
			expect(Arr2.uGet(oArr, oPos)).toBeUndefined();
		}
});

test("Arr2: Create with Def", () => {
	const oSize = Pt2.uNew(4, 3);
	const oArr = Arr2.uNew(oSize, { Def: 10 });

	for (let oY = 0; oY < oSize.Y; ++oY)
		for (let oX = 0; oX < oSize.X; ++oX) {
			const oPos = Pt2.uNew(oX, oY);
			expect(Arr2.uGet(oArr, oPos)).toBe(10);
		}
});

test("Arr2: Copy", () => {
	const oSize = Pt2.uNew(4, 3);
	const oArrSrc = Arr2.uNew(oSize);
	for (let oY = 0; oY < oSize.Y; ++oY)
		for (let oX = 0; oX < oSize.X; ++oX) {
			const oPos = Pt2.uNew(oX, oY);
			const oVal = (oY * oSize.X) + oX;
			Arr2.uSet(oArrSrc, oPos, oVal);
		}

	const oArrDest = Arr2.uCopy(oArrSrc);
	for (let oY = 0; oY < oSize.Y; ++oY)
		for (let oX = 0; oX < oSize.X; ++oX) {
			const oPos = Pt2.uNew(oX, oY);
			expect(Arr2.uGet(oArrDest, oPos)).toBe(Arr2.uGet(oArrSrc, oPos));
		}
});
