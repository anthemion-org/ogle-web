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
import { tSetup } from "../Round/Setup.js";
import { tBoard } from "../Board/Board.js";
import { tEntWord } from "../Round/EntWord.js";
import LookBoard from "./LookBoard.js";
import Lex from "../Search/Lex.js";
import * as Store from "../Store.js";
import * as ActPlay from "./ActPlay.js";

import { React, useState, useEffect } from "react";
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

	// Generate board
	// --------------

	const [oBoard, ouSet_Board] = useState(aProps.BoardRest);
	const [oEntsOgle, ouSet_EntsOgle] = useState(aProps.EntsOgleRest);
	const [oEntsUser, ouSet_EntsUser] = useState(aProps.EntsUserRest);

	function ouCreate_WorkSearch() {
		if (oBoard) return;

		const Work = new Worker(new URL("../Search/WorkSearch.js",
			import.meta.url));

		Work.postMessage({
			WordsSearch: Lex.WordsSearch,
			Setup: aProps.Setup
		});

		Work.onmessage = function (aMsg) {
			ouSet_Board(tBoard.suFromPOD(aMsg.data.Board));
			ouSet_EntsOgle(aMsg.data.EntsOgle);
		};
	}
	useEffect(ouCreate_WorkSearch, [aProps.Setup, oBoard]);

	function ouStore_Board() {
		Store.uSet("Board", oBoard);
		Store.uSet("EntsOgle", oEntsOgle);
	}
	useEffect(ouStore_Board, [oBoard, oEntsOgle]);

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
	const [oEnt, ouSet_Ent] = useState(null);

	/** Returns 'true' if the specified board position can be selected or
	 *  unselected. */
	function ouCkEnab(aPos) {
		return !oEnt || oEnt.uCkTogAt(aPos);
	}

	/** Toggles the die selection at the specified board position. */
	function ouTog_Die(aPos) {
		if (!oBoard || !ouCkEnab(aPos)) return;

		if (!oEnt) {
			const oText = oBoard.uDie(aPos).Text;
			const oEntNew = tEntWord.suFromPosText(aPos, oText);
			ouSet_Ent(oEntNew);
			return;
		}

		if (oEnt.uCkAt(aPos)) {
			const oEntPrev = oEnt.uEntPrev(aPos);
			ouSet_Ent(oEntPrev);
			return;
		}

		const oText = oBoard.uDie(aPos).Text;
		const oEntAdd = tEntWord.suFromPosText(aPos, oText, oEnt);
		ouSet_Ent(oEntAdd);
	}

	/** Clears the board selection. */
	function ouClear_Ent() {
		ouSet_Ent(null);
	}

	/** Records the board selection as a word entry. */
	function ouRecord_Ent() {
		ouSet_Ent(null);
	}

	// Component content
	// -----------------

	/** Returns entry box content. */
	function ouBoxEnt() {
		let oCont;
		if (oEnt) oCont = (
			<div id="TextEnt">
				{oEnt.uTextAll()}
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
			<LookBoard Board={oBoard} Ent={oEnt} uCallTog={ouTog_Die}
				uCallClear={ouClear_Ent} uCallRecord={ouRecord_Ent} />
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
