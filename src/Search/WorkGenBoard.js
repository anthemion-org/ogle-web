// WorkGenBoard.js
// ===============
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tConfigPoolDie } from "../Board/PoolDie.js";
import * as Setup from "../Round/Setup.js";
import * as Board from "../Board/Board.js";
import * as SearchBoard from "./SearchBoard.js";
import * as Card from "../Round/Card.js";
import { tGenRnd } from "../Util/Rnd.js";
import * as Rg from "../Util/Rg.js";

/* Implements a web worker that creates a board meeting the criteria specified
 * in `aMsg`. Responds with a message containing the board and the corresponding
 * Ogle scorecard, or `null` values if no matching board could be created. */
onmessage = function (aMsg) {
	try {
		const oGenRnd = new tGenRnd();
		const oSetup = Setup.uFromParse(aMsg.data.Setup);

		const oTextSetup = Setup.uTextShortYield(oSetup) + " / "
			+ Setup.uTextShortPace(oSetup);
		_Log(2, `Generating '${oTextSetup}' board...`);

		const oConfigPools = tConfigPoolDie.suFromSetup(oSetup);
		_Log(2, "~ " + oConfigPools.uDesc());

		let oBoard;
		let oCard;
		let oj = 0;
		while (true) {
			oBoard = Board.uNewRnd(oGenRnd, oConfigPools);
			const oSels = SearchBoard.uExec(aMsg.data.WordsSearch, oBoard);
			oCard = Card.uFromSelsBoard(oSels);
			if (Rg.uCkContain(oSetup.Yield, oCard.Score)) {
				_Log(2, "Accepting board number " + (oj + 1));
				_Log(2, `~ ${oCard.Score} words`);
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

// Logging
// -------

/** Set to zero to disable logging in this module. */
const _LvlLog = 0;

/** Logs `aText` if `_LvlLog` is `aLvlLogMin` or greater. */
function _Log(aLvlLogMin, aText) {
	if (_LvlLog >= aLvlLogMin) console.log(aText);
}
