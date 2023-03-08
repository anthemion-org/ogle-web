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
import { tBoard } from "../Board/Board.js";
import { tCard } from "../Round/Card.js";
import { StatsWord, uScoresCoversFromCards } from "../Round/ScoreWord.js";
import Feed from "../Feed.js";
import { Set_StApp } from "../Store/SliceApp.js";
import { uSelSetup } from "../Store/SliceSets.js";
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

ViewScore.propTypes = {
	Board: PropTypes.instanceOf(tBoard).isRequired,
	CardOgle: PropTypes.instanceOf(tCard).isRequired,
	CardUser: PropTypes.instanceOf(tCard).isRequired
};

/** Implements the Score view, which displays the result of the last round of
 *  play. Along with the usual `View` props, the following props are supported:
 *
 *  - `Board`: A `tBoard` instance representing the board that was played. This
 *    prop is required;
 *
 *  - `CardOgle`: A `tCard` instance that gives the words scored by Ogle. This
 *    prop is required;
 *
 *  - `CardUser`: A `tCard` instance that gives the words scored by the user.
 *    This prop is required.
 */
export default function ViewScore(aProps) {
	const ouDispatch = useDispatch();
	/** A ScoresHigh record that contains all high score data. */
	const oScoresHigh = useSelector(uSelScoresHigh);
	/** The Setup record used to generate the completed round. */
	const oSetup = useSelector(uSelSetup);

	/** Set to the `tScoreWord` that is being displayed in the Word Score dialog,
	 *  or `null` if no entry is being displayed. */
	const [ oScoreWord, ouSet_ScoreWord ] = useState(null);

	// Compare player cards
	// --------------------

	/** An array of `tScoreWord` instances representing the words found in this
	 *  round, plus an object that associates word lengths with `tCover`
	 *  instances. */
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
			<DlgScoreWord Board={aProps.Board} ScoreWord={oScoreWord}
				uHandOK={ouHandOKScoreWord} />
		);
	}

	// Player Name dialog
	// ------------------

	/** Handles the Player Name dialog OK click. */
	function ouHandNamePlay(aName) {
		aName = aName.trim();
		const oFracPerc = aProps.CardUser.Score / aProps.CardOgle.Score;
		const oScore = ScorePlay.uNew(aProps.CardUser.TimeStart, aName, oFracPerc);
		const oAct = Add_ScoreHigh({
			TagSetup: Setup.uTag(oSetup),
			ScorePlay: oScore
		});
		ouDispatch(oAct);
	}

	function ouDlgNamePlay() {
		if (!ScoresHigh.uCkScoreHigh(oSetup, aProps.CardUser, aProps.CardOgle,
			oScoresHigh))
			return null;

		return (
			<DlgNamePlay ScoreUser={aProps.CardUser.Score}
				ScoreOgle={aProps.CardOgle.Score} uHandName={ouHandNamePlay} />
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
		ouDispatch(Set_StApp(StsApp.PlayInit));
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
		return Math.round(aProps.CardUser.Score / aProps.CardOgle.Score * 100);
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
			return (aScore && (aScore.TimeStart === aProps.CardUser.TimeStart))
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
						<div><em>{aProps.CardUser.Score}</em> Player</div>
						<div><strong>{ouPerc()}%</strong></div>
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
