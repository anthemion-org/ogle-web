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
import LookBoard from "./LookBoard.js";

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
	const [oCkPause, ouSet_CkPause] = useState(false);

	function ouHandPause(aEvt) {
		ouSet_CkPause(true);
	}

	function ouHandResume(aEvt) {
		ouSet_CkPause(false);
	}

	function ouHandEnd(aEvt) {
		aProps.uDispatStApp(StApp.Views.Setup);
	}

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

	return (
		<div id="ViewPlay">
			<h1>Ogle</h1>

			<LookBoard Board={aProps.Board} />

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
