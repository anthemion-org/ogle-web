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
import LookBoard from "./LookBoard.js";
import Btn from "./Btn.js";
import { tScoreWord, StatsWord } from "../Round/ScoreWord.js";

import React from "react";
import PropTypes from "prop-types";

/** The Word Score dialog. */
export default function DlgScoreWord(aProps) {
	const oTextEnt = aProps.ScoreWord.Ent.uTextAll();
	const oURL = "https://en.wiktionary.org/wiki/" + oTextEnt;

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
		return (oStat === StatsWord.Score) ? "Point" : "Points";
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
		<div className="ScreenDlg">
			<div id="DlgScoreWord">
				<section id="BoxLen" className="Box">
					<var>{oTextEnt.length}</var>
					<label>Letters</label>
				</section>

				<section id="BoxWik" className="Box">
					<a className="Btn" href={oURL} target="_blank"
						rel="noopener noreferrer">
						{oTextEnt}
					</a>

					<label>
						Click for Wiktionary
					</label>
				</section>

				<LookBoard Board={aProps.Board} Ent={aProps.ScoreWord.Ent} />

				<section id="BoxScoreUser" className="Box">
					<article>
						<label>Player</label>
						<var>{ouTextPoint(true)}</var>
						<label>{ouLblPoint(true)}</label>
					</article>
					<var className="SideUp">
						{ouTextStat(true)}
					</var>
				</section>

				<section id="CellRightBtm">
					<div id="BoxScoreOgle" className="Box">
						<var className="SideDown">
							{ouTextStat(false)}
						</var>
						<article>
							<label>Ogle</label>
							<var>{ouTextPoint(false)}</var>
							<label>{ouLblPoint(false)}</label>
						</article>
					</div>

					<Btn className="Group" onClick={aProps.uHandOK}>OK</Btn>
				</section>
			</div>
		</div>
	);
}

DlgScoreWord.propTypes = {
	ScoreWord: PropTypes.instanceOf(tScoreWord).isRequired,
	uHandOK: PropTypes.func.isRequired
};
