// SearchBoard.js
// --------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as SearchBoard from "./SearchBoard.js";
//

import { tLookupText, OutsLookup } from "./LookupText.js";
import { tSelBoard } from "../Search/SelBoard.js";
import * as Const from "../Const.js";

/** Returns an array of tSelBoard instances representing all words in aBoard
 *  that are found in aWords, including duplicates and followed words. */
export function uExec(aWords, aBoard) {
	/** The word selections found during the search, including duplicates and
	 *  followed words. */
	const oSelsWord = [];
	const oiPosi = Const.RectBoard.uPosi();
	for (const oPos of oiPosi) {
		const oSel = new tSelBoard(aBoard, oPos);
		const oLookup = new tLookupText(aWords, oSel.TextAll);
		// At this point, the board selection contains only one die, so it cannot
		// generate a valid entry. Lookup instances borrow search window state from
		// their predecessors, however, so starting the search here will save a few
		// search iterations later:
		oLookup.uExec(true);

		uExecPos(oSel, oLookup, oSelsWord);
	}
	return oSelsWord;
}

/** Uses the specified tSelBoard and tLookupText instances to find all word
 *  selections that begin with aSel, and adds them to array aSelsWord. */
function uExecPos(aSelBoard, aLookup, aSelsWord) {
	while (true) {
		const oSelNext = aSelBoard.uCloneNext();
		// All die sequences following this enumerator have been checked:
		if (!oSelNext) return;

		const oLookup = tLookupText.suFromPrev(aLookup, oSelNext.TextAll);
		const oOutLookup = oLookup.uExec(true);

		// No words can follow this descendant of aLookup, so continue with the next
		// descendant:
		if (oOutLookup === OutsLookup.Miss) continue;

		if (oSelNext.TextAll.length >= Const.LenWordMin) {
			if (oOutLookup === OutsLookup.Match)
				aSelsWord.push(oSelNext);
			else {
				// A fragment was identified. The search normally stops when this
				// happens, to prevent the search window from narrowing so far that
				// sequences following the fragment cannot be identified. A fragment
				// might also be a match, however, so check again without stopping:
				const oLookupFrag = tLookupText.suFromPrev(aLookup, oSelNext.TextAll);
				if (oLookupFrag.uExec(false) === OutsLookup.Match)
					aSelsWord.push(oSelNext);
			}
		}

		// Check the descendants of this selection:
		uExecPos(oSelNext, oLookup, aSelsWord);
	}
}
