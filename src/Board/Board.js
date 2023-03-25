// Board.js
// ========
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Board from "../Board/Board.js";
//

import { tConfigPoolDie, tPoolDie } from "./PoolDie.js";
import * as Die from "./Die.js";
import { tGenRnd } from "../Util/Rnd.js";
import * as Misc from "../Util/Misc.js";
import * as Const from "../Const.js";

// Board
// -----
// Each Board stereotype represents a single game board. This stereotype is
// immutable.

/** Creates a Board stereotype from the specified Die stereotype array. */
export function uNew(aDice) {
	Misc.uCkThrow_Params({ aDice }, Array, "Board uNew");

	const oBoard = {
		/** An array of Die stereotypes, arranged row-after-row. */
		_Dice: aDice
	};
	Object.freeze(oBoard);
	return oBoard;
}

/** Creates a Board stereotype from an object produced by `JSON.parse`, and
 *  returns it, or returns `null` if `aParse` is falsy. */
export function uFromParse(aParse) {
	if (!aParse) return null;
	Misc.uCkThrow_Params({ aParse }, Object, "Board uFromParse");

	const oDice = aParse._Dice.map(a => Die.uFromParse(a));
	return uNew(oDice);
}

/** Returns a new, random Board stereotype, with dice produced by the specified
 *  `tConfigPoolDie` instance. */
export function uNewRnd(aGenRnd, aConfigPoolDie) {
	Misc.uCkThrow_Params({ aGenRnd }, tGenRnd, "Board uNewRnd");
	Misc.uCkThrow_Params({ aConfigPoolDie }, tConfigPoolDie, "Board uNewRnd");

	const oDice = [];
	const oPool = new tPoolDie(aGenRnd, aConfigPoolDie);
	for (let o = 0; o < Const.CtDie; ++o)
		oDice.push(oPool.uDraw())
	return uNew(oDice);
}

/** Returns the die at the specified Pt2 position within a Board stereotype,
 *  throwing if either coordinate is out of range. */
export function uDie(aBoard, aPos) {
	// For performance reasons, we must not `uCkThrow_Params` here!

	const oj = aPos.X + (aPos.Y * Const.WthBoard);
	if ((oj < 0) || (oj >= Const.CtDie))
		throw Error("Board uDie: Invalid position");
	return aBoard._Dice[oj];
}
