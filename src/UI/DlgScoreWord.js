// DlgScoreWord.js
// ===============
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import DlgScoreWord from "./DlgScoreWord.js";
//

import "./DlgScoreWord.css";
import { tBoard } from "../Board/Board.js";
import { tScoreWord, StatsWord } from "../Round/ScoreWord.js";
import LookBoard from "./LookBoard.js";
import Btn from "./Btn.js";
import DlgHelp from "./DlgHelp.js";

import React, { useState } from "react";
import PropTypes from "prop-types";

// DlgScoreWord
// ------------

DlgScoreWord.propTypes = {
	Board: PropTypes.instanceOf(tBoard).isRequired,
	ScoreWord: PropTypes.instanceOf(tScoreWord).isRequired,
	uHandOK: PropTypes.func.isRequired
};

/** The Word Score dialog, to be displayed when a word entry is clicked in the
 *  Score view. The following props are supported:
 *
 *  - Board: A tBoard instance representing the board to be displayed. This prop
 *    is required;
 *
 *  - ScoreWord: A tScoreWord instance representing the word entry to be
 *    displayed. This prop is required;
 *
 *  - uHandOK: The handler to be invoked when the OK button is clicked, or when
 *    the user clicks outside the dialog. This prop is required.
 */
export default function DlgScoreWord(aProps) {
	const oTextEnt = aProps.ScoreWord.Ent.uTextAll();
	const oURL = "https://en.wiktionary.org/wiki/" + oTextEnt;

	const oTextInstructWik = aProps.ScoreWord.CkWordUser
		? "User-entered"
		: "Click for Wiktionary";

	function ouTextPoint(aCkUser) {
		const oStat = aCkUser
			? aProps.ScoreWord.StatUser
			: aProps.ScoreWord.StatOgle;
		return (oStat === StatsWord.Score) ? 1 : 0;
	}

	function ouLblPoint(aCkUser) {
		const oStat = aCkUser
			? aProps.ScoreWord.StatUser
			: aProps.ScoreWord.StatOgle;
		return (oStat === StatsWord.Score) ? "point" : "points";
	}

	function ouTextStat(aCkUser) {
		const oStat = aCkUser
			? aProps.ScoreWord.StatUser
			: aProps.ScoreWord.StatOgle;
		switch (oStat) {
			case StatsWord.Miss: return "missed";
			case StatsWord.Follow: return "followed";
			case StatsWord.Score: return "scored";
		}
	}

	// Help
	// ----
	// This resembles the help implementation in the Play view. If we decide to
	// display the help from other views or dialogs, we might consider moving it
	// to an HOC, but the timer pause functionality in that view is not something
	// I want to mess with.

	/** Set to `true` if the Help dialog should be displayed. */
	const [ oCkHelp, ouSet_CkHelp ] = useState(false);

	/** Prevents the specified event from being bubbled or captured after this
	 *  handler. */
	function ouStopProp(aEvt) {
		aEvt.stopPropagation();
	}

	/** Handles the Help button click in this dialog. */
	function ouHandHelp(aEvt) {
		ouSet_CkHelp(true);
	}

	/** Handles the OK button click in the Help dialog. */
	function ouHandOKHelp(aEvt) {
		ouSet_CkHelp(false);
	}

	function ouDlgHelp() {
		if (!oCkHelp) return;

		return (
			<DlgHelp uHandOK={ouHandOKHelp} />
		);
	}

	// We will assign `uHandOK` to the 'scrim' container, so the user can close
	// the dialog by clicking the background. We must stop propagation in the
	// dialog itself, to prevent dialog clicks from bubbling up to the scrim. We
	// can move that functionality to a dialog class, if it comes to be needed
	// elsewhere. Right now, all the other dialogs require input before they are
	// dismissed:
	return <>
		<div className="ScrimDlg" onClick={aProps.uHandOK}>
			<div id="DlgScoreWord" className="Dlg" onClick={ouStopProp}>
				<div id="BoxWik">
					<a id="BtnWik" className="BtnLink" href={oURL} target="_blank"
						rel="noopener noreferrer">
						{oTextEnt}
					</a>

					<label id="InstructWik">
						{oTextInstructWik}
					</label>
				</div>

				<LookBoard Board={aProps.Board} Ent={aProps.ScoreWord.Ent} />

				<div id="BoxScoreBtns">
					<div id="BoxScore">
						<article className="BoxStatUser">
							<label>Player</label>
							<var>{ouTextStat(true)}</var>
							<label>{ouTextPoint(true)} {ouLblPoint(true)}</label>
						</article>

						<article id="BoxLen">
							<var>{oTextEnt.length}</var>
							<label>Letters</label>
						</article>

						<article className="BoxStatOgle">
							<label>Ogle</label>
							<var>{ouTextStat(false)}</var>
							<label>{ouTextPoint(false)} {ouLblPoint(false)}</label>
						</article>
					</div>

					<div className="Btns">
						<Btn id="BtnHelp" onClick={ouHandHelp}>Help</Btn>
						<Btn id="BtnOK" className="Group" onClick={aProps.uHandOK}>OK</Btn>
					</div>
				</div>
			</div>
		</div>
		{ouDlgHelp()}
	</>;
}
