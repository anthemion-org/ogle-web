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
import { tCard } from "../Round/Card.js";
import LookBoard from "./LookBoard.js";
import Lex from "../Search/Lex.js";
import * as Store from "../Store.js";
import * as ActPlay from "./ActPlay.js";
import * as Cfg from "../Cfg.js";

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
	/** The board, or 'null' if the board has not been generated yet. */
	const [oBoard, ouSet_Board] = useState(aProps.BoardRest);
	/** The Ogle scorecard, or 'null' if the board has not been generated yet. */
	const [oCardOgle, ouSet_CardOgle] = useState(aProps.CardOgleRest);
	/** The user's current board selection, or 'null' if there is no selection. */
	const [oEntUser, ouSet_EntUser] = useState(null);
	/** The user scorecard. */
	const [oCardUser, ouSet_CardUser] = useState(o =>
		(aProps.CardUserRest || tCard.suNew())
	);
	/** The play time remaining, in seconds. */
	const [oTime, ouSet_TimentUser] = useState(100);

	useEffect(ouCreate_WorkSearch, [aProps.Setup, oBoard]);
	useEffect(ouStore_Board, [oBoard, oCardOgle]);
	useEffect(ouStore_CardUser, [oCardUser]);

	// Generate board
	// --------------

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
			ouSet_CardOgle(tCard.suFromPOD(aMsg.data.CardOgle));
		};
	}

	function ouStore_Board() {
		Store.uSet("Board", oBoard);
		Store.uSet("CardOgle", oCardOgle);
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

	// Word selection and entry
	// ------------------------

	/** Returns 'true' if the specified board position can be selected or
	 *  unselected. */
	function ouCkEnab(aPos) {
		return !oEntUser || oEntUser.uCkTogAt(aPos);
	}

	/** Toggles the die selection at the specified board position. */
	function ouTog_Die(aPos) {
		if (!oBoard || !ouCkEnab(aPos)) return;

		if (!oEntUser) {
			const oText = oBoard.uDie(aPos).Text;
			const oEntNew = tEntWord.suFromPosText(aPos, oText);
			ouSet_EntUser(oEntNew);
			return;
		}

		if (oEntUser.uCkAt(aPos)) {
			const oEntPrev = oEntUser.uEntPrev(aPos);
			ouSet_EntUser(oEntPrev);
			return;
		}

		const oText = oBoard.uDie(aPos).Text;
		const oEntAdd = tEntWord.suFromPosText(aPos, oText, oEntUser);
		ouSet_EntUser(oEntAdd);
	}

	/** Clears the board selection. */
	function ouClear_Ent() {
		ouSet_EntUser(null);
	}

	/** Records the board selection as a word entry. */
	function ouRecord_Ent() {
		if (!oEntUser) return;

		const oText = oEntUser.uTextAll();
		if (oText.length < Cfg.LenWordMin) return;

		ouSet_CardUser(oCard => {
			// We could change uAdd to return a new tCard instance, but
			// suFromSelsBoard would become even slower than it is now:
			const oCardNew = oCard.uClone();
			oCardNew.uAdd(oEntUser);
			return oCardNew;
		});
		ouSet_EntUser(null);
	}

	function ouStore_CardUser() {
		Store.uSet("CardUser", oCardUser);
	}

	// Component content
	// -----------------

	/** Returns entry box content. */
	function ouContBoxEnt() {
		let oCont;
		if (oEntUser) return (
			<div id="TextEnt">
				{oEntUser.uTextAll()}
			</div>
		);

		return (
			<>
				<div id="TextInstruct">
					Enter as many words of <em>four or more letters</em> as you can
					before time runs out.
				</div>
				<button id="BtnHelp" onClick={ouHandHelp}>Help</button>
			</>
		);
	}

	function ouLookBoard() {
		if (oBoard) return (
			<LookBoard Board={oBoard} Ent={oEntUser} uCallTog={ouTog_Die}
				uCallClear={ouClear_Ent} uCallRecord={ouRecord_Ent} />
		);

		return (
			<div>Generating board...</div>
		);
	}

	return (
		<div id="ViewPlay">
			<h1>Ogle</h1>

			<div id="Box">
				<div id="BoxBoard">
					<div id="BoxEnt">
						{ouContBoxEnt()}
					</div>

					{ouLookBoard()}

					<div id="TextCtls">
						Left-click to select letters. Click again to unselect.
						Right-click to enter word. Middle-click to clear.
					</div>
				</div>

				<div id="BoxStat">
					<div id="BoxTime">
						<div>
							<button id="BtnPause" onClick={ouHandPause}>
								<div id="Time">
									{oTime}
								</div>
								Seconds
							</button>

							Click to pause
						</div>
					</div>

					<div id="BoxOgle">
					</div>

					<div id="BoxScore">
						<button id="BtnEnt">
							<div id="Score">
								{oCardUser.Score ?? 0}
							</div>
							Score
						</button>
						Click to enter selection
					</div>
				</div>

				{ouDlgPause()}
			</div>
		</div>
	);
}

ViewPlay.propTypes = {
	StApp: PropTypes.object.isRequired,
	uUpd_StApp: PropTypes.func.isRequired,
	Setup: PropTypes.instanceOf(tSetup).isRequired,
	Board: PropTypes.instanceOf(tBoard)
};
