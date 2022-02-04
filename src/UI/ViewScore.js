// ViewScore.js
// ------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import ViewScore from "./UI/ViewScore.js";
//

import "./ViewScore.css";
import DlgScoreWord from "./DlgScoreWord.js";
import DlgNamePlay from "./DlgNamePlay.js";
import Btn from "./Btn.js";
import StsApp from "../StsApp.js";
import { tSetup } from "../Round/Setup.js";
import { tBoard } from "../Board/Board.js";
import { tScoreWord, StatsWord, uScoresCoversFromCards } from "../Round/ScoreWord.js";
import { tScorePlay, uCompareScorePlay } from "../Round/ScorePlay.js";
import * as Store from "../Store.js";
import * as Cfg from "../Cfg.js";
import * as Misc from "../Util/Misc.js";

import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";

// ViewScore
// ---------

/** Implements the Score view. Along with StApp and uUpd_StApp, the following
 *  props are supported:
 *
 *  ~ Setup: A tSetup instance for the completed round. This prop is required.
 *
 *  ~ BoardRest: A tBoard instance for the completed round.
 */
export default function ViewScore(aProps) {
	/** An array of tScorePlay instances that record high scores. */
	const [oScoresPlay, ouSet_ScoresPlay] = useState(aProps.ScoresPlayRest);
	/** Set to the tScoreWord that is being displayed in the Word Score dialog, or
	 *  'null' if no entry is being displayed. */
	const [oScoreWord, ouSet_ScoreWord] = useState(null);

	function ouStore_ScoresPlay() {
		Store.uSet("ScoresPlay", oScoresPlay);
	}
	useEffect(ouStore_ScoresPlay, [oScoresPlay]);

	// Compare player cards
	// --------------------

	/** An array of tScoreWord instances representing the words found in this
	 *  round, plus an object that associates word lengths with tCover instances. */
	const [oScores, oCoversByLen]
		= uScoresCoversFromCards(aProps.CardOgle, aProps.CardUser);

	// Keyboard input
	// --------------

	function ouListen_Keys() {
		function ouHand(aEvt) {
			// Close the displayed dialog, if any, or pause the game:
			if (aEvt.code === "Escape") {
				if (oScoreWord) {
					ouSet_ScoreWord(null);
					return;
				}
			}
		}

		document.addEventListener("keydown", ouHand);

		return () => {
			document.removeEventListener("keydown", ouHand);
		}
	}
	useEffect(ouListen_Keys, [oScoreWord]);

	// Word Score dialog
	// -----------------

	/** Handles word list item clicks. */
	function ouHandClickWord(aEvt) {
		// The 'data-idx-word' attribute is assigned to the 'tr', but a 'td' will
		// generate the click, and the event will bubble up from there:
		const oEl = aEvt.target.parentElement;
		if (oEl.dataset.idxWord) {
			const oScore = oScores[oEl.dataset.idxWord];
			ouSet_ScoreWord(oScore);
		}
	}

	/** Handles the Word Score dialog OK click. */
	function ouHandOKScoreWord(aEvt) {
		ouSet_ScoreWord(null);
	}

	function ouDlgScoreWord() {
		if (!oScoreWord) return null;

		return (
			<DlgScoreWord Board={aProps.Board} ScoreWord={oScoreWord}
				uHandOK={ouHandOKScoreWord} />
		);
	}

	// Player Name dialog
	// ------------------

	/** Returns 'true' if the completed game produced a high score that has yet to
	 *  be recorded. */
	function ouCkScoreHigh() {
		if (!oScoresPlay.length) return true;

		const oFracPerc = aProps.CardUser.Score / aProps.CardOgle.Score;

		let oCkHigh = false;
		let oCkRec = false;
		for (const oScore of oScoresPlay) {
			if (oScore.FracPerc < oFracPerc) oCkHigh = true;
			if (oScore.TimeStart === aProps.CardUser.TimeStart) oCkRec = true;
		}

		return oCkHigh && !oCkRec;
	}

	/** Handles the Player Name dialog OK click. */
	function ouHandNamePlay(aName) {
		const oFracPerc = aProps.CardUser.Score / aProps.CardOgle.Score;
		const oScore = new tScorePlay(aProps.CardUser.TimeStart, aName, oFracPerc);
		ouSet_ScoresPlay(aScores => {
			const oScores = [...aScores];
			oScores.push(oScore);
			oScores.sort(uCompareScorePlay);
			return oScores.slice(0, Cfg.CtStoreScoreHigh);
		});
	}

	function ouDlgNamePlay() {
		if (!ouCkScoreHigh()) return null;

		return (
			<DlgNamePlay ScoreUser={aProps.CardUser.Score}
				ScoreOgle={aProps.CardUser.Score} uHandName={ouHandNamePlay}/>
		);
	}

	// View content
	// ------------

	/** Handles the Setup button click. */
	function ouHandSetup(aEvt) {
		aProps.uUpd_StApp(StsApp.Setup);
	}

	/** Handles the Play Again button click. */
	function ouHandPlay(aEvt) {
		aProps.uUpd_StApp(StsApp.PlayInit);
	}

	function ouLinesScore() {
		function ouTextScore(aStat) {
			if (aStat === StatsWord.Score) return "1";
			if (aStat === StatsWord.Follow) return "0";
			return "";
		}

		const oLines = oScores.map((aScore, aj) => (
			<tr key={aScore.Text} data-idx-word={aj} onClick={ouHandClickWord}>
				<td>{ouTextScore(aScore.StatUser)}</td>
				<td>{aScore.Text}</td>
				<td>{ouTextScore(aScore.StatOgle)}</td>
			</tr>
		));
		return oLines;
	}

	function ouPerc() {
		return Math.round(aProps.CardUser.Score / aProps.CardOgle.Score * 100);
	}

	function ouLinesCover() {
		function ouHead(aLen) {
			if (aLen >= Cfg.LenCoverMax) return Cfg.LenCoverMax + "+ letters";
			return aLen + "+ letters";
		}

		function ouFrac(aLen) {
			const oData = oCoversByLen[aLen];
			if (!oData) return "";
			return oData.CtUser + "/" + oData.CtTtl;
		}

		function ouPerc(aLen) {
			const oData = oCoversByLen[aLen];
			if (!oData) return "N/A";
			return Math.round(oData.CtUser / oData.CtTtl * 100) + "%";
		}

		const oLines = [];
		for (let oLen = Cfg.LenCoverMax; oLen >= Cfg.LenWordMin; --oLen)
			oLines.push(
				<tr key={oLen}>
					<td>{ouHead(oLen)}</td><td>{ouFrac(oLen)}</td><td>{ouPerc(oLen)}</td>
				</tr>
			);
		return oLines;
	}

	function ouLinesScorePlay() {
		const oCtRow = 5;
		const oScores = oScoresPlay.slice(0, (oCtRow + 1));
		if (oScores.length < oCtRow) {
			const oBlanks = Misc.Gen_Arr((oCtRow - oScores.length), null);
			oScores.push(...oBlanks);
		}

		function ouKey(aScore, aj) {
			return aj.toString() + (aScore ? aScore.TimeStart : "");
		}

		function ouName(aScore) {
			if (!aScore) return "—";
			// Anonymous scores are stored as empty strings:
			return aScore.Name || "(anonymous)";
		}

		function ouPerc(aScore) {
			if (!aScore) return "";
			return Math.round(aScore.FracPerc * 100) + "%";
		}

		return oScores.map((aScore, aj) => (
			<tr key={ouKey(aScore, aj)}>
				<td>{ouName(aScore)}</td><td>{ouPerc(aScore)}</td>
			</tr>
		));
	}

	return (
		<div id="ViewScore">
			<h1>Ogle score</h1>

			<main>
				<section id="ColWords">
					<header>
						<div><em>{aProps.CardUser.Score}</em> Player</div>
						<div><em>{ouPerc()}%</em></div>
						<div>Ogle <em>{aProps.CardOgle.Score}</em></div>
					</header>

					<div id="BoxWords">
						<table>
							<tbody>
								{ouLinesScore()}
							</tbody>
						</table>
					</div>
				</section>

				<section id="ColMisc">
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

					<section className="BoxStat">
						<h3>Coverage</h3>

						<table>
							<tbody>
								{ouLinesCover()}
							</tbody>
						</table>

						<aside>
							Your score, by word length
						</aside>
					</section>

					<section className="BoxStat">
						<h3>High scores</h3>

						<table>
							<tbody>
								{ouLinesScorePlay()}
							</tbody>
						</table>
					</section>
				</section>
			</main>

			<div className="Btns">
				<Btn onClick={ouHandSetup}>Setup</Btn>
				<Btn className="Group" onClick={ouHandPlay}>Play again</Btn>
			</div>

			{ouDlgScoreWord()}
			{ouDlgNamePlay()}
		</div>
	);
}

ViewScore.propTypes = {
	StApp: PropTypes.string.isRequired,
	uUpd_StApp: PropTypes.func.isRequired,
	Setup: PropTypes.instanceOf(tSetup).isRequired,
	Board: PropTypes.instanceOf(tBoard).isRequired
};
