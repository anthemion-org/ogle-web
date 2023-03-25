// SelBoard.js
// ===========
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tSelBoard } from "./Search/SelBoard.js";
//

// For performance reasons, we should not `uCkThrow_Params` in this module!

import * as Board from "../Board/Board.js";
import * as EntWord from "../Round/EntWord.js";
import * as Arr2 from "../Util/Arr2.js";
import * as Rect from "../Util/Rect.js";
import * as Pt2 from "../Util/Pt2.js";
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
 *  this class produces verbose output when serialized with `JSON.stringify`.
 *  Simpler output is produced by EntWord stereotypes, which store similar data,
 *  but are not as fast. */
export class tSelBoard {
	/** Set `aSelPrev` to the instance that should precede this instance in the
	 *  selection, or leave it undefined to start a new selection. */
	constructor(aBoard, aPos, aSelPrev) {
		/* The board that contains the selection. */
		this.Board = aBoard;
		/* The board position selected by this instance. */
		this.Pos = aPos;
		/** The selection instance that precedes this one, or `null` if this is the
		 *  first. Recall that preceding instances in the selection chain will not
		 *  have `CksByPos` or `TextAll` values that include later instances, such
		 *  as this one defining this reference. */
		this.SelPrev = aSelPrev ?? null;

		let oCksByPosPrev = aSelPrev
			? Arr2.uCopy(aSelPrev.CksByPos)
			: Arr2.uNew(Const.SizeBoard, { Def: false });
		/** An Arr2 stereotype of booleans that marks selected board position. */
		this.CksByPos = oCksByPosPrev;
		Arr2.uSet(this.CksByPos, aPos, true);

		const oDie = Board.uDie(aBoard, aPos);
		const oText = oDie.Text.toLowerCase();
		/** The text selected by this instance and its predecessors, in lowercase.
		 *  Recall that the 'Qu' die counts as two letters, not one. */
		this.TextAll = aSelPrev ? (aSelPrev.TextAll + oText) : oText;

		/** The index of the selection neighbor that should follow this one when
		 *  enumerating. This index will increment as `uNext` is called. */
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
	 *  by `uNext`, all die sequences beginning with the first position can be
	 *  enumerated.*/
	uCloneNext() {
		const oPosNext = _uPosNext(this, this._jNeighNext++);
		return oPosNext ? new tSelBoard(this.Board, oPosNext, this) : null;
	}

	/** Returns an EntWord stereotype representing this selection. */
	uEntWord() {
		let oSel = this;
		const oPosi = [];
		const oTexts = [];
		while (oSel) {
			oPosi.unshift(oSel.Pos);

			const oDie = Board.uDie(this.Board, oSel.Pos);
			oTexts.unshift(oDie.Text);

			oSel = oSel.SelPrev;
		}
		return EntWord.uNew(oPosi, oTexts);
	}
}

/** Returns the first available adjacent position after skipping `ajNeigh` valid
 *  choices, starting with the position on the right, and proceding
 *  counter-clockwise. Returns `null` if no such position exists. */
function _uPosNext(aSel, ajNeigh) {
	// The 'next' index ranges from zero to seven:
	if (ajNeigh > 7) return null;

	for (let ojDir = 0; ojDir < 8; ++ojDir) {
		const oOff = _uOff(ojDir);
		const oPos = Pt2.uSum(aSel.Pos, oOff);
		if (Rect.uCkContain(Const.RectBoard, oPos)
			&& !Arr2.uGet(aSel.CksByPos, oPos)) {

			if (ajNeigh < 1) return oPos;
			--ajNeigh;
		}
	}
	return null;
}

/** Returns the one-position offset for direction index `ajDir`, which ranges
 *  from zero to seven. */
function _uOff(ajDir) {
	switch (ajDir) {
		case 0: return _Off0;
		case 1: return _Off1;
		case 2: return _Off2;
		case 3: return _Off3;
		case 4: return _Off4;
		case 5: return _Off5;
		case 6: return _Off6;
		case 7: return _Off7;
	}
	throw Error("SelBoard _uOff: Invalid index");
}

// When Pt2 stereotypes re frozen, this produces a surprising performance
// improvement in the word search:
const _Off0 = Pt2.uNew(1, 0);
const _Off1 = Pt2.uNew(1, 1);
const _Off2 = Pt2.uNew(0, 1);
const _Off3 = Pt2.uNew(-1, 1);
const _Off4 = Pt2.uNew(-1, 0);
const _Off5 = Pt2.uNew(-1, -1);
const _Off6 = Pt2.uNew(0, -1);
const _Off7 = Pt2.uNew(1, -1);
