// SearchBoard.test.js
// ---------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tSearchBoard } from "./SearchBoard.js";
import { tBoard } from "../Board/Board.js";
import { tLex } from "./Lex.js";
import { tGenRnd } from "../Util/Rnd.js";

test("SearchBoard uExec", () => {
	const oSeedText = "OGLE";
	const oqGenRnd = new tGenRnd(oSeedText);
	const oqBoard = new tBoard(oqGenRnd);
	const oqLex = new tLex;
	const oqSearch = new tSearchBoard(oqBoard, oqLex);
	oqSearch.uExec();
	const oySelsWord = oqSearch.ySelsWord;
});
