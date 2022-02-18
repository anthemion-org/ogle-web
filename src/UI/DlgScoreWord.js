// DlgScoreWord.js
// ---------------
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

import React from "react";
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
 *  ~ Board: A tBoard instance representing the board to be displayed. This prop
 *    is required;
 *
 *  ~ ScoreWord: A tScoreWord instance representing the word entry to be
 *    displayed. This prop is required;
 *
 *  ~ uHandOK: The handler to be invoked when the OK button is clicked. This
 *    prop is required.
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

	return (
		<div className="ScrimDlg">
			<div id="DlgScoreWord" className="Dlg">
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

					<div className="Btns Ctr">
						<Btn id="BtnOK" onClick={aProps.uHandOK}>
							<div>OK</div>
						</Btn>
					</div>
				</div>
			</div>
		</div>
	);
}
