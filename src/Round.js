// Round.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tRound } from "../Round.js";
//

import { tSetup } from "./Setup.js";
import { tBoard } from "./Board/Board.js";
import { tLex } from "./Search/Lex.js";
import * as SearchBoard from "./Search/SearchBoard.js";
import { tGenRnd } from "./Util/Rnd.js";

// tRound
// ------

export class tRound {
	constructor(aSetup, aBoard, aSelsOgle, aSelsPlay) {
		this.Setup = aSetup;
		this.Board = aBoard;
		this.SelsOgle = aSelsOgle;
		this.SelsPlay = aSelsPlay;
	}
}
