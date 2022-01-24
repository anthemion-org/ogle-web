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
import { tRound } from "../Round.js";
import LookBoard from "./LookBoard.js";
import * as ActPlay from "./ActPlay.js";

import { React, useState, useCallback } from "react";
import PropTypes from "prop-types";

// ViewPlay
// --------

/** Implements the Play view. Along with StApp and uUpd_StApp, the following
 *  props are supported:
 *
 *  ~ Setup: A tSetup instance that gives the user settings. This prop is
 *    required.
 *
 *  ~ Board: A tBoard instance representing the board to be played. This prop is
 *    required.
 */
export default function ViewPlay(aProps) {

	// Help
	// ----

	/** Handles the Help button click. */
	const ouHandHelp = useCallback(aEvt => {
	});

	// Pause dialog
	// ------------

	/** Set to 'true' if the game is paused. */
	const [oCkPause, ouSet_CkPause] = useState(false);

	/** Handles the Pause button click. */
	const ouHandPause = useCallback(aEvt => {
		ouSet_CkPause(true);
	});

	/** Handles the Resume button click. */
	const ouHandResume = useCallback(aEvt => {
		ouSet_CkPause(false);
	});

	/** Handles the End Round button click. */
	const ouHandEnd = useCallback(aEvt => {
		aProps.uUpd_StApp(StApp.Views.Setup);
	});

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
	const ouTog_Die = useCallback(aPos => {
		if (!ouCkEnab(aPos)) return;

		if (!oSel) {
			const oSelNew = new tSelBoard(aProps.Board, aPos);
			ouSet_Sel(oSelNew);
			return;
		}

		const oSelAt = oSel.SelsByPos.uGet(aPos);
		if (oSelAt) {
			ouSet_Sel(oSelAt.SelPrev);
			return;
		}

		const oSelAdd = new tSelBoard(aProps.Board, aPos, oSel);
		ouSet_Sel(oSelAdd);
	});

	/** Clears the board selection. */
	const ouClear_Sel = useCallback(() => {
		ouSet_Sel(null);
	});

	/** Records the board selection as a word entry. */
	const ouEnt_Sel = useCallback(() => {
		ouSet_Sel(null);
	});

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

	return (
		<div id="ViewPlay">
			<h1>Ogle</h1>

			{ouBoxEnt()}

			<LookBoard Board={aProps.Board} Sel={oSel} uCallTog={ouTog_Die}
				uCallClear={ouClear_Sel} uCallEnt={ouEnt_Sel} />

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
	Board: PropTypes.instanceOf(tBoard).isRequired
};
