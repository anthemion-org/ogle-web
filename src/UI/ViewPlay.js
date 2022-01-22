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
import * as ActPlay from "./ActPlay.js";

import React, { useState } from "react";
import PropTypes from "prop-types";

// ViewPlay
// --------

/** Implements the Play view. Along with StApp and uDispatStApp, the following
 *  props are supported:
 *
 *  ~ Setup: A tSetup instance that gives the user settings. This prop is
 *    required.
 *
 *  ~ Board: A tBoard instance representing the board to be played. This prop is
 *    required.
 */
export default function ViewPlay(aProps) {
	/** Set to 'true' if the game is paused. */
	const [oCkPause, ouSet_CkPause] = useState(false);
	/** The selection within the board, or 'null' if there is no selection. */
	const [oSel, ouSet_Sel] = useState(null);

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
		aProps.uDispatStApp(StApp.Views.Setup);
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

	/** Returns 'true' if the specified board position can be selected or
	 *  unselected. */
	function ouCkEnab(aPos) {
		return !oSel || oSel.uCkAddAt(aPos) || !!oSel.SelsByPos.uGet(aPos);
	}

	/** Toggles the die selection at the specified board position. */
	function ouTog_Die(aPos) {
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
	}

	/** Clears the board selection. */
	function ouClear_Sel() {
		ouSet_Sel(null);
	}

	/** Records the board selection as an entry. */
	function ouEnt_Sel() {
		ouSet_Sel(null);
	}

	return (
		<div id="ViewPlay">
			<h1>Ogle</h1>

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
	uDispatStApp: PropTypes.func.isRequired,
	Setup: PropTypes.instanceOf(tSetup).isRequired,
	Board: PropTypes.instanceOf(tBoard).isRequired
};
