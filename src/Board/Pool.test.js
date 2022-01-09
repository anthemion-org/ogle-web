// Pool.test.js
// ------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tPool, ForTest } from "./Pool.js";
import { tGenRnd } from "../Util/Rnd.js";

const SeedText = "OGLE";

// tPool
// -----

test("tPool: Draw all", () => {
	const oqGenRnd = new tGenRnd(SeedText);
	const oqPool = new tPool(oqGenRnd);

	for (let oj = 0; oj < 25; ++oj)
		oqPool.uDie();
});

test("tPool: Draw too many", () => {
	const oqGenRnd = new tGenRnd(SeedText);
	const oqPool = new tPool(oqGenRnd);

	for (let oj = 0; oj < 25; ++oj)
		oqPool.uDie();
	expect(() => oqPool.uDie()).toThrow();
});

// tPoolSub
// --------

test("tPoolSub: Draw all", () => {
	const oqGenRnd = new tGenRnd(SeedText);
	const oqTexts = {
		A: 3,
		B: 2,
		C: 1
	};
	const oqPoolSub = new ForTest.tPoolSub(oqGenRnd, oqTexts);

	expect(oqPoolSub.Ct).toBe(6);
	for (let oj = 0; oj < 6; ++oj)
		oqPoolSub.uDraw();
	expect(oqPoolSub.Ct).toBe(0);
});

test("tPoolSub: Draw too many", () => {
	const oqGenRnd = new tGenRnd(SeedText);
	const oqTexts = {
		A: 1,
		B: 1
	};
	const oqPoolSub = new ForTest.tPoolSub(oqGenRnd, oqTexts);

	oqPoolSub.uDraw();
	oqPoolSub.uDraw();
	expect(() => oqPoolSub.uDraw()).toThrow();
});
