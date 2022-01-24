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
import { tDie } from "./Die.js";
import * as Cfg from "../Cfg.js";

/** Generates and stores a single game board. */
export class tBoard {
	/** Creates an instance from the specified POD and returns it. */
	static suFromPOD(aPOD) {
		if (!aPOD) return null;

		const oDice = aPOD.Dice.map(o => tDie.suFromPOD(o));
		return new tBoard(oDice);
	}

	/** Creates and returns a random board. */
	static suFromRnd(aGenRnd) {
		const oDice = [];
		const oPool = new tPoolDie(aGenRnd);
		for (let o = 0; o < Cfg.CtDie; ++o)
			oDice.push(oPool.uDraw())
		return new tBoard(oDice);
	}

	constructor(aDice) {
		/** An array of column arrays, which themselves contain tDie instances. */
		this.Dice = aDice;
	}

	/** Returns the die at the specified tPt2 position, throwing if either
	 *  coordinate is out of range. */
	uDie(aPos) {
		const oj = aPos.X + (aPos.Y * Cfg.WthBoard);
		if ((oj < 0) || (oj >= Cfg.CtDie))
			throw Error("tBoard.uDie: Invalid position");
		return this.Dice[oj];
	}
}
