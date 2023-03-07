// ViewPlay.js
// ===========
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
import * as Setup from "../Round/Setup.js";
import { tBoard } from "../Board/Board.js";
import * as EntWord from "../Round/EntWord.js";
import { tCard } from "../Round/Card.js";
import LookBoard from "./LookBoard.js";
import DlgHelp from "./DlgHelp.js";
import DlgVerWord from "./DlgVerWord.js";
import Lex from "../Search/Lex.js";
import Feed from "../Feed.js";
import { uSelSetup } from "../Store/SliceSets.js";
import * as Persist from "../Persist.js";
import * as Const from "../Const.js";

import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";

// ViewPlay
// --------

ViewPlay.propTypes = {
	StApp: PropTypes.string.isRequired,
	uUpd_StApp: PropTypes.func.isRequired
};

/** Implements the Play view, which displays the board, accepts user word
 *  entries, and manages the timer during play. Aside from the usual `View`
 *  props, no props are supported. */
export default function ViewPlay(aProps) {
	/** The time remaining, in milliseconds, when the user is considered to be low
	 *  on time. */
	//
	// I want the fast ticking to start at ten seconds, but the displayed time is
	// rounded up, so eleven seconds better matches that output:
	const oTimeRemainLow = 11000;

	const ouDispatch = useDispatch();
	/** A Setup record that configures the current round. */
	const oSetup = useSelector(uSelSetup);

	/** A `tBoard` instance representing the board that is being played, or `null`
	 *  if the board has not been generated yet. */
	const [oBoard, ouSet_Board] = useState(() => uBoardInit());
	/** A `tCard` instance representing the Ogle scorecard, or `null` if the board
	 *  has not been generated yet. */
	const [oCardOgle, ouSet_CardOgle] = useState(() => uCardOgleInit());
	/** An EntWord record representing the user's current board selection, or
	 *  `null` if there is no selection. */
	const [oEntUser, ouSet_EntUser] = useState(null);
	/** A `tCard` instance representing the user scorecard. */
	const [oCardUser, ouSet_CardUser] = useState(() => uCardUserInit());
	/** A `StsPlay` value representing the current play state. */
	const [oStPlay, ouSet_StPlay] = useState(() => uStPlayInit());
	/** Set to `true` if a word is being verified. */
	const [oCkVerWord, ouSet_CkVerWord] = useState(false);
	/** The elapsed play time, in milliseconds. */
	const [oTimeElap, ouSet_TimeElap] = useState(() => uTimeElapInit());
	/** Set to `true` if the Pause button should blink to show that time is low. */
	const [oCkBlinkPause, ouSet_CkBlinkPause] = useState(false);

	// Keyboard input
	// --------------

	/** Adds a `keydown` listener that handles key presses. Returns a function
	 *  that removes that listener. */
	function ouMan_ListenKeydown() {
		function ouHand(aEvt) {
			switch (aEvt.code) {
				// Close the displayed dialog, if there is one, and resume the game:
				case "Escape": {
					if (oCkVerWord) {
						ouSet_CkVerWord(false);
						return;
					}
					ouSet_StPlay(StsPlay.Play);
					break;
				}
			}
		}
		document.addEventListener("keydown", ouHand);

		return () => {
			document.removeEventListener("keydown", ouHand);
		}
	}
	useEffect(ouMan_ListenKeydown, [oCkVerWord]);

	// Window focus management
	// -----------------------

	/** Adds a `visibilitychange` listener that pauses play when the browser
	 *  window loses focus. Returns a function that removes that listener. */
	function ouMan_ListenFocus() {
		function ouHand(aEvt) {
			if (document.hidden && (oStPlay === StsPlay.Play) && !oCkVerWord)
				ouSet_StPlay(StsPlay.Pause);
		}
		// Unlike Chrome, Firefox does not fire this event when the browser window
		// loses focus after Alt+Tab in Windows, or when another window is clicked
		// in the task bar. I'm not worried about it:
		//
		//   https://stackoverflow.com/questions/28993157/visibilitychange-event-is-not-triggered-when-switching-program-window-with-altt
		//
		document.addEventListener("visibilitychange", ouHand);

		return () => {
			document.removeEventListener("visibilitychange", ouHand);
		}
	}
	useEffect(ouMan_ListenFocus, [oStPlay, oCkVerWord]);

	// Timer management
	// ----------------

	/** The tick timer period, in milliseconds. */
	const oPerTimer = 1000;

	/** Starts a timer that advances the elapsed time, if the play state warrants
	 *  it. Returns a function that stops that timer, if one was started. */
	function ouMan_Timer() {
		/** The timer work function, which advances the elapsed time. */
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
	useEffect(ouMan_Timer, [oBoard, oStPlay, oCkVerWord]);

	/** Stores the elapsed time. */
	function ouStore_TimeElap() {
		Persist.uSet("TimeElap", oTimeElap);
	}
	useEffect(ouStore_TimeElap, [oTimeElap]);

	/** Checks the play state and the elapsed time, and:
	 *
	 *  - Runs or stops the tick loop;
	 *
	 *  - Updates the Pause button blink state;
	 *
	 *  - Advances the app state;
	 *
	 * as appropriate. */
	function ouMan_FeedAndStApp() {
		// The tick timing has caused a lot of frustration, just like it did in the
		// desktop app. JavaScript timers aren't any more precise than Windows
		// timers, and that lack is very obvious when they are used to play audio.
		//
		// I tried a number of designs that manage the tick timing here, in the
		// effect, but none worked well. This approach delegates timing to the
		// `Feed` class, which is much easier than managing that state here.

		if (!oBoard || (oStPlay !== StsPlay.Play) || oCkVerWord) {
			ouSet_CkBlinkPause(false);
			Feed.uStop_Tick();
			return;
		}

		const oTimeRemain = uTimeRemain(oSetup, oCardUser.CtBonusTime, oTimeElap);
		if (oTimeRemain < 1) {
			Feed.uStop_Tick();
			aProps.uUpd_StApp(StsApp.Score);
			return;
		}

		if (oTimeRemain < oTimeRemainLow) {
			ouSet_CkBlinkPause(true);
			Feed.uLoopFast_Tick();
		}
		else {
			ouSet_CkBlinkPause(false);
			Feed.uLoopSlow_Tick();
		}

		// Note that we cannot return a clean-up function; doing so would cause the
		// tick loop to stop and restart arbitrarily, disrupting its timing. The
		// loop must be stopped manually before the Score view is displayed. It is
		// already stopped when play is paused, so there is no need to do that when
		// quitting play early.
	}
	useEffect(ouMan_FeedAndStApp, [aProps, oSetup, oBoard, oStPlay, oCkVerWord,
		oCardUser.CtBonusTime, oTimeElap]);

	// Board generation
	// ----------------

	/** Creates and runs a `WorkSearch` web worker, which creates a board matching
	 *  the user's setup choices, then stores the board and the corresponding Ogle
	 *  scorecard. Does nothing if the board has already been created. */
	function ouCreate_WorkSearch() {
		if (oBoard) return;

		const Work = new Worker(new URL("../Search/WorkSearch.js",
			import.meta.url));

		Work.postMessage({
			WordsSearch: Lex.WordsSearch,
			Setup: oSetup
		});

		Work.onmessage = function (aMsg) {
			if (!aMsg.data.Board) {
				aProps.uUpd_StApp(StsApp.Sets);
				return;
			}

			ouSet_Board(tBoard.suFromPlain(aMsg.data.Board));
			ouSet_CardOgle(tCard.suFromPlain(aMsg.data.CardOgle));
		};
	}
	useEffect(ouCreate_WorkSearch, [aProps, oSetup, oBoard]);

	/** Stores the board and the associated Ogle scorecard. */
	function ouStore_Board() {
		Persist.uSet("Board", oBoard);
		Persist.uSet("CardOgle", oCardOgle);
	}
	useEffect(ouStore_Board, [oBoard, oCardOgle]);

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

	/** Returns the Pause dialog, or `null` if the game is not paused. */
	function ouDlgPause() {
		if (oStPlay !== StsPlay.Pause) return null;

		return (
			<div className="ScrimDlg">
				<div id="DlgPause" className="Dlg">
					<p>
						Your game is paused
					</p>

					<div className="Btns">
						<Btn onClick={ouHandEnd}>End round</Btn>
						<Btn onClick={ouHandResume}>Resume</Btn>
					</div>
				</div>
			</div>
		);
	}

	// Help
	// ----

	/** Handles the Help button click in this dialog. */
	function ouHandHelp(aEvt) {
		ouSet_StPlay(StsPlay.Help);
	}

	/** Handles the OK button click in the Help dialog. */
	function ouHandOKHelp(aEvt) {
		ouSet_StPlay(StsPlay.Play);
	}

	function ouDlgHelp() {
		if (oStPlay !== StsPlay.Help) return;

		return (
			<DlgHelp uHandOK={ouHandOKHelp} />
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

	/** Returns the End Confirmation dialog, or `null` if the user has not asked
	 *  to end the round. */
	function ouDlgConfirmEnd() {
		if (oStPlay !== StsPlay.ConfirmEnd) return null;

		return (
			<div className="ScrimDlg">
				<div id="DlgConfirmEnd" className="Dlg">
					<p>
						Are you sure you want<br />to end this round?
					</p>

					<div className="Btns">
						<Btn onClick={ouHandYesConfirmEnd}>End</Btn>
						<Btn onClick={ouHandNoConfirmEnd}>Resume</Btn>
					</div>
				</div>
			</div>
		);
	}

	// Word Verification dialog
	// ------------------------

	/** Handles the Word Verification Add button click. */
	function ouHandAddVerWord(aEvt) {
		const oText = EntWord.uTextAll(oEntUser);
		Lex.uAdd_WordUser(oText);
		ouRecord_Ent();

		ouSet_CkVerWord(false);
	}

	/** Handles the Word Verification Cancel button click. */
	function ouHandCancelVerWord(aEvt) {
		ouSet_EntUser(null);
		ouSet_CkVerWord(false);
	}

	/** Returns the Word Verification dialog, or `null` if no word is being
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

	/** Returns `true` if the specified board position can be selected or
	 *  unselected. */
	function ouCkEnab(aPos) {
		return !oEntUser || EntWord.uCkTogAt(oEntUser, aPos);
	}

	/** Toggles the die selection at the specified board position. */
	function ouTog_Die(aPos) {
		if (!oBoard || !ouCkEnab(aPos)) return;

		// Start new entry:
		if (!oEntUser) {
			const oText = oBoard.uDie(aPos).Text;
			const oEntNew = EntWord.uFromPosText(aPos, oText);
			ouSet_EntUser(oEntNew);
			Feed.uSelDie();
			return;
		}

		// Truncate existing entry:
		if (EntWord.uCkAt(oEntUser, aPos)) {
			const oEntPrev = EntWord.uClonePrev(oEntUser, aPos);
			ouSet_EntUser(oEntPrev);
			Feed.uUnselDie();
			return;
		}

		// Extend existing entry:
		const oText = oBoard.uDie(aPos).Text;
		const oEntAdd = EntWord.uFromPosText(aPos, oText, oEntUser);
		ouSet_EntUser(oEntAdd);
		Feed.uSelDie();
	}

	/** Clears the board selection. */
	function ouClear_Ent() {
		ouSet_EntUser(null);
		Feed.uUnselDie();
	}

	/** Records the board selection as a word entry. */
	function ouRecord_Ent() {
		// There is no selection:
		if (!oEntUser) {
			// I was playing the 'unselect' feedback here and also when the selection
			// was too short to be entered:
			//
			//   Feed.uUnselDie();
			//
			// However, it was necessary to remove the `preventDefault` calls from the
			// mouse and pointer event handlers, and that caused the unselect sound
			// and the entry sound to be played together when a word was entered,
			// unless the left mouse button happened to be down when the right was
			// pressed. I don't care much about audio feedback in this event, so we
			// will skip it for now. See the comments in `LookDie.js` for more on
			// this:
			return;
		}

		// The selection is too short:
		const oText = EntWord.uTextAll(oEntUser);
		if (oText.length < Const.LenWordMin) {
			return;
		}

		// The word is not recognized:
		if (!Lex.uCkKnown(oText)) {
			ouSet_CkVerWord(true);
			Feed.uEntInval();
			return;
		}

		// The word is recognized:
		ouSet_CardUser(aCard => {
			// We could change `uAdd` to return a new `tCard` instance, but
			// `suFromSelsBoard` would become even slower than it is now:
			const oCardNew = aCard.uClone();
			const oCkVal = oCardNew.uAdd(oEntUser);

			if (oCkVal) Feed.uEntVal();
			else Feed.uEntInval();

			return oCardNew;
		});

		ouSet_EntUser(null);
	}

	/** Stores the user scorecard. */
	function ouStore_CardUser() {
		Persist.uSet("CardUser", oCardUser);
	}
	useEffect(ouStore_CardUser, [oCardUser]);

	// View content
	// ------------

	/** Returns entry box content. */
	function ouContBoxEnt() {
		if (oEntUser) return (
			<div id="TextEnt">
				{EntWord.uTextAll(oEntUser)}
			</div>
		);

		return (
			<>
				<div id="TextInstruct">
					Enter words of <em>four or more letters</em> before time runs out.
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
			<div id="BoxWork">Working...</div>
		);
	}

	function ouClassBtnPause() {
		return oCkBlinkPause ? "Blink" : "";
	}

	function ouTextTimeRemain() {
		const oTime = uTimeRemain(oSetup, oCardUser.CtBonusTime, oTimeElap);
		return Math.ceil(oTime / 1000);
	}

	function ouCkDisabBtnScore() {
		if (!oEntUser) return true;

		const oText = EntWord.uTextAll(oEntUser);
		return (oText.length < Const.LenWordMin);
	}

	return (
		<div id="ViewPlay" className="View">
			<main>
				<section id="BoxTitle">
					<h1>Ogle</h1>
					<hr />
				</section>

				<section id="ColBoard">
					<div id="BoxEnt">
						{ouContBoxEnt()}
					</div>

					{ouLookBoard()}

					<div id="TextCtls" className="Desk">
						Left-click to select or unselect letters.
						Right-click to enter word. Middle-click to cancel.
					</div>
				</section>

				<section id="BoxTime">
					<Btn id="BtnPause" className={ouClassBtnPause()} onClick={ouHandPause}
						CkDownClick={true}>

						<div id="LblTime">
							{ouTextTimeRemain()}
						</div>
						Seconds
					</Btn>

					<div className="Desk">Click to pause</div>
					<div className="Mob">Tap to pause</div>
				</section>

				<section id="BoxSetup">
					<div>
						<div>{Setup.uTextShortPace(oSetup)}</div>
						<h3>Pace</h3>
					</div>
					<hr />
					<div>
						<div>{Setup.uTextShortYield(oSetup)}</div>
						<h3>Yield</h3>
					</div>
				</section>

				<section id="BoxScore">
					<Btn id="BtnEnt" disabled={ouCkDisabBtnScore()} onClick={ouRecord_Ent}
						CkDownClick={true} CkDisabFeedClick={true}>

						<div id="LblScore">
							{oCardUser.Score ?? 0}
						</div>
						Score
					</Btn>

					<div className="Desk">Click to enter word</div>
					<div className="Mob">Tap to enter</div>
				</section>

				{ouDlgPause()}
				{ouDlgHelp()}
				{ouDlgConfirmEnd()}
				{ouDlgVerWord()}
			</main>
		</div>
	);
}

/** Stores properties representing the play state. */
export const StsPlay = {
	// Manage the word verification state here? [design]

	Play: "Play",
	Pause: "Pause",
	Help: "Help",
	ConfirmEnd: "ConfirmEnd"
};
Object.freeze(StsPlay);

/** Returns the play time remaining, in milliseconds. */
function uTimeRemain(aSetup, aCtBonus, aTimeElap) {
	const oTimeAllow = (aSetup.PaceStart + (aSetup.PaceBonus * aCtBonus)) * 1000;
	return oTimeAllow - aTimeElap;
}

function uBoardInit() {
	return tBoard.suFromPlain(Persist.uGetPlain("Board"));
}

function uCardOgleInit() {
	return tCard.suFromPlain(Persist.uGetPlain("CardOgle"));
}

function uCardUserInit() {
	return tCard.suFromPlain(Persist.uGetPlain("CardUser")) || tCard.suNew();
}

function uStPlayInit() {
	return Persist.uGetPlain("Board") ? StsPlay.Pause : StsPlay.Play;
}

function uTimeElapInit() {
	return Persist.uGetPlain("TimeElap") || 0;
}
