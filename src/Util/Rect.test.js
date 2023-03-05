// Rect.test.js
// ============
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import * as Rect from "./Rect.js";
import * as Pt2 from "./Pt2.js";

test.each([
	[ Pt2.uNew(0, 0), false ],
	[ Pt2.uNew(2, 0), false ],
	[ Pt2.uNew(1, 1), true ],
	[ Pt2.uNew(2, 2), true ],
	[ Pt2.uNew(3, 1), true ],
	[ Pt2.uNew(1, 3), true ],
	[ Pt2.uNew(3, 3), true ],
	[ Pt2.uNew(3, 4), false ],
	[ Pt2.uNew(4, 3), false ],
	[ Pt2.uNew(4, 4), false ]
])("Rect uCkContain", (aPos, aCk) => {
	const oLeftTop = Pt2.uNew(1, 1);
	const oSize = Pt2.uNew(3, 3);
	const oRect = Rect.uNew(oLeftTop, oSize);
	expect(Rect.uCkContain(oRect, aPos)).toBe(aCk);
});

test("Rect uPosi", () => {
	const oLeftTop = Pt2.uNew(1, 1);
	const oSize = Pt2.uNew(3, 4);
	const oRect = Rect.uNew(oLeftTop, oSize);
	const oPosi = [ ...Rect.uPosi(oRect) ];

	const oPosiExp = [];
	for (let oY = 1; oY < 5; ++oY)
		for (let oX = 1; oX < 4; ++oX)
			oPosiExp.push(Pt2.uNew(oX, oY));

	expect(oPosi).toEqual(oPosiExp);
});
