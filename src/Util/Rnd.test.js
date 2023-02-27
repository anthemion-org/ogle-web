// Rnd.test.js
// ===========
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tGenRnd } from "./Rnd.js";
import * as Search from "./Search.js";

const SeedText = "TEST";

test("tGenRnd: Create with seed", () => {
	const oGen = new tGenRnd(SeedText);
});

test("tGenRnd: Create without seed", () => {
	const oGen = new tGenRnd();
});

test("tGenRnd: Mean", () => {
	const oGen = new tGenRnd(SeedText);

	const oCt = 1000;
	let oAvg = 0;
	for (let o = 0; o < oCt; ++o)
		oAvg += oGen.uFloat();
	oAvg /= oCt;

	// Just guessing on the tolerance here:
	expect(oAvg).toBeCloseTo(0.5, 2);
});

test("tGenRnd: Flatness", () => {
	// We will create many values, sort them, and then check values at certain
	// intervals, expecting that they will be close to their fractional positions
	// within the sorted sequence.
	//
	// Would it be better to calculate the variance?

	const oGen = new tGenRnd(SeedText);

	const oCtVal = 1000;
	const oVals = [];
	for (let oj = 0; oj < oCtVal; ++oj)
		oVals.push(oGen.uFloat());

	oVals.sort(Search.uCompareNum);

	const oCtBin = 10;
	const oCtValBin = oCtVal / oCtBin;
	for (let oj = 0; oj < oCtBin; ++oj) {
		const oVal = oVals[oCtValBin * oj];
		const oValExp = (1.0 / oCtBin) * oj;
		// Just guessing on the tolerance here:
		expect(oVal).toBeCloseTo(oValExp, 1);
	}
});
