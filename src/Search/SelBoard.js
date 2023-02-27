// SelBoard.js
// ===========
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tSelBoard } from "./Search/SelBoard.js";
//

import { tEntWord } from "../Round/EntWord.js";
import { tArr2 } from "../Util/Arr2.js";
import { tPt2 } from "../Util/Pt2.js";
import * as Const from "../Const.js";

// tSelBoard
// ---------

/** Represents a single board selection, for use when enumerating board content
 *  during the Ogle word search. Each instance represents a single die
 *  selection, which adds one or two letters to the selected text. The instance
 *  also references an optional predecessor. Together, the last instance and its
 *  predecessors define the entire selection.
 *
 *  This class is mutable. Because most instances reference other instances,
 *  this class produces verbose output when serialized with 'JSON.stringify'.
 *  Simpler output is produced by tEntWord, which stores similar data, but is
 *  not as fast. */
export class tSelBoard {
	/** Set aSelPrev to the instance that should precede this instance in the
	 *  selection, or leave it undefined to start a new selection. */
	constructor(aBoard, aPos, aSelPrev) {
		/* The board that contains the selection. */
		this.Board = aBoard;
		/* The board position selected by this instance. */
		this.Pos = aPos;
		/** The selection instance that precedes this one, or `null` if this is the
		 *  first. Recall that preceding instances in the selection chain will not
		 *  have CksByPos or TextAll values that include later instances, such as
		 *  this one defining this reference. */
		this.SelPrev = aSelPrev ?? null;

		let oCksByPosPrev = aSelPrev
			? aSelPrev.CksByPos.uCopy()
			: new tArr2(Const.SizeBoard, { Def: false });
		/** A tArr2 of booleans that that marks selected board position. */
		this.CksByPos = oCksByPosPrev;
		this.CksByPos.uSet(aPos, true);

		const oDie = aBoard.uDie(aPos);
		const oText = oDie.Text.toLowerCase();
		/** The text selected by this instance and its predecessors, in lowercase.
		 *  Recall that the 'Qu' die counts as two letters, not one. */
		this.TextAll = aSelPrev ? (aSelPrev.TextAll + oText) : oText;

		/** The index of the selection neighbor that should follow this one when
		 *  enumerating. This index will increment as uNext is called. */
		this._jNeighNext = 0;
	}

	/** Returns a new instance selecting a board position that is:
	 *
	 *  - Adjacent to the one selected by this instance;
	 *
	 *  - Not already selected by this sequence; and,
	 *
	 *  - Not previously returned by this instance.
	 *
	 *  Returns `null` if no such position exists.
	 *
	 *  By creating a top-level instance for a given board position, and then
	 *  recursively invoking uNext on that instance, plus every instance returned
	 *  by uNext, all die sequences beginning with the first position can be
	 *  enumerated.*/
	uCloneNext() {
		const oPosNext = uPosNext(this, this._jNeighNext++);
		return oPosNext ? new tSelBoard(this.Board, oPosNext, this) : null;
	}

	/** Returns a tEntWord instance representing this selection. */
	uEntWord() {
		let oSel = this;
		const oPosi = [];
		const oTexts = [];
		while (oSel) {
			oPosi.unshift(oSel.Pos);

			const oDie = this.Board.uDie(oSel.Pos);
			oTexts.unshift(oDie.Text);

			oSel = oSel.SelPrev;
		}
		return new tEntWord(oPosi, oTexts);
	}
}

/** Returns the first available adjacent position after skipping ajNeigh valid
 *  choices, starting with the position on the right, and proceding
 *  counter-clockwise. Returns `null` if no such position exists. */
function uPosNext(aSel, ajNeigh) {
	// The 'next' index ranges from zero to seven:
	if (ajNeigh > 7) return null;

	for (let ojDir = 0; ojDir < 8; ++ojDir) {
		const oOff = uOff(ojDir);
		const oPos = aSel.Pos.uSum(oOff);
		if (Const.RectBoard.uCkContain(oPos) && !aSel.CksByPos.uGet(oPos)) {
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
