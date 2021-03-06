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
