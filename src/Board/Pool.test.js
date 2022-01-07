// Pool.test.js
// ------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { ForTest } from "./Pool.js";

test("tPoolSub: Draw all", () => {
	const oqTexts = {
		A: 3,
		B: 2,
		C: 1
	};
	const oqPoolSub = new ForTest.tPoolSub(oqTexts);

	expect(oqPoolSub.Ct).toBe(6);
	for (let oj = 0; oj < 6; ++oj)
		oqPoolSub.uDraw();
	expect(oqPoolSub.Ct).toBe(0);
});

test("tPoolSub: Draw too many", () => {
	const oqTexts = {
		A: 1,
		B: 1
	};
	const oqPoolSub = new ForTest.tPoolSub(oqTexts);

	oqPoolSub.uDraw();
	oqPoolSub.uDraw();
	expect(() => oqPoolSub.uDraw()).toThrow();
});
