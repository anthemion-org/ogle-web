// Board.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tBoard } from "../Board.js";
//

import { tPool } from "./Pool.js";
import * as Cfg from "../Cfg.js";

// Generates and stores a single game board.
export class tBoard {
	// Creates a random board.
	constructor() {
		// An array of column arrays, which themselves contain tDie instances.
		this.yDice = [];

		const oqPool = new tPool();
		for (let oX = 0; oX < Cfg.WthBoard; ++oX) {
			const oyCol = [];
			for (let oY = 0; oY < Cfg.HgtBoard; ++oY)
				oyCol.push(oqPool.uDie())
			this.yDice.push(oyCol);
		}
	}

	// Returns the die at the specified position, throwing if either coordinate is
	// out of range.
	uDie(aX, aY) {
		if ((aX < 0) || (aX >= Cfg.WthBoard))
			throw new Error("tBoard.uDie: Invalid X position");
		if ((aY < 0) || (aY >= Cfg.HgtBoard))
			throw new Error("tBoard.uDie: Invalid Y position");
		return this.yDice[aX][aY];
	}
}
