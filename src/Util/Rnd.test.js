// Rnd.test.js
// -----------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tGenRnd } from "./Rnd.js";

const SeedText = "TEST";

test("tGenRnd: Create with seed", () => {
	const oGen = new tGenRnd(SeedText);
});

test("tGenRnd: Create without seed", () => {
	const oGen = new tGenRnd();
});

test("tGenRnd: Mean", () => {
	const oqGen = new tGenRnd(SeedText);

	const oCt = 1000;
	let oAvg = 0;
	for (let oj = 0; oj < oCt; ++oj)
		oAvg += oqGen.uVal();
	oAvg /= oCt;

	// Just guessing on the tolerance here:
	expect(oAvg).toBeCloseTo(0.5, 2);
});

test("tGenRnd: Flatness", () => {
	const oqGen = new tGenRnd(SeedText);

	// We will create many values, sort them, and then check values at certain
	// intervals, expecting that the checked values will be close to their
	// positions in the sorted sequence, when expressed as fractions.

	const oCtVal = 1000;
	const oyVals = [];
	for (let oj = 0; oj < oCtVal; ++oj)
		oyVals.push(oqGen.uVal());

	const oCompare = (o0, o1) => (o0 - o1);
	oyVals.sort(oCompare);

	const oCtBin = 10;
	const oCtValBin = oCtVal / oCtBin;
	for (let oj = 0; oj < oCtBin; ++oj) {
		const oVal = oyVals[oCtValBin * oj];
		const oValExp = 1.0 / oCtBin * oj;
		// Just guessing on the tolerance here:
		expect(oVal).toBeCloseTo(oValExp, 1);
	}
});
