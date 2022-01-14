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
	const oGenRnd = new tGenRnd(SeedText);
	const oPoolDie = new tPoolDie(oGenRnd);

	for (let oj = 0; oj < 25; ++oj)
		oPoolDie.uDraw();
});

test("tPoolDie: Draw too many", () => {
	const oGenRnd = new tGenRnd(SeedText);
	const oPoolDie = new tPoolDie(oGenRnd);

	for (let oj = 0; oj < 25; ++oj)
		oPoolDie.uDraw();
	expect(() => oPoolDie.uDraw()).toThrow();
});

// tPoolText
// ---------

test("tPoolText: Draw all", () => {
	const oGenRnd = new tGenRnd(SeedText);
	const oTexts = {
		A: 3,
		B: 2,
		C: 1
	};
	const oPoolText = new ForTest.tPoolText(oGenRnd, oTexts);

	expect(oPoolText.Ct).toBe(6);
	for (let oj = 0; oj < 6; ++oj)
		oPoolText.uDraw();
	expect(oPoolText.Ct).toBe(0);
});

test("tPoolText: Draw too many", () => {
	const oGenRnd = new tGenRnd(SeedText);
	const oTexts = {
		A: 1,
		B: 1
	};
	const oPoolText = new ForTest.tPoolText(oGenRnd, oTexts);

	oPoolText.uDraw();
	oPoolText.uDraw();
	expect(() => oPoolText.uDraw()).toThrow();
});
