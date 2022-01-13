// SearchBoard.js
// --------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tSearchBoard } "./SearchBoard.js";
//

import { tLookLex, pOutsLook } from "./LookLex.js";
import { tSelBoard } from "./SelBoard.js";
import * as Cfg from "../Cfg.js";

// tSearchBoard
// ------------

export class tSearchBoard {
	constructor(aqBoard, aqLex) {
		/** The board to be searched. */
		this.qBoard = aqBoard;
		/** The lexicon to be used while searching. */
		this.qLex = aqLex;
		/** The word selections found during the search, including duplicates and
		 *  followed words. */
		this.ySelsWord = [];
	}

	uExec() {
		const oyPosi = Cfg.RectBoard.uPosi();
		for (const oqPos of oyPosi) {
			const oqSel = new tSelBoard(this.qBoard, oqPos);
			const oqLook = new tLookLex(this.qLex, oqSel.TextAll);
			// At this point, the board selection contains only one die, so it cannot
			// generate a valid entry. Lookup instances borrow search window state from
			// their predecessors, however, so starting the search here will save a few
			// search iterations later:
			oqLook.uExec(true);

			this.uExecPos(oqSel, oqLook);
		}
	}

	uExecPos(aqSel, aqLook) {
		while (true) {
			const oqSelNext = aqSel.uNext();
			// All die sequences following this enumerator have been checked:
			if (!oqSelNext) return;

			const oqLook = tLookLex.suFromPrev(aqLook, oqSelNext.TextAll);
			const oOutLook = oqLook.uExec(true);

			// No words can follow this descendant of aqLook, so continue with the
			// next descendant:
			if (oOutLook === pOutsLook.Miss) continue;

			if (oqSelNext.TextAll.length >= Cfg.LenWordMin) {
				if (oOutLook === pOutsLook.Match)
					this.ySelsWord.push(oqSelNext);
				else {
					// A fragment was identified. The search normally stops when this
					// happens to prevent the search window from narrowing so far that
					// sequences following the fragment cannot be identified. A fragment
					// might also be a match, however, so check again without stopping:
					const oqLookFrag = tLookLex.suFromPrev(aqLook, oqSelNext.TextAll);
					if (oqLookFrag.uExec(false) == pOutsLook.Match)
						this.ySelsWord.push(oqSelNext);
				}
			}

			// Check the descendants of this enumerator:
			this.uExecPos(oqSelNext, oqLook);
		}
	}
}
