// Rect.test.js
// ------------
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
])("tRect.uCkContain", (aqPos, aCk) => {
	const oqLeftBtm = new tPt2(1, 1);
	const oqSize = new tPt2(3, 3);
	const oqRect = new tRect(oqLeftBtm, oqSize);
	expect(oqRect.uCkContain(aqPos)).toBe(aCk);
});

test("tRect.uPosi", () => {
	const oqLeftBtm = new tPt2(1, 1);
	const oqSize = new tPt2(3, 4);
	const oqRect = new tRect(oqLeftBtm, oqSize);
	const oyPosi = [ ...oqRect.uPosi() ];

	const oyPosiExp = [];
	for (let oY = 1; oY < 5; ++oY)
		for (let oX = 1; oX < 4; ++oX)
			oyPosiExp.push(new tPt2(oX, oY));

	expect(oyPosi).toEqual(oyPosiExp);
});
