// Arr2.test.js
// ============
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tArr2 } from "./Arr2.js";
import * as Pt2 from "./Pt2.js";

test("tArr2: Create undefined", () => {
	const oSize = Pt2.uNew(4, 3);
	const oArr = new tArr2(oSize);

	for (let oY = 0; oY < oSize.Y; ++oY)
		for (let oX = 0; oX < oSize.X; ++oX) {
			const oPos = Pt2.uNew(oX, oY);
			expect(oArr.uGet(oPos)).toBeUndefined();
		}
});

test("tArr2: Create with Def", () => {
	const oSize = Pt2.uNew(4, 3);
	const oArr = new tArr2(oSize, { Def: 10 });

	for (let oY = 0; oY < oSize.Y; ++oY)
		for (let oX = 0; oX < oSize.X; ++oX) {
			const oPos = Pt2.uNew(oX, oY);
			expect(oArr.uGet(oPos)).toBe(10);
		}
});

test("tArr2: Copy", () => {
	const oSize = Pt2.uNew(4, 3);
	const oArrSrc = new tArr2(oSize);
	for (let oY = 0; oY < oSize.Y; ++oY)
		for (let oX = 0; oX < oSize.X; ++oX) {
			const oPos = Pt2.uNew(oX, oY);
			const oVal = (oY * oSize.X) + oX;
			oArrSrc.uSet(oPos, oVal);
		}

	const oArrDest = oArrSrc.uCopy();
	for (let oY = 0; oY < oSize.Y; ++oY)
		for (let oX = 0; oX < oSize.X; ++oX) {
			const oPos = Pt2.uNew(oX, oY);
			expect(oArrDest.uGet(oPos)).toBe(oArrSrc.uGet(oPos));
		}
});
