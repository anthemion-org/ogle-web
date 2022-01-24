// WorkText.js
// -----------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tRound } from "../Round.js";
//

import { tBoard } from "../Board/Board.js";
import * as SearchBoard from "./SearchBoard.js";
import { tGenRnd } from "../Util/Rnd.js";

onmessage = function (aMsg) {
	const oGenRnd = new tGenRnd();

	let oBoard;
	let oSelsOgle;
	while (true) {
		oBoard = new tBoard(oGenRnd);
		oSelsOgle = SearchBoard.uExec(aMsg.data.WordsSearch, oBoard);
		if (aMsg.data.Setup.Yield.uCkContain(oSelsOgle.length)) break;
	}

	postMessage({
		Board: oBoard,
		SelsOgle: oSelsOgle
	});
};
