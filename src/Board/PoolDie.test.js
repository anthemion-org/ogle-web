// PoolDie.test.js
// ---------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tPoolDie, ForTest } from "./PoolDie.js";
import { tGenRnd } from "../Util/Rnd.js";

const SeedText = "OGLE";

// tPoolDie
// --------

test("tPoolDie: Draw all", () => {
	const oqGenRnd = new tGenRnd(SeedText);
	const oqPoolDie = new tPoolDie(oqGenRnd);

	for (let oj = 0; oj < 25; ++oj)
		oqPoolDie.uDraw();
});

test("tPoolDie: Draw too many", () => {
	const oqGenRnd = new tGenRnd(SeedText);
	const oqPoolDie = new tPoolDie(oqGenRnd);

	for (let oj = 0; oj < 25; ++oj)
		oqPoolDie.uDraw();
	expect(() => oqPoolDie.uDraw()).toThrow();
});

// tPoolText
// ---------

test("tPoolText: Draw all", () => {
	const oqGenRnd = new tGenRnd(SeedText);
	const oqTexts = {
		A: 3,
		B: 2,
		C: 1
	};
	const oqPoolText = new ForTest.tPoolText(oqGenRnd, oqTexts);

	expect(oqPoolText.Ct).toBe(6);
	for (let oj = 0; oj < 6; ++oj)
		oqPoolText.uDraw();
	expect(oqPoolText.Ct).toBe(0);
});

test("tPoolText: Draw too many", () => {
	const oqGenRnd = new tGenRnd(SeedText);
	const oqTexts = {
		A: 1,
		B: 1
	};
	const oqPoolText = new ForTest.tPoolText(oqGenRnd, oqTexts);

	oqPoolText.uDraw();
	oqPoolText.uDraw();
	expect(() => oqPoolText.uDraw()).toThrow();
});
