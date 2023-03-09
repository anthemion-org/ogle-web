// Board.js
// ========
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Board from "../Board/Board.js";
//

import { tPoolDie } from "./PoolDie.js";
import * as Die from "./Die.js";
import * as Const from "../Const.js";

// Board
// -----
// Each Board record represents a single game board.

/** Creates a Board record from the specified Die record array. */
export function uNew(aDice) {
	const oBoard = {
		/** An array of Die records, arranged row-after-row. */
		_Dice: aDice
	};
	Object.freeze(oBoard);
	return oBoard;
}

/** Creates a Board record from an object produced by `JSON.parse`, and returns
 *  it, or returns `null` if `aParse` is falsy. */
export function uFromParse(aParse) {
	if (!aParse) return null;

	const oDice = aParse._Dice.map(a => Die.uFromParse(a));
	return uNew(oDice);
}

/** Returns a new, random board, with dice produced by the specified
 *  `tConfigPoolDie` instance. */
export function uNewRnd(aGenRnd, aConfigPoolDie) {
	if (!aConfigPoolDie)
		throw Error("Board.uNewRnd: Pool configuration not provided");

	const oDice = [];
	const oPool = new tPoolDie(aGenRnd, aConfigPoolDie);
	for (let o = 0; o < Const.CtDie; ++o)
		oDice.push(oPool.uDraw())
	return uNew(oDice);
}

/** Returns the die at the specified Pt2 position within a Die, throwing if
 *  either coordinate is out of range. */
export function uDie(aBoard, aPos) {
	const oj = aPos.X + (aPos.Y * Const.WthBoard);
	if ((oj < 0) || (oj >= Const.CtDie))
		throw Error("Board uDie: Invalid position");
	return aBoard._Dice[oj];
}
