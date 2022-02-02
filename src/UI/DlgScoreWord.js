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
					<div>6</div>
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
					<div className="Block">
						<label>Player</label>
						<div>{ouTextPoint(true)}</div>
						<label>{ouLblPoint(true)}</label>
					</div>
					<div className="SideUp">
						{ouTextStat(true)}
					</div>
				</section>

				<section id="ItScoreOgle">
					<div id="BoxScoreOgle" className="Box">
						<div className="Block">
							<label>Ogle</label>
							<div>{ouTextPoint(false)}</div>
							<label>{ouLblPoint(false)}</label>
						</div>
						<div className="SideDown">
							{ouTextStat(false)}
						</div>
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
