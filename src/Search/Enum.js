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

		// The board that is being enumerated.
		this.qBoard = aqBoard;
		// The board position covered by this instance.
		this.qPos = aqPos;
		// The enumeration instance that precedes this one, or 'null' if this
		// instance is the first.
		this.qEnumPrev = aqEnumPrev ?? null;

		const oTextPos = aqBoard.uDie(aqPos);
		// The text selected by this instance and its predecessors.
		this.Text = aqEnumPrev ? (aqEnumPrev.Text + oTextPos) : oTextPos;

		// The index of the enumeration instance that should follow this one. This
		// index will increment as Next is called.
		this.jNext = 0;

		let oqCksSelOrig = aqEnumPrev
			? aqEnumPrev.qCksSel.uClone()
			: new tArr2(Cfg.SizeBoard, { Def: false });
		// An array of flags that mark the dice selected by this instance and its
		// predecessors:
		this.qCksSel = oqCksSelOrig;
	}
}
