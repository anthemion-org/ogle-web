// ViewPlay.js
// -----------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import ViewPlay from "./UI/ViewPlay.js";
//

import "./ViewPlay.css";
import * as StApp from "../StApp.js";
import { tSetup } from "../Setup.js";
import { tBoard } from "../Board/Board.js";
import { tSelBoard } from "../Board/SelBoard.js";
import LookBoard from "./LookBoard.js";
import Lex from "../Search/Lex.js";
import * as ActPlay from "./ActPlay.js";

import { React, useState } from "react";
import PropTypes from "prop-types";

// ViewPlay
// --------

/** Implements the Play view. Along with StApp and uUpd_StApp, the following
 *  props are supported:
 *
 *  ~ Setup: A tSetup instance that configures the current game. This prop is
 *    required.
 *
 *  ~ BoardRest: A tBoard instance representing a board that was restored from
 *    the local storage, or 'null' if no board has been created.
 */
export default function ViewPlay(aProps) {
	const [oBoard, ouSet_Board] = useState(aProps.BoardRest);
	const [oCkSearch, ouSet_CkSearch] = useState(false);
	const [oSelsOgle, ouSet_SelsOgle] = useState(aProps.SelsOgle);

	if (!oBoard && !oCkSearch) {
		ouSet_CkSearch(true);

		const Work = new Worker(new URL("../Search/WorkSearch.js",
			import.meta.url));

		Work.postMessage({
			WordsSearch: Lex.WordsSearch,
			Setup: aProps.Setup
		});

		Work.onmessage = function (aMsg) {
			ouSet_Board(tBoard.suFromPOD(aMsg.data.Board));
			ouSet_SelsOgle(aMsg.data.SelsOgle);
		};
	}

	// Help
	// ----

	/** Handles the Help button click. */
	function ouHandHelp(aEvt) {
	}

	// Pause dialog
	// ------------

	/** Set to 'true' if play is paused. */
	const [oCkPause, ouSet_CkPause] = useState(false);

	/** Handles the Pause button click. */
	function ouHandPause(aEvt) {
		ouSet_CkPause(true);
	}

	/** Handles the Resume button click. */
	function ouHandResume(aEvt) {
		ouSet_CkPause(false);
	}

	/** Handles the End Round button click. */
	function ouHandEnd(aEvt) {
		const oSt = { View: StApp.Views.Setup };
		aProps.uUpd_StApp(oSt);
	}

	/** Returns the Pause dialog, or 'null' if the game is not paused. */
	function ouDlgPause() {
		if (!oCkPause) return null;

		return (
			<div className="ScreenDlg">
				<div id="DlgPause">
					<button onClick={ouHandEnd}>End round</button>
					<button onClick={ouHandResume}>Resume</button>
				</div>
			</div>
		);
	}

	// Board selection
	// ---------------

	/** The selection within the board, or 'null' if there is no selection. */
	const [oSel, ouSet_Sel] = useState(null);

	/** Returns 'true' if the specified board position can be selected or
	 *  unselected. */
	function ouCkEnab(aPos) {
		return !oSel || oSel.uCkTogAt(aPos);
	}

	/** Toggles the die selection at the specified board position. */
	function ouTog_Die(aPos) {
		if (!oBoard || !ouCkEnab(aPos)) return;

		if (!oSel) {
			const oSelNew = new tSelBoard(oBoard, aPos);
			ouSet_Sel(oSelNew);
			return;
		}

		const oSelAt = oSel.SelsByPos.uGet(aPos);
		if (oSelAt) {
			ouSet_Sel(oSelAt.SelPrev);
			return;
		}

		const oSelAdd = new tSelBoard(oBoard, aPos, oSel);
		ouSet_Sel(oSelAdd);
	}

	/** Clears the board selection. */
	function ouClear_Sel() {
		ouSet_Sel(null);
	}

	/** Records the board selection as a word entry. */
	function ouEnt_Sel() {
		ouSet_Sel(null);
	}

	// Component content
	// -----------------

	/** Returns entry box content. */
	function ouBoxEnt() {
		let oCont;
		if (oSel) oCont = (
			<div id="TextEnt">
				{oSel.TextAll}
			</div>
		);
		else oCont = (
			<>
				<div id="TextInstruct">
					Enter as many words of <em>four or more letters</em> as you can
					before time runs out!
				</div>
				<button onClick={ouHandHelp}>Help</button>
			</>
		);

		return (
			<div id="BoxEnt">
				{oCont}
			</div>
		);
	}

	function ouLookBoard() {
		if (oBoard) return (
			<LookBoard Board={oBoard} Sel={oSel} uCallTog={ouTog_Die}
				uCallClear={ouClear_Sel} uCallEnt={ouEnt_Sel} />
		);

		return (
			<div>Generating board...</div>
		);
	}

	return (
		<div id="ViewPlay">
			<h1>Ogle</h1>

			{ouBoxEnt()}
			{ouLookBoard()}

			<div className="Btns">
				<button onClick={ouHandPause}>Pause</button>
			</div>

			{ouDlgPause()}
		</div>
	);
}

ViewPlay.propTypes = {
	StApp: PropTypes.object.isRequired,
	uUpd_StApp: PropTypes.func.isRequired,
	Setup: PropTypes.instanceOf(tSetup).isRequired,
	Board: PropTypes.instanceOf(tBoard)
};
