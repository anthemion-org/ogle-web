// WorkSearch.js
// -------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tSetup } from "../Round/Setup.js";
import { tBoard } from "../Board/Board.js";
import * as SearchBoard from "./SearchBoard.js";
import { tCard } from "../Round/Card.js";
import { tGenRnd } from "../Util/Rnd.js";

/* Implements a service worker that creates one board meeting the criteria
 * specified by the Setup object within the message. Posts a message containing
 * the board and the corresponding Ogle score card, or 'null' values if no
 * matching board could be created. */
onmessage = function (aMsg) {
	try {
		const oGenRnd = new tGenRnd();
		const oSetup = tSetup.suFromPOD(aMsg.data.Setup);

		let oBoard;
		let oCard;
		let oj = 0;
		while (true) {
			oBoard = tBoard.suNewRnd(oGenRnd);
			const oSels = SearchBoard.uExec(aMsg.data.WordsSearch, oBoard);
			oCard = tCard.suFromSelsBoard(oSels);
			if (oSetup.Yield.uCkContain(oCard.Score)) break;

			if (++oj >= 2000)
				throw Error("WorkSearch onmessage: Cannot create board");
		}

		postMessage({ Board: oBoard, CardOgle: oCard });
	}
	catch (oErr) {
		console.log(oErr.message);
		postMessage({ Board: null, CardOgle: null });
	}
};
