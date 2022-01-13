// Board.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tBoard } from "../Board.js";
//

import { tPoolDie } from "./PoolDie.js";
import * as Cfg from "../Cfg.js";

/** Generates and stores a single game board. */
export class tBoard {
	/** Creates a random board. */
	constructor() {
		/** An array of column arrays, which themselves contain tDie instances. */
		this.yDice = [];

		const oqPool = new tPoolDie();
		for (let oX = 0; oX < Cfg.WthBoard; ++oX) {
			const oyCol = [];
			for (let oY = 0; oY < Cfg.HgtBoard; ++oY)
				oyCol.push(oqPool.uDraw())
			this.yDice.push(oyCol);
		}
	}

	/** Returns the die at the specified tPt2 position, throwing if either
	 *  coordinate is out of range. */
	uDie(aPos) {
		if ((aPos.X < 0) || (aPos.X >= Cfg.WthBoard))
			throw Error("tBoard.uDie: Invalid X position");
		if ((aPos.Y < 0) || (aPos.Y >= Cfg.HgtBoard))
			throw Error("tBoard.uDie: Invalid Y position");
		return this.yDice[aPos.X][aPos.Y];
	}
}
