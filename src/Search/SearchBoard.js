// SearchBoard.js
// --------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as SearchBoard from "./SearchBoard.js";
//

import { tLookLex, pOutsLook } from "./LookLex.js";
import { tSelBoard } from "./SelBoard.js";
import * as Cfg from "../Cfg.js";

/** Returns an array of tSelBoard instances representing all words in aqBoard
 *  that are listed in aqLex, including duplicates and followed words. */
export function uExec(aqBoard, aqLex) {
	/** The word selections found during the search, including duplicates and
	 *  followed words. */
	const oySelsWord = [];
	const oyPosi = Cfg.RectBoard.uPosi();
	for (const oqPos of oyPosi) {
		const oqSel = new tSelBoard(aqBoard, oqPos);
		const oqLook = new tLookLex(aqLex, oqSel.TextAll);
		// At this point, the board selection contains only one die, so it cannot
		// generate a valid entry. Lookup instances borrow search window state from
		// their predecessors, however, so starting the search here will save a few
		// search iterations later:
		oqLook.uExec(true);

		uExecPos(oqSel, oqLook, oySelsWord);
	}
	return oySelsWord;
}

/** Uses the specified tSelBoard amd tLookLex instances to find all word
 *  selections that begin with aqSel, and adds them to aray aySelsWord. */
function uExecPos(aqSel, aqLook, aySelsWord) {
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
				aySelsWord.push(oqSelNext);
			else {
				// A fragment was identified. The search normally stops when this
				// happens, to prevent the search window from narrowing so far that
				// sequences following the fragment cannot be identified. A fragment
				// might also be a match, however, so check again without stopping:
				const oqLookFrag = tLookLex.suFromPrev(aqLook, oqSelNext.TextAll);
				if (oqLookFrag.uExec(false) == pOutsLook.Match)
					aySelsWord.push(oqSelNext);
			}
		}

		// Check the descendants of this selection:
		uExecPos(oqSelNext, oqLook, aySelsWord);
	}
}
