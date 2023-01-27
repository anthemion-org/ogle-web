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
import * as Const from "../Const.js";

/** Represents a single game board. */
export class tBoard {
	/** Creates an instance from a plain object and returns it. This class is
	 *  immutable. */
	static suFromPlain(aPlain) {
		if (!aPlain) return null;

		const oDice = aPlain._Dice.map(a => tDie.suFromPlain(a));
		return new tBoard(oDice);
	}

	/** Returns a new, random board. */
	static suNewRnd(aGenRnd) {
		const oDice = [];
		const oPool = new tPoolDie(aGenRnd);
		for (let o = 0; o < Const.CtDie; ++o)
			oDice.push(oPool.uDraw())
		return new tBoard(oDice);
	}

	constructor(aDice) {
		/** An array of column arrays, which themselves contain tDie instances. */
		this._Dice = aDice;

		Object.freeze(this);
	}

	/** Returns the die at the specified tPt2 position, throwing if either
	 *  coordinate is out of range. */
	uDie(aPos) {
		const oj = aPos.X + (aPos.Y * Const.WthBoard);
		if ((oj < 0) || (oj >= Const.CtDie))
			throw Error("tBoard.uDie: Invalid position");
		return this._Dice[oj];
	}
}
