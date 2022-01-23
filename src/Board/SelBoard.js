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

/** Represents a single board selection, for use when enumerating board content
 *  during the Ogle word search, or during play. Each instance represents a
 *  single die selection, which adds one or two letters to the selected text.
 *  The instance also references an optional predecessor instance. Together, the
 *  last instance and its predecessors give the entire selection. */
export class tSelBoard {
	/** Set aSelPrev to the instance that should precede this instance in the
	 *  selection, or leave it undefined to start a new selection. */
	constructor(aBoard, aPos, aSelPrev) {
		/* The board that contains the selection. */
		this.Board = aBoard;
		/* The board position selected by this instance. */
		this.Pos = aPos;
		/** The selection instance that precedes this one, or 'null' if this is the
		 *  first. Recall that preceding instances in the selection chain will not
		 *  have SelsByPos or TextAll values that include later instances, such as
		 *  this one defining this reference. */
		this.SelPrev = aSelPrev ?? null;

		let oSelsByPosPrev = aSelPrev
			? aSelPrev.SelsByPos.uClone()
			: new tArr2(Cfg.SizeBoard, { Def: null });
		/** A tArr2 array that references this instance and its predecessors by
		 *  board position. */
		this.SelsByPos = oSelsByPosPrev;
		this.SelsByPos.uSet(aPos, this);

		const oDiePos = aBoard.uDie(aPos);
		const oTextPos = oDiePos.Text.toLowerCase();
		/** The text selected by this instance and its predecessors, in lowercase.
		 *  Recall that the 'Qu' die counts as two letters, not one. */
		this.TextAll = aSelPrev ? (aSelPrev.TextAll + oTextPos) : oTextPos;

		/** The index of the selection neighbor that should follow this one when
		 *  enumerating. This index will increment as uNext is called. */
		this.jNeighNext = 0;
	}

	/** Returns the tSelBoard instance at the specified position, or 'null' if the
	 *  position is not selected by this instance or its predecessors. */
	uSelAt(aPos) {
		return this.SelsByPos.uGet(aPos);
	}

	/** Returns 'true' if the specified position can be added to the end of this
	 *  selection. */
	uCkAddAt(aPos) {
		return Cfg.RectBoard.uCkContain(aPos)
			&& this.Pos.uCkAdjacent(aPos)
			&& !this.SelsByPos.uGet(aPos);
	}

	/** Returns 'true' if the specified position can be selected or unselected. */
	uCkTogAt(aPos) {
		return Cfg.RectBoard.uCkContain(aPos)
			&& (this.uCkAddAt(aPos) || !!this.SelsByPos.uGet(aPos));
	}

	/** Creates and returns a new instance selecting a board position that is:
	 *
	 *  ~ Adjacent to the one selected by this instance;
	 *
	 *  ~ Not already selected by this sequence; and,
	 *
	 *  ~ Not previously returned by this instance.
	 *
	 *  Returns 'null' if no such position exists.
	 *
	 *  By creating a top-level instance for a given board position, and then
	 *  recursively invoking uNext on that instance, plus every instance returned
	 *  by uNext, all die sequences beginning with the first position can be
	 *  enumerated.*/
	uNext() {
		const oPosNext = uPosNext(this, this.jNeighNext++);
		return oPosNext ? new tSelBoard(this.Board, oPosNext, this) : null;
	}
}

/** Returns the first available adjacent position after skipping ajNeigh valid
 *  choices, starting with the position on the right, and proceding
 *  counter-clockwise. Returns 'null' if no such position exists. */
function uPosNext(aSel, ajNeigh) {
	// The 'next' index ranges from zero to seven:
	if (ajNeigh > 7) return null;

	for (let ojDir = 0; ojDir < 8; ++ojDir) {
		const oOff = uOff(ojDir);
		const oPos = aSel.Pos.uSum(oOff);
		if (Cfg.RectBoard.uCkContain(oPos) && !aSel.SelsByPos.uGet(oPos)) {
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
	}
	throw Error("SelBoard uOff: Invalid index");
}
