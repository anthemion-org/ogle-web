// Yield.test.js
// -------------
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org

import * as Yield from "./Yield.js";
import { tRg } from "../Util/Rg.js";

test("Yield: uDef", () => {
	const oAct = Yield.uDef();
	const oExpect = [new tRg(180, Infinity)];
	expect(oAct).toEqual(oExpect);
});
