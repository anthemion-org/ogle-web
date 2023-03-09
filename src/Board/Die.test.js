// Die.js
// ======
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import * as Die from "./Die.js";
import * as Dir4 from "../Util/Dir4.js";

test("Create Die: Underlined", () => {
	const oText = "T";
	const oDir = Dir4.Vals.E;
	const oDie = Die.uNew(oText, oDir);

	expect(oDie.Text).toBe(oText);
	expect(oDie.Dir4).toBe(oDir);
	expect(oDie.CkUnder).toBe(true);
});

test("Create Die: Not underlined", () => {
	const oText = "O";
	const oDir = Dir4.Vals.E;
	const oDie = Die.uNew(oText, oDir);

	expect(oDie.Text).toBe(oText);
	expect(oDie.Dir4).toBe(oDir);
	expect(oDie.CkUnder).toBe(false);
});
