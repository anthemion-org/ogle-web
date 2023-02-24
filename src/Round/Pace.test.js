// Pace.test.js
// ------------
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org

import * as Pace from "./Pace.js";

test("Pace: uDef", () => {
	const oAct = Pace.uDef();
	const oExpect = [30, 5];
	expect(oAct).toEqual(oExpect);
});
