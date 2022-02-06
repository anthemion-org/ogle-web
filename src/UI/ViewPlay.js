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
import Btn from "./Btn.js";
import StsApp from "../StsApp.js";
import { tSetup } from "../Round/Setup.js";
import { tBoard } from "../Board/Board.js";
import { tEntWord } from "../Round/EntWord.js";
import { tCard } from "../Round/Card.js";
import LookBoard from "./LookBoard.js";
import DlgVerWord from "./DlgVerWord.js";
import Lex from "../Search/Lex.js";
import Sound from "../Sound.js";
import * as Store from "../Store.js";
import * as Cfg from "../Cfg.js";

import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";

// ViewPlay
// --------

ViewPlay.propTypes = {
	StApp: PropTypes.string.isRequired,
	uUpd_StApp: PropTypes.func.isRequired,
	Setup: PropTypes.instanceOf(tSetup).isRequired
};

/** Implements the Play view, which displays the board, accepts user word
 *  entries, and manages the timer during play. Along with StApp and uUpd_StApp,
 *  the following props are supported:
 *
 *  ~ Setup: A tSetup instance that configures the current round. This prop is
 *    required.
 */
export default function ViewPlay(aProps) {
	/** A tBoard instance representing the board that is being played, or 'null'
	 *  if the board has not been generated yet. */
	const [oBoard, ouSet_Board] = useState(() => uBoardInit());
	/** A tCard instance representing the Ogle scorecard, or 'null' if the board
	 *  has not been generated yet. */
	const [oCardOgle, ouSet_CardOgle] = useState(() => uCardOgleInit());
	/** A tEntWord instance representing the user's current board selection, or
	 *  'null' if there is no selection. */
	const [oEntUser, ouSet_EntUser] = useState(null);
	/** A tCard instance representing the user scorecard. */
	const [oCardUser, ouSet_CardUser] = useState(() => uCardUserInit());
	/** A StsPlay value representing the current play state. */
	const [oStPlay, ouSet_StPlay] = useState(() => uStPlayInit());
	/** Set to 'true' if a word is being verified. */
	const [oCkVerWord, ouSet_CkVerWord] = useState(false);
	/** The elapsed play time, in milliseconds. */
	const [oTimeElap, ouSet_TimeElap] = useState(() => uTimeElapInit());

	// Keyboard input
	// --------------

	function ouListen_Keys() {
		function ouHand(aEvt) {
			// Close the displayed dialog, if any, or pause the game:
			if (aEvt.code === "Escape") {
				if (oCkVerWord) {
					ouSet_CkVerWord(false);
					return;
				}

				ouSet_StPlay(StsPlay.Play);
			}
		}

		document.addEventListener("keydown", ouHand);

		return () => {
			document.removeEventListener("keydown", ouHand);
		}
	}
	useEffect(ouListen_Keys, [oCkVerWord]);

	// Window focus management
	// -----------------------

	function ouListen_Keys() {
		function ouHand(aEvt) {
			if (document.hidden) ouSet_StPlay(StsPlay.Pause);
		}

		// Unlike Chrome, Firefox does not fire this event when the browser window
		// loses focus after Alt+Tab, or when another window is clicked in the task
		// bar. I'm not worried about it:
		//
		//   https://stackoverflow.com/questions/28993157/visibilitychange-event-is-not-triggered-when-switching-program-window-with-altt
		//
		document.addEventListener("visibilitychange", ouHand);

		return () => {
			document.removeEventListener("visibilitychange", ouHand);
		}
	}
	useEffect(ouListen_Keys, []);

	// Timer management
	// ----------------

	const oPerTimer = 1000;

	function ouStart_Timer() {
		function ouExec() {
			ouSet_TimeElap(aTime => aTime + oPerTimer);
		}

		let oIDTimer = null;
		if (oBoard && (oStPlay === StsPlay.Play) && !oCkVerWord)
			oIDTimer = setInterval(ouExec, oPerTimer);

		return () => {
			if (oIDTimer !== null) clearInterval(oIDTimer);
		}
	}
	useEffect(ouStart_Timer, [oBoard, oStPlay, oCkVerWord]);

	function ouStore_TimeElap() {
		Store.uSet("TimeElap", oTimeElap);
	}
	useEffect(ouStore_TimeElap, [oTimeElap]);

	function ouMonit_TimeRemain() {
		// This tick timing has caused a lot of frustration, just like it did in the
		// desktop app. JavaScript timers aren't any more precise than Windows
		// timers, and that lack is very obvious when they are used to play audio.
		//
		// I tried a number of designs that manage the tick timing here, in the
		// effect, but none of them worked well. This approach delegates timing to
		// the Sound class, which is much easier than managing that state here.

		if (!oBoard || (oStPlay !== StsPlay.Play) || oCkVerWord) {
			Sound.uStop_Tick();
			return;
		}

		const oTimeRemain = uTimeRemain(aProps.Setup, oCardUser.CtBonusTime,
			oTimeElap);
		if (oTimeRemain < 1) {
			Sound.uStop_Tick();
			aProps.uUpd_StApp(StsApp.Score);
			return;
		}

		// I want the fast ticking to start at ten seconds, but the displayed time
		// is rounded up, so eleven seconds better matches that output:
		if (oTimeRemain < 11000) Sound.uLoopFast_Tick();
		else Sound.uLoopSlow_Tick();

		// Note that we cannot return a clean-up function; doing so would cause the
		// tick loop to stop and restart arbitrarily, disrupting its timing. The
		// loop must be stopped manually before the Score view is displayed. It is
		// already stopped when play is paused, so there is no need to do that when
		// quitting play early.
	}
	useEffect(ouMonit_TimeRemain, [aProps, aProps.Setup, oBoard, oStPlay,
		oCkVerWord, oCardUser.CtBonusTime, oTimeElap]);

	// Board generation
	// ----------------

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
	useEffect(ouCreate_WorkSearch, [aProps.Setup, oBoard]);

	function ouStore_Board() {
		Store.uSet("Board", oBoard);
		Store.uSet("CardOgle", oCardOgle);
	}
	useEffect(ouStore_Board, [oBoard, oCardOgle]);

	// Help
	// ----

	/** Handles the Help button click. */
	function ouHandHelp(aEvt) {
	}

	// Pause dialog
	// ------------

	/** Handles the Pause button click. */
	function ouHandPause(aEvt) {
		ouSet_StPlay(StsPlay.Pause);
	}

	/** Handles the Resume button click. */
	function ouHandResume(aEvt) {
		ouSet_StPlay(StsPlay.Play);
	}

	/** Handles the End Round button click. */
	function ouHandEnd(aEvt) {
		ouSet_StPlay(StsPlay.ConfirmEnd);
	}

	/** Returns the Pause dialog, or 'null' if the game is not paused. */
	function ouDlgPause() {
		if (oStPlay !== StsPlay.Pause) return null;

		return (
			<div className="ScreenDlg">
				<div id="DlgPause">
					<header>
						Your game is paused
					</header>

					<div className="Btns">
						<Btn onClick={ouHandEnd}>End round</Btn>
						<Btn onClick={ouHandResume}>Resume</Btn>
					</div>
				</div>
			</div>
		);
	}

	// End Confirmation dialog
	// -----------------------

	/** Handles the End Confirmation dialog Yes button click. */
	function ouHandYesConfirmEnd(aEvt) {
		aProps.uUpd_StApp(StsApp.Score);
	}

	/** Handles the End Confirmation dialog No button click. */
	function ouHandNoConfirmEnd(aEvt) {
		ouSet_StPlay(StsPlay.Play);
	}

	/** Returns the End Confirmation dialog, or 'null' if the user has not asked
	 *  to end the round. */
	function ouDlgConfirmEnd() {
		if (oStPlay !== StsPlay.ConfirmEnd) return null;

		return (
			<div className="ScreenDlg">
				<div id="DlgConfirmEnd">
					<header>
						Are you sure you want<br />to end this round?
					</header>

					<div className="Btns">
						<Btn onClick={ouHandYesConfirmEnd}>Yes</Btn>
						<Btn onClick={ouHandNoConfirmEnd}>No</Btn>
					</div>
				</div>
			</div>
		);
	}

	// Word Verification dialog
	// ------------------------

	/** Handles the Word Verification 'Add' button click. */
	function ouHandAddVerWord(aEvt) {
		const oText = oEntUser.uTextAll();
		Lex.uAdd_WordUser(oText);
		ouRecord_Ent();

		ouSet_CkVerWord(false);
	}

	/** Handles the Word Verification 'Cancel' button click. */
	function ouHandCancelVerWord(aEvt) {
		ouSet_EntUser(null);
		ouSet_CkVerWord(false);
	}

	/** Returns the Word Verification dialog, or 'null' if no word is being
	 *  verified. */
	function ouDlgVerWord() {
		if (!oCkVerWord || !oEntUser) return null;

		return (
			<DlgVerWord Ent={oEntUser} uHandAdd={ouHandAddVerWord}
				uHandCancel={ouHandCancelVerWord} />
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

		// Start new entry:
		if (!oEntUser) {
			const oText = oBoard.uDie(aPos).Text;
			const oEntNew = tEntWord.suFromPosText(aPos, oText);
			ouSet_EntUser(oEntNew);
			Sound.uSelDie();
			return;
		}

		// Truncate existing entry:
		if (oEntUser.uCkAt(aPos)) {
			const oEntPrev = oEntUser.uClonePrev(aPos);
			ouSet_EntUser(oEntPrev);
			Sound.uUnselDie();
			return;
		}

		// Extend existing entry:
		const oText = oBoard.uDie(aPos).Text;
		const oEntAdd = tEntWord.suFromPosText(aPos, oText, oEntUser);
		ouSet_EntUser(oEntAdd);
		Sound.uSelDie();
	}

	/** Clears the board selection. */
	function ouClear_Ent() {
		ouSet_EntUser(null);
		Sound.uUnselDie();
	}

	/** Records the board selection as a word entry. */
	function ouRecord_Ent() {
		// There is no selection:
		if (!oEntUser) {
			Sound.uUnselDie();
			return;
		}

		// The selection is too short:
		const oText = oEntUser.uTextAll();
		if (oText.length < Cfg.LenWordMin) {
			Sound.uUnselDie();
			return;
		}

		// The word is not recognized:
		if (!Lex.uCkKnown(oText)) {
			ouSet_CkVerWord(true);
			Sound.uEntInval();
			return;
		}

		// The word is recognized:
		ouSet_CardUser(aCard => {
			// We could change uAdd to return a new tCard instance, but
			// suFromSelsBoard would become even slower than it is now:
			const oCardNew = aCard.uClone();
			const oCkVal = oCardNew.uAdd(oEntUser);

			if (oCkVal) Sound.uEntVal();
			else Sound.uEntInval();

			return oCardNew;
		});

		ouSet_EntUser(null);
	}

	function ouStore_CardUser() {
		Store.uSet("CardUser", oCardUser);
	}
	useEffect(ouStore_CardUser, [oCardUser]);

	// View content
	// ------------

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
				<Btn id="BtnHelp" onClick={ouHandHelp}>Help</Btn>
			</>
		);
	}

	function ouLookBoard() {
		const oCkPause = (oStPlay !== StsPlay.Play) || oCkVerWord;
		if (oBoard) return (
			<LookBoard Board={oBoard} Ent={oEntUser} CkPause={oCkPause}
				uCallTog={ouTog_Die} uCallClear={ouClear_Ent}
				uCallRecord={ouRecord_Ent} />
		);

		return (
			<div id="BoxWait">Working...</div>
		);
	}

	function ouTextTimeRemain() {
		const oTime = uTimeRemain(aProps.Setup, oCardUser.CtBonusTime, oTimeElap);
		return Math.ceil(oTime / 1000);
	}

	function ouCkDisabBtnScore() {
		const oText = oEntUser?.uTextAll();
		return !oText || (oText.length < Cfg.LenWordMin);
	}

	return (
		<div id="ViewPlay">
			<h1>Ogle</h1>

			<main>
				<section id="ColBoard">
					<div id="BoxEnt">
						{ouContBoxEnt()}
					</div>

					{ouLookBoard()}

					<div id="TextCtls">
						Left-click to select letters. Click again to unselect.
						Right-click to enter word. Middle-click to clear.
					</div>
				</section>

				<section id="ColStat">
					<section id="BoxTime">
						<Btn id="BtnPause" onClick={ouHandPause}>
							<div id="Time">
								{ouTextTimeRemain()}
							</div>
							Seconds
						</Btn>

						Press to pause
					</section>

					<section id="BoxSetup">
						<div>
							<h3>Yield</h3>
							<div>{aProps.Setup.uTextShortYield()}</div>
						</div>
						<hr />
						<div>
							<h3>Pace</h3>
							<div>{aProps.Setup.uTextShortPace()}</div>
						</div>
					</section>

					<section id="BoxScore">
						<Btn id="BtnEnt" disabled={ouCkDisabBtnScore()}
							onClick={ouRecord_Ent} CkDisabSoundClick={true}>
							<div id="Score">
								{oCardUser.Score ?? 0}
							</div>
							Score
						</Btn>
						Press to enter word
					</section>
				</section>

				{ouDlgPause()}
				{ouDlgConfirmEnd()}
				{ouDlgVerWord()}
			</main>
		</div>
	);
}

/** Stores properties representing the play state. */
export const StsPlay = {
	Play: "Play",
	Pause: "Pause",
	ConfirmEnd: "ConfirmEnd"
};
Object.freeze(StsPlay);

/** Returns the play time remaining, in milliseconds. */
function uTimeRemain(aSetup, aCtBonus, aTimeElap) {
	const oTimeAllow = (aSetup.PaceStart + (aSetup.PaceBonus * aCtBonus)) * 1000;
	return oTimeAllow - aTimeElap;
}

function uBoardInit() {
	return tBoard.suFromPOD(Store.uGetPOD("Board"));
}

function uCardOgleInit() {
	return tCard.suFromPOD(Store.uGetPOD("CardOgle"));
}

function uCardUserInit() {
	return tCard.suFromPOD(Store.uGetPOD("CardUser")) || tCard.suNew();
}

function uStPlayInit() {
	return Store.uGetPOD("Board") ? StsPlay.Pause : StsPlay.Play;
}

function uTimeElapInit() {
	return Store.uGetPOD("TimeElap") || 0;
}

