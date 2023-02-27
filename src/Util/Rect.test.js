// Rect.test.js
// ============
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tRect } from "./Rect.js";
import { tPt2 } from "./Pt2.js";

test.each([
	[ new tPt2(0, 0), false ],
	[ new tPt2(2, 0), false ],
	[ new tPt2(1, 1), true ],
	[ new tPt2(2, 2), true ],
	[ new tPt2(3, 1), true ],
	[ new tPt2(1, 3), true ],
	[ new tPt2(3, 3), true ],
	[ new tPt2(3, 4), false ],
	[ new tPt2(4, 3), false ],
	[ new tPt2(4, 4), false ]
])("tRect.uCkContain", (aPos, aCk) => {
	const oLeftTop = new tPt2(1, 1);
	const oSize = new tPt2(3, 3);
	const oRect = new tRect(oLeftTop, oSize);
	expect(oRect.uCkContain(aPos)).toBe(aCk);
});

test("tRect.uPosi", () => {
	const oLeftTop = new tPt2(1, 1);
	const oSize = new tPt2(3, 4);
	const oRect = new tRect(oLeftTop, oSize);
	const oPosi = [ ...oRect.uPosi() ];

	const oPosiExp = [];
	for (let oY = 1; oY < 5; ++oY)
		for (let oX = 1; oX < 4; ++oX)
			oPosiExp.push(new tPt2(oX, oY));

	expect(oPosi).toEqual(oPosiExp);
});
