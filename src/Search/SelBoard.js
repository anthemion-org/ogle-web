// SelBoard.js
// -----------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tSelBoard } from "../SelBoard.js";
//

import { tBoard } from "../Board.js";
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
	constructor(aqBoard, aqPos, aqSelPrev) {
		if (!aqBoard instanceof tBoard)
			throw Error("tSelBoard: Invalid board");
		if (!aqPos instanceof tPt2)
			throw Error("tSelBoard: Invalid position");

		/* The board that contains the selection. */
		this.qBoard = aqBoard;
		/* The board position selected by this instance. */
		this.qPos = aqPos;
		/** The selection instance that precedes this one, or 'null' if this
		 *  instance is the first. */
		this.qSelPrev = aqSelPrev ?? null;

		let oqCksAllPrev = aqSelPrev
			? aqSelPrev.qCksSel.uClone()
			: new tArr2(Cfg.SizeBoard, { Def: false });
		/** A tArr2 array of booleans that mark the board positions selected by this
		 *  instance and its predecessors: */
		this.qCksAll = oqCksAllPrev;
		this.qCksAll.uSet(aqPos, true);

		let oyPosiAllPrev = aqSelPrev ? Array.from(aqSelPrev.yPosiAll) : [];
		/** An array containing the tPt2 positions selected by this instance and its
		 *  predecessors, in order of selection. */
		this.yPosiAll = oyPosiAllPrev;
		this.yPosiAll.push(aqPos);

		const oTextPos = aqBoard.uDie(aqPos);
		/** The text selected by this instance and its predecessors. Recall that the
		 *  'Qu' die counts as two letters, not one. */
		this.TextAll = aqSelPrev ? (aqSelPrev.Text + oTextPos) : oTextPos;

		/** The index of the selection neighbor that should follow this one. This
		 *  index will increment as uNext is called. */
		this.jNeighNext = 0;
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
		const oqPosNext = uPosNext(this, this.jNeighNext++);
		return oqPosNext ? new tSelBoard(this.qBoard, oqPosNext, this) : null;
	}
}

/** Returns the first available adjacent position after skipping ajNeighNext
 *  valid choices, starting with the position on the right, and proceding
 *  counter-clockwise. Returns 'null' if no such position exists. */
function uPosNext(aqSel, ajNeighNext) {
	// The 'next' index ranges from zero to seven:
	if (ajNeighNext > 7) return null;

	for (let ojDir = 0; ojDir < 8; ++ojDir) {
		const oOff = uOff(ojDir);
		const oqPos = aqSel.qPos.uSum(oOff);
		if (Cfg.RectBoard.uCkContain(oqPos) && !aqSel.qCksSel.uGet(oqPos)) {
			if (ajNeighNext < 1) return oqPos;
			--ajNeighNext;
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
