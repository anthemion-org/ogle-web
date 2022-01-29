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
import StsApp from "../StsApp.js";
import { tSetup } from "../Round/Setup.js";
import { tBoard } from "../Board/Board.js";
import { tEntWord } from "../Round/EntWord.js";
import { tCard } from "../Round/Card.js";
import LookBoard from "./LookBoard.js";
import Lex from "../Search/Lex.js";
import Sound from "../Sound.js";
import * as Store from "../Store.js";
import * as Cfg from "../Cfg.js";

import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";

let oDefNext = -100;

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
		aProps.CardUserRest || tCard.suNew()
	);
	/** Set to 'true' if play is paused. */
	const [oCkPause, ouSet_CkPause] = useState(false);
	/** Set to 'true' if a word is being verified. */
	const [oCkVerWord, ouSet_CkVerWord] = useState(false);
	/** The elapsed play time, in milliseconds. */
	const [oTimeElap, ouSet_TimeElap] = useState(aProps.TimeElapRest || 0);
	/** The UNIX time of the last tick, in milliseconds. */
	const [oTimeTickLast, ouSet_TimeTickLast] = useState(0);

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

				ouSet_CkPause(o => !o);
			}
		}

		document.addEventListener("keydown", ouHand);

		return () => {
			document.removeEventListener("keydown", ouHand);
		}
	}
	useEffect(ouListen_Keys, [oCkVerWord]);

	// Timer management
	// ----------------

	const oPerTimer = 25;

	function ouStart_Timer() {
		function ouExec() {
			ouSet_TimeElap(aTime => aTime + oPerTimer);
		}

		let oIDTimer = null;
		if (oBoard && !oCkPause && !oCkVerWord)
			oIDTimer = setInterval(ouExec, oPerTimer);

		return () => {
			if (oIDTimer !== null) clearInterval(oIDTimer);
		}
	}
	useEffect(ouStart_Timer, [oBoard, oCkPause, oCkVerWord]);

	function ouStore_TimeElap() {
		if ((oTimeElap % 1000) < oPerTimer)
			Store.uSet("TimeElap", oTimeElap);
	}
	useEffect(ouStore_TimeElap, [oTimeElap]);

	function ouPlay_Tick() {
		// This tick timing has caused a lot of frustration, just like it did in the
		// desktop app. Timers are reasonably accurate, over the long run, but they
		// aren't precise, and that lack is very obvious when they are used to play
		// audio.
		//
		// I tried another design that used looping WAV files that were padded with
		// silence to produce the desired periods:
		//
		//   https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loop
		//
		// That implementation is found in the 'loop_tick_audio' branch. It improved
		// the audio timing precision, but I did not see an easy way to handle the
		// transition from one loop period to another.
		//
		// This design is reasonably precise, as long as oPerTimer isn't more than
		// 25ms, but that produces very rapid changes to the oTimeElap state
		// variable. We will keep it for now.

		const oTimeRemain = uTimeRemain(aProps.Setup, oCardUser.CtBonusTime,
			oTimeElap);

		const oNow = Date.now();
		const oSince = oNow - oTimeTickLast;
		const oPerTick = (oTimeRemain < 10000) ? 250 : 500;
		// Not only does 'setInterval' fire late, it often fires early, which then
		// causes the audio to play an extra oPerTimer later if this is checked with
		// the more obvious 'oSince >= oPerTick'. This approach allows the tick to
		// play early, but it limits the inaccuracy to half of oPerTimer in either
		// direction:
		if (oSince > (oPerTick / 2)) {
			// I don't think this counts as a side effect, since this app never
			// queries the audio system state. That could change, however:
			Sound.uTick();
			ouSet_TimeTickLast(oNow + oPerTick);
		}
	}
	useEffect(ouPlay_Tick, [oTimeElap, oTimeTickLast, oCardUser.CtBonusTime,
		aProps.Setup]);

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
		ouSet_CkPause(true);
	}

	/** Handles the Resume button click. */
	function ouHandResume(aEvt) {
		ouSet_CkPause(false);
	}

	/** Handles the End Round button click. */
	function ouHandEnd(aEvt) {
		aProps.uUpd_StApp(StsApp.Setup);
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

	// Word Verification dialog
	// ------------------------

	/** Handles the Word Verification 'Add' button click. */
	function ouHandVerWordAdd(aEvt) {
		const oText = oEntUser.uTextAll();
		Lex.uAdd_WordUser(oText);
		ouRecord_Ent();

		ouSet_CkVerWord(false);
	}

	/** Handles the Word Verification 'Cancel' button click. */
	function ouHandVerWordCancel(aEvt) {
		ouSet_EntUser(null);
		ouSet_CkVerWord(false);
	}

	/** Returns the Word Verification dialog, or 'null' if no word is being
	 *  verified. */
	function ouDlgVerWord() {
		if (!oCkVerWord || !oEntUser) return null;

		const oTextEnt = oEntUser.uTextAll();
		const oURL = "https://en.wiktionary.org/wiki/" + oTextEnt;

		return (
			<div className="ScreenDlg">
				<div id="DlgVerWord">
					<div id="BoxWik">
						This word is not found in the Ogle lexicon:

						<a className="Btn" href={oURL} target="_blank"
							rel="noopener noreferrer">
							{oTextEnt}
						</a>

						Click for Wiktionary entry.
					</div>

					<hr />

					All English words are valid, with these exceptions:

					<ul>
						<li>
							No <em>person</em>, <em>place</em>, <em>organization</em>, or <em>brand</em> names. Words like <em>Frisbee</em> and <em>Judas</em> that have been genericized or repurposed are acceptable.
						</li>
						<li>
							No <em>abbreviations</em> or <em>acronyms</em>. Words like <em>abend</em> and <em>snafu</em> that are no longer understood as abbreviations are acceptable.
						</li>
						<li>
							No words requiring <em>accents</em> or <em>punctuation</em>, including <em>contractions</em> and <em>hyphenated</em> words.
						</li>
					</ul>

					<div className="Btns">
						<button onClick={ouHandVerWordAdd}>
							Add to lexicon
						</button>
						<button className="Group" onClick={ouHandVerWordCancel}>
							Cancel entry
						</button>
					</div>
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

		if (!Lex.uCkKnown(oText)) {
			ouSet_CkVerWord(true);
			return;
		}

		ouSet_CardUser(aCard => {
			// We could change uAdd to return a new tCard instance, but
			// suFromSelsBoard would become even slower than it is now:
			const oCardNew = aCard.uClone();
			oCardNew.uAdd(oEntUser);
			return oCardNew;
		});

		ouSet_EntUser(null);
	}

	function ouStore_CardUser() {
		Store.uSet("CardUser", oCardUser);
	}
	useEffect(ouStore_CardUser, [oCardUser]);

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
						<button id="BtnPause" onClick={ouHandPause}>
							<div id="Time">
								{ouTextTimeRemain()}
							</div>
							Seconds
						</button>

						Press to pause
					</div>

					<div id="BoxSetup">
						<div>
							<h3>Yield</h3>
							<div>{oCardOgle ? oCardOgle.Ents.length : "???"}</div>
						</div>
						<hr />
						<div>
							<h3>Pace</h3>
							<div>{aProps.Setup.uTextShortPace()}</div>
						</div>
					</div>

					<div id="BoxScore">
						<button id="BtnEnt" onClick={ouRecord_Ent}>
							<div id="Score">
								{oCardUser.Score ?? 0}
							</div>
							Score
						</button>
						Press to enter selection
					</div>
				</div>

				{ouDlgPause()}
				{ouDlgVerWord()}
			</div>
		</div>
	);
}

ViewPlay.propTypes = {
	StApp: PropTypes.string.isRequired,
	uUpd_StApp: PropTypes.func.isRequired,
	Setup: PropTypes.instanceOf(tSetup).isRequired,
	Board: PropTypes.instanceOf(tBoard)
};

function uTimeRemain(aSetup, aCtBonus, aTimeElap) {
	const oTimeAllow = (aSetup.PaceStart + (aSetup.PaceBonus * aCtBonus)) * 1000;
	return oTimeAllow - aTimeElap;
}
