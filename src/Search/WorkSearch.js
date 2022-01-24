// WorkText.js
// -----------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tRound } from "../Round.js";
//

import { tSetup } from "../Setup.js";
import { tBoard } from "../Board/Board.js";
import * as SearchBoard from "./SearchBoard.js";
import { tGenRnd } from "../Util/Rnd.js";

onmessage = function (aMsg) {
	const oGenRnd = new tGenRnd();
	const oSetup = tSetup.suFromPOD(aMsg.data.Setup);

	let oBoard;
	let oSelsOgle;
	while (true) {
		oBoard = tBoard.suFromRnd(oGenRnd);
		oSelsOgle = SearchBoard.uExec(aMsg.data.WordsSearch, oBoard);
		if (oSetup.Yield.uCkContain(oSelsOgle.length)) break;
	}

	postMessage({
		Board: oBoard,
		SelsOgle: oSelsOgle
	});
};
