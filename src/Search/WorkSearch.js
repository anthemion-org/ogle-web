// WorkSearch.js
// -------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tSetup } from "../Round/Setup.js";
import { tBoard } from "../Board/Board.js";
import * as SearchBoard from "./SearchBoard.js";
import { tCard } from "../Round/Card.js";
import { tGenRnd } from "../Util/Rnd.js";

onmessage = function (aMsg) {
	const oGenRnd = new tGenRnd();
	const oSetup = tSetup.suFromPOD(aMsg.data.Setup);

	let oBoard;
	let oCard;
	let oj = 0;
	while (true) {
		oBoard = tBoard.suFromRnd(oGenRnd);
		const oSels = SearchBoard.uExec(aMsg.data.WordsSearch, oBoard);
		oCard = tCard.suFromSelsBoard(oSels);
		if (oSetup.Yield.uCkContain(oCard.Score)) break;

		if (++oj >= 200)
			throw Error("WorkSearch onmessage: Cannot create board");
	}

	postMessage({
		Board: oBoard,
		CardOgle: oCard
	});
};
