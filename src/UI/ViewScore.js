// ViewScore.js
// ============
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
import * as Setup from "../Round/Setup.js";
import * as Board from "../Board/Board.js";
import * as Card from "../Round/Card.js";
import { StatsWord, uScoresCoversFromCards } from "../Round/ScoreWord.js";
import Feed from "../Feed.js";
import { uSelSetup, Set_StApp } from "../Store/SliceApp.js";
import { uSelBoard, uSelCardOgle, uSelCardUser } from "../Store/SlicePlay.js";
import { uSelScoresHigh, Add_ScoreHigh } from "../Store/SliceScore.js";
import * as ScorePlay from "../Round/ScorePlay.js";
import * as ScoresHigh from "../Round/ScoresHigh.js";
import * as Const from "../Const.js";
import * as Misc from "../Util/Misc.js";

import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";

// ViewScore
// ---------

/** Implements the Score view, which displays the result of the last round of
 *  play. No props are supported. */
export default function ViewScore(aProps) {
	const ouDispatch = useDispatch();
	const oScoresHigh = useSelector(uSelScoresHigh);
	const oSetup = useSelector(uSelSetup);
	const oBoard = useSelector(uSelBoard);
	const oCardOgle = useSelector(uSelCardOgle);
	const oCardUser = useSelector(uSelCardUser);

	/** Set to the `tScoreWord` that is being displayed in the Word Score dialog,
	 *  or `null` if no entry is being displayed. */
	const [ oScoreWord, ouSet_ScoreWord ] = useState(null);

	// Compare player cards
	// --------------------

	/** An array of `tScoreWord` instances representing the words found in this
	 *  round, plus an object that associates word lengths with `tCover`
	 *  instances. */
	const [oScores, oCoversByLen] = uScoresCoversFromCards(oCardOgle, oCardUser);

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
		// The `data-idx-word` attribute is assigned to the `tr`, but a `td` will
		// generate the click, and the event will bubble up from there:
		const oEl = aEvt.target.parentElement;
		if (oEl.dataset.idxWord) {
			const oScore = oScores[oEl.dataset.idxWord];
			ouSet_ScoreWord(oScore);

			Feed.uSelDie();
		}
	}

	/** Handles the Word Score dialog OK click. */
	function ouHandOKScoreWord(aEvt) {
		ouSet_ScoreWord(null);
	}

	function ouDlgScoreWord() {
		if (!oScoreWord) return null;

		return (
			<DlgScoreWord Board={oBoard} ScoreWord={oScoreWord}
				uHandOK={ouHandOKScoreWord} />
		);
	}

	// Player Name dialog
	// ------------------

	/** Handles the Player Name dialog OK click. */
	function ouHandNamePlay(aName) {
		aName = aName.trim();
		const oFracPerc = oCardUser.Score / oCardOgle.Score;
		const oScore = ScorePlay.uNew(oCardUser.TimeStart, aName, oFracPerc);
		const oAct = Add_ScoreHigh({
			TagSetup: Setup.uTag(oSetup),
			ScorePlay: oScore
		});
		ouDispatch(oAct);
	}

	function ouDlgNamePlay() {
		if (!ScoresHigh.uCkScoreHigh(oSetup, oCardUser, oCardOgle, oScoresHigh))
			return null;

		return (
			<DlgNamePlay ScoreUser={oCardUser.Score} ScoreOgle={oCardOgle.Score}
				uHandName={ouHandNamePlay} />
		);
	}

	// View content
	// ------------

	/** Handles the Setup button click. */
	function ouHandSetup(aEvt) {
		ouDispatch(Set_StApp(StsApp.Sets));
	}

	/** Handles the Play Again button click. */
	function ouHandPlay(aEvt) {
		ouDispatch(Set_StApp(StsApp.Play));
	}

	function ouLinesScore() {
		function ouClasses(aScore) {
			let oClasses = "";
			if (aScore.CkWordUser) oClasses += "WordUser";
			if ((aScore.StatOgle !== StatsWord.Miss)
				&& (aScore.StatUser === StatsWord.Miss)) oClasses += " MissUser";
			return oClasses;
		}

		function ouTextScore(aStat) {
			switch (aStat) {
				case StatsWord.Score: return "1";
				case StatsWord.Follow: return "·";
				default: return "";
			}
		}

		const oLines = oScores.map((aScore, aj) => (
			<tr key={aScore.Text} data-idx-word={aj} className={ouClasses(aScore)}
				onClick={ouHandClickWord}>

				<td>{ouTextScore(aScore.StatUser)}</td>
				<td>{aScore.Text}</td>
				<td>{ouTextScore(aScore.StatOgle)}</td>
			</tr>
		));
		return oLines;
	}

	function ouPerc() {
		return Math.round(oCardUser.Score / oCardOgle.Score * 100);
	}

	function ouLinesCover() {
		function ouHead(aLen) {
			if (aLen >= Const.LenCoverMax) return Const.LenCoverMax + "+ letters";
			return aLen + " letters";
		}

		function ouFrac(aLen) {
			const oData = oCoversByLen[aLen];
			if (!oData) return "—";
			return oData.CtUser + "/" + oData.CtTtl;
		}

		function ouPerc(aLen) {
			const oData = oCoversByLen[aLen];
			if (!oData) return "—";
			return Math.round(oData.CtUser / oData.CtTtl * 100) + "%";
		}

		const oLines = [];
		for (let oLen = Const.LenCoverMax; oLen >= Const.LenWordMin; --oLen)
			oLines.push(
				<tr key={oLen}>
					<td>{ouHead(oLen)}</td><td>{ouFrac(oLen)}</td><td>{ouPerc(oLen)}</td>
				</tr>
			);
		return oLines;
	}

	function ouLinesScoreHigh() {
		const oCtRow = Const.CtStoreScoreHigh;
		const oTag = Setup.uTag(oSetup);
		const oScores = ScoresHigh.uScoresPlayTagSetup(oScoresHigh, oTag)
			.slice(0, (oCtRow + 1));
		if (oScores.length < oCtRow) {
			const oBlanks = Misc.uGen_Arr((oCtRow - oScores.length), null);
			oScores.push(...oBlanks);
		}

		function ouKey(aScore, aj) {
			return aj.toString() + (aScore ? aScore.TimeStart : "");
		}

		function ouClass(aScore) {
			return (aScore && (aScore.TimeStart === oCardUser.TimeStart))
				? "High"
				: "";
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
			<tr key={ouKey(aScore, aj)} className={ouClass(aScore)}>
				<td>{ouName(aScore)}</td><td>{ouPerc(aScore)}</td>
			</tr>
		));
	}

	return (
		<div id="ViewScore" className="View">
			<h1>Ogle score</h1>

			<main>
				<section id="BoxCover">
					<h3>Coverage</h3>

					<table>
						<tbody>
							{ouLinesCover()}
						</tbody>
					</table>

					<aside>
						Your score, by word length, versus Ogle's
					</aside>
				</section>

				<section id="BoxSetup">
					<div>
						<h3>Yield</h3>
						<div>{Setup.uTextShortYield(oSetup)}</div>
					</div>
					<hr />
					<div>
						<h3>Pace</h3>
						<div>{Setup.uTextShortPace(oSetup)}</div>
					</div>
				</section>

				<section id="BoxHigh">
					<h3>High scores</h3>

					<table>
						<tbody>
							{ouLinesScoreHigh()}
						</tbody>
					</table>

					<aside>
						All games using this setup, in this browser
					</aside>
				</section>

				<section id="ColWords">
					<header>
						<div><em>{oCardUser.Score}</em> Player</div>
						<div><strong>{ouPerc()}%</strong></div>
						<div>Ogle <em>{oCardOgle.Score}</em></div>
					</header>

					<div id="BoxWords">
						<table>
							<tbody>
								{ouLinesScore()}
							</tbody>
						</table>
					</div>
				</section>
			</main>

			<div id="BtnsMain" className="Btns">
				<Btn onClick={ouHandSetup}>Setup</Btn>
				<Btn className="Group" onClick={ouHandPlay}>Play again</Btn>
			</div>

			{ouDlgScoreWord()}
			{ouDlgNamePlay()}
		</div>
	);
}
