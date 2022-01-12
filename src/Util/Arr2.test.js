// Arr2.test.js
// ------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tArr2 } from "./Arr2.js";
import { tPt2 } from "./Pt2.js";

test("tArr2: Create undefined", () => {
	const oqSize = new tPt2(4, 3);
	const oqArr = new tArr2(oqSize);

	for (let oY = 0; oY < oqSize.Y; ++oY)
		for (let oX = 0; oX < oqSize.X; ++oX) {
			const oqPos = new tPt2(oX, oY);
			expect(oqArr.uGet(oqPos)).toBeUndefined();
		}
});

test("tArr2: Create with Def", () => {
	const oqSize = new tPt2(4, 3);
	const oqArr = new tArr2(oqSize, { Def: 10 });

	for (let oY = 0; oY < oqSize.Y; ++oY)
		for (let oX = 0; oX < oqSize.X; ++oX) {
			const oqPos = new tPt2(oX, oY);
			expect(oqArr.uGet(oqPos)).toBe(10);
		}
});

test("tArr2: Clone", () => {
	const oqSize = new tPt2(4, 3);
	const oqArrSrc = new tArr2(oqSize);
	for (let oY = 0; oY < oqSize.Y; ++oY)
		for (let oX = 0; oX < oqSize.X; ++oX) {
			const oqPos = new tPt2(oX, oY);
			const oVal = (oY * oqSize.X) + oX;
			oqArrSrc.uSet(oqPos, oVal);
		}

	const oqArrDest = oqArrSrc.uClone();
	for (let oY = 0; oY < oqSize.Y; ++oY)
		for (let oX = 0; oX < oqSize.X; ++oX) {
			const oqPos = new tPt2(oX, oY);
			expect(oqArrDest.uGet(oqPos)).toBe(oqArrSrc.uGet(oqPos));
		}
});
