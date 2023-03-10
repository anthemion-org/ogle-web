// Yield.test.js
// =============
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org

import * as Yield from "./Yield.js";
import * as Rg from "../Util/Rg.js";

test("Yield: uDef", () => {
	const oAct = Yield.uDef();
	const oExpect = Rg.uNew(180, Infinity);
	// If this fails, it is probably because the Yield `Vals` array was changed
	// without a corresponding change to `jValDef`:
	expect(oAct).toEqual(oExpect);
});
