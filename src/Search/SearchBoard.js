// SearchBoard.js
// --------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as SearchBoard from "./SearchBoard.js";
//

import { tLookLex, OutsLook } from "./LookLex.js";
import { tSelBoard } from "../Board/SelBoard.js";
import * as Cfg from "../Cfg.js";

/** Returns an array of tSelBoard instances representing all words in aBoard
 *  that are found in aWords, including duplicates and followed words. */
export function uExec(aBoard, aWords) {
	/** The word selections found during the search, including duplicates and
	 *  followed words. */
	const oSelsWord = [];
	const oiPosi = Cfg.RectBoard.uPosi();
	for (const oPos of oiPosi) {
		const oSel = new tSelBoard(aBoard, oPos);
		const oLook = new tLookLex(aWords, oSel.TextAll);
		// At this point, the board selection contains only one die, so it cannot
		// generate a valid entry. Lookup instances borrow search window state from
		// their predecessors, however, so starting the search here will save a few
		// search iterations later:
		oLook.uExec(true);

		uExecPos(oSel, oLook, oSelsWord);
	}
	return oSelsWord;
}

/** Uses the specified tSelBoard amd tLookLex instances to find all word
 *  selections that begin with aSel, and adds them to aray aSelsWord. */
function uExecPos(aSel, aLook, aSelsWord) {
	while (true) {
		const oSelNext = aSel.uNext();
		// All die sequences following this enumerator have been checked:
		if (!oSelNext) return;

		const oLook = tLookLex.suFromPrev(aLook, oSelNext.TextAll);
		const oOutLook = oLook.uExec(true);

		// No words can follow this descendant of aLook, so continue with the next
		// descendant:
		if (oOutLook === OutsLook.Miss) continue;

		if (oSelNext.TextAll.length >= Cfg.LenWordMin) {
			if (oOutLook === OutsLook.Match)
				aSelsWord.push(oSelNext);
			else {
				// A fragment was identified. The search normally stops when this
				// happens, to prevent the search window from narrowing so far that
				// sequences following the fragment cannot be identified. A fragment
				// might also be a match, however, so check again without stopping:
				const oLookFrag = tLookLex.suFromPrev(aLook, oSelNext.TextAll);
				if (oLookFrag.uExec(false) === OutsLook.Match)
					aSelsWord.push(oSelNext);
			}
		}

		// Check the descendants of this selection:
		uExecPos(oSelNext, oLook, aSelsWord);
	}
}
