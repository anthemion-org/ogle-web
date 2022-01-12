// Enum.js
// -------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tEnum } from "../Enum.js";
//

import { tBoard } from "../Board.js";
import { tPt2 } from "../Util/Pt2.js";
import { tArr2 } from "../Util/Arr2.js";
import * as Dir8 from "../Util/Dir8.js";
import * as Cfg from "../Cfg.js";

// tEnum
// -----

export class tEnum {
	constructor(aqBoard, aqPos, aqEnumPrev) {
		if (!aqBoard instanceof tBoard)
			throw new Error("tEnum: Invalid board");
		if (!aqPos instanceof tPt2)
			throw new Error("tEnum: Invalid position");

		/* The board that is being enumerated. */
		this.qBoard = aqBoard;
		/* The board position covered by this instance. */
		this.qPos = aqPos;
		/** The enumeration instance that precedes this one, or 'null' if this
		 *  instance is the first. */
		this.qEnumPrev = aqEnumPrev ?? null;

		let oqCksSelOrig = aqEnumPrev
			? aqEnumPrev.qCksSel.uClone()
			: new tArr2(Cfg.SizeBoard, { Def: false });
		/** An tArr2 array of flags that mark the dice selected by this instance and
		 *  its predecessors: */
		this.qCksSel = oqCksSelOrig;
		this.qCksSel.uSet(aqPos, true);

		/** The index of the enumeration instance that should follow this one. This
		 *  index will increment as uNext is called. */
		this.jNext = 0;

		const oTextPos = aqBoard.uDie(aqPos);
		/** The text selected by this instance and its predecessors. */
		this.Text = aqEnumPrev ? (aqEnumPrev.Text + oTextPos) : oTextPos;
	}

	/** Returns an array containing the tPt2 positions covered by this instance
	 *  and its predecessors, in order of selection. */
	uPosiSel() {
		// This doesn't have to be fast:
		const oqPosi = [];
		for (let oq = this; oq !== null; oq = oq.qEnumPrev)
			oqPosi.unshift(oq.qPos);
		return oqPosi;
	}

	/** Creates and returns a new instance covering a board position that is:
	 *
	 *  ~ Adjacent to the one covered by this instance;
	 *
	 *  ~ Not already part of this sequence; and,
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
		const oqPosNext = uPosNext(this, this.jNext++);
		return oqPosNext ? new tEnum(this.qBoard, oqPosNext, this) : null;
	}
}

/** Returns the first available adjacent position after skipping ajNext valid
 *  choices, starting with the position on the right, and proceding
 *  counter-clockwise. Returns 'null' if no such position exists. */
function uPosNext(aqEnum, ajNext) {
	// The 'next' index ranges from zero to seven:
	if (ajNext > 7) return null;

	for (let ojDir = 0; ojDir < 8; ++ojDir) {
		const oOff = uOff(ojDir);
		const oqPos = aqEnum.qPos.uSum(oOff);
		if (Cfg.RectBoard.uCkContain(oqPos) && !aqEnum.qCksSel.uGet(oqPos)) {
			if (ajNext < 1) return oqPos;
			--ajNext;
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
			throw new Error("Enum uOff: Invalid index");
	}
}
