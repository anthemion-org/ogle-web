// Round.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tRound } from "./Round/Round.js";
//

// tRound
// ------
// What is this for? Surely we won't store selections from past games? Only
// high-scoring games will be stored, but still.

export class tRound {
	constructor(aSetup, aBoard, aEntsOgle, aEntsPlay) {
		this.Setup = aSetup;
		this.Board = aBoard;
		this.EntsOgle = aEntsOgle;
		this.EntsPlay = aEntsPlay;
	}
}
