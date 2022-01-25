// WorkSearch.js
// -------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tSetup } from "../Round/Setup.js";
import { tBoard } from "../Board/Board.js";
import * as SearchBoard from "./SearchBoard.js";
import { tGenRnd } from "../Util/Rnd.js";

onmessage = function (aMsg) {
	const oGenRnd = new tGenRnd();
	const oSetup = tSetup.suFromPOD(aMsg.data.Setup);

	let oBoard;
	let oEntsOgle;
	// Shall we limit this, just in case?: [to do]
	while (true) {
		oBoard = tBoard.suFromRnd(oGenRnd);
		const oSelsOgle = SearchBoard.uExec(aMsg.data.WordsSearch, oBoard);
		if (oSetup.Yield.uCkContain(oSelsOgle.length)) {
			// Sort and trim these: [to do]
			oEntsOgle = oSelsOgle.map(o => o.uEntWord());
			break;
		}
	}

	postMessage({
		Board: oBoard,
		EntsOgle: oEntsOgle
	});
};
