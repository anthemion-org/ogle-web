// Die.js
// ------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import tDie from "./Die.js";
import * as Dir4 from "../Util/Dir4.js";

test("Create tDie: Underlined", () => {
	const oText = "T";
	const oDir = Dir4.Vals.E;
	const oqDie = new tDie(oText, oDir);

	expect(oqDie.Text).toBe(oText);
	expect(oqDie.Dir4).toBe(oDir);
	expect(oqDie.CkUnder).toBe(true);
});

test("Create tDie: Not underlined", () => {
	const oText = "O";
	const oDir = Dir4.Vals.E;
	const oqDie = new tDie(oText, oDir);

	expect(oqDie.Text).toBe(oText);
	expect(oqDie.Dir4).toBe(oDir);
	expect(oqDie.CkUnder).toBe(false);
});
