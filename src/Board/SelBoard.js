// SelBoard.js
// -----------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tSelBoard } from "./SelBoard.js";
//

import { tPt2 } from "../Util/Pt2.js";
import { tArr2 } from "../Util/Arr2.js";
import * as Cfg from "../Cfg.js";

// tSelBoard
// ---------
// Can this class be used for user selections as well? [design]

/** Represents a single board selection, for use when enumerating board content
 *  during the Ogle word search. Each instance stores a single die selection,
 *  which adds one or two letters to the selected text. The instance also
 *  references an optional predecessor instance. Together, the last instance and
 *  its predecessors give the entire selection.
 *
 *  By creating a top-level instance for a given board position, and then
 *  recursively invoking uNext on that instance, plus every instance returned by
 *  uNext, all die sequences beginning with the first position can be
 *  enumerated.*/
export class tSelBoard {
	/** Set aSelPrev to the instance that should precede this instance in the
	 *  selection, or leave it undefined to start a new selection. */
	constructor(aBoard, aPos, aSelPrev) {
		/* The board that contains the selection. */
		this.Board = aBoard;
		/* The board position selected by this instance. */
		this.Pos = aPos;
		/** The selection instance that precedes this one, or 'null' if this
		 *  instance is the first. */
		this.SelPrev = aSelPrev ?? null;

		let oCksAllPrev = aSelPrev
			? aSelPrev.CksAll.uClone()
			: new tArr2(Cfg.SizeBoard, { Def: false });
		/** A tArr2 array of booleans that mark the board positions selected by this
		 *  instance and its predecessors: */
		this.CksAll = oCksAllPrev;
		this.CksAll.uSet(aPos, true);

		let oPosiAllPrev = aSelPrev ? Array.from(aSelPrev.PosiAll) : [];
		/** An array containing the tPt2 positions selected by this instance and its
		 *  predecessors, in order of selection. */
		this.PosiAll = oPosiAllPrev;
		this.PosiAll.push(aPos);

		const oDiePos = aBoard.uDie(aPos);
		const oTextPos = oDiePos.Text.toLowerCase();
		/** The text selected by this instance and its predecessors, in lowercase.
		 *  Recall that the 'Qu' die counts as two letters, not one. */
		this.TextAll = aSelPrev ? (aSelPrev.TextAll + oTextPos) : oTextPos;

		/** The index of the selection neighbor that should follow this one. This
		 *  index will increment as uNext is called. */
		this.jNeigh = 0;
	}

	/** Returns 'true' if the specified board position is part of this selection. */
	uCkPos(aPos) {
		let oSel = this;
		while (oSel) {
			if (oSel.Pos.uCkEq(aPos)) return true;
			oSel = oSel.SelPrev;
		}
		return false;
	}

	/** Creates and returns a new instance selecting a board position that is:
	 *
	 *  ~ Adjacent to the one selected by this instance;
	 *
	 *  ~ Not already selected by this sequence; and,
	 *
	 *  ~ Not previously returned by this instance.
	 *
	 *  Returns 'null' if no such position exists. */
	uNext() {
		const oPosNext = uPosNext(this, this.jNeigh++);
		return oPosNext ? new tSelBoard(this.Board, oPosNext, this) : null;
	}
}

/** Returns the first available adjacent position after skipping ajNeighNext
 *  valid choices, starting with the position on the right, and proceding
 *  counter-clockwise. Returns 'null' if no such position exists. */
function uPosNext(aSel, ajNeigh) {
	// The 'next' index ranges from zero to seven:
	if (ajNeigh > 7) return null;

	for (let ojDir = 0; ojDir < 8; ++ojDir) {
		const oOff = uOff(ojDir);
		const oPos = aSel.Pos.uSum(oOff);
		if (Cfg.RectBoard.uCkContain(oPos) && !aSel.CksAll.uGet(oPos)) {
			if (ajNeigh < 1) return oPos;
			--ajNeigh;
		}
	}
	return null;
}

/** Returns the one-position offset for direction index ajDir, which ranges from
 *  zero to seven. */
function uOff(ajDir) {
	switch (ajDir) {
		case 0: return new tPt2(1, 0);
		case 1: return new tPt2(1, 1);
		case 2: return new tPt2(0, 1);
		case 3: return new tPt2(-1, 1);
		case 4: return new tPt2(-1, 0);
		case 5: return new tPt2(-1, -1);
		case 6: return new tPt2(0, -1);
		case 7: return new tPt2(1, -1);
		default:
			throw Error("SelBoard uOff: Invalid index");
	}
}
