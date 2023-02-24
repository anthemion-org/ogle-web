// WorkSearch.js
// -------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

// Shouldn't this be called `WorkBoardCreate`, or something similar? [refactor]

import { tConfigPoolDie } from "../Board/PoolDie.js";
import { tSetup } from "../Round/Setup.js";
import { tBoard } from "../Board/Board.js";
import * as SearchBoard from "./SearchBoard.js";
import { tCard } from "../Round/Card.js";
import { tGenRnd } from "../Util/Rnd.js";

/* Implements a web worker that creates a board meeting the criteria specified
 * in `aMsg`. Responds with a message containing the board and the corresponding
 * Ogle scorecard, or `null` values if no matching board could be created. */
onmessage = function (aMsg) {
	try {
		const oGenRnd = new tGenRnd();
		const oSetup = tSetup.suFromPlain(aMsg.data.Setup);

		const oTextSetup = oSetup.uTextShortYield() + " / " + oSetup.uTextShortPace();
		console.log(`Generating '${oTextSetup}' board...`);

		const oConfigPools = tConfigPoolDie.suFromSetup(oSetup);
		console.log("~ " + oConfigPools.uDesc());

		let oBoard;
		let oCard;
		let oj = 0;
		while (true) {
			oBoard = tBoard.suNewRnd(oGenRnd, oConfigPools);
			const oSels = SearchBoard.uExec(aMsg.data.WordsSearch, oBoard);
			oCard = tCard.suFromSelsBoard(oSels);
			if (oSetup.Yield.uCkContain(oCard.Score)) {
				console.log("Accepting board number " + (oj + 1));
				console.log(`~ ${oCard.Score} words`);
				break;
			}

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
