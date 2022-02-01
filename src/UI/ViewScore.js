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
import LookBoard from "./LookBoard.js";
import Btn from "./Btn.js";
import StsApp from "../StsApp.js";
import { tSetup } from "../Round/Setup.js";
import { tBoard } from "../Board/Board.js";
import { tEntWord } from "../Round/EntWord.js";
import { tCard } from "../Round/Card.js";
import { tScoreWord, Stats, uDataScoreFromCards } from "../Round/ScoreWord.js";
import * as Store from "../Store.js";
import * as Cfg from "../Cfg.js";

import React from "react";
import PropTypes from "prop-types";

// ViewScore
// ---------

/** Implements the Score view. Along with StApp and uUpd_StApp, the following
 *  props are supported:
 *
 *  ~ Setup: A tSetup instance for the completed game. This prop is required.
 *
 *  ~ BoardRest: A tBoard instance for the complete game.
 */
export default function ViewScore(aProps) {
	const [oScores, oCover] = uDataScoreFromCards(aProps.CardOgle,
		aProps.CardUser);

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
			if (aStat === Stats.Score) return "1";
			if (aStat === Stats.Follow) return "0";
			return "";
		}

		const oLines = oScores.map(aScore => (
			<tr key={aScore.Text}>
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

		function ouPer(aLen) {
			const oData = oCover[aLen];
			if (!oData) return "N/A";
			return Math.round(oData.CtUser / oData.CtTtl * 100) + "%";
		}

		const oLines = [];
		for (let oLen = Cfg.LenCoverMax; oLen >= Cfg.LenWordMin; --oLen)
			oLines.push(
				<tr key={oLen}>
					<td>{ouHead(oLen)}</td><td>{ouPer(oLen)}</td>
				</tr>
			);
		return oLines;
	}

	return (
		<div id="ViewScore">
			<h1>Ogle score</h1>

			<main>
				<section id="ColEnts">
					<header>
						<div><em>{aProps.CardUser.Score}</em> Player</div>
						<div><em>{ouPerc()}%</em></div>
						<div>Ogle <em>{aProps.CardOgle.Score}</em></div>
					</header>

					<hr />

					<div id="BoxEnts">
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
								<tr><td>Ichiban Bakemono</td><td>50%</td></tr>
								<tr><td>Ichiban Bakemono</td><td>40%</td></tr>
								<tr><td>Ichiban Bakemono</td><td>30%</td></tr>
								<tr><td>Ichiban Bakemono</td><td>10%</td></tr>
								<tr><td>Ichiban Bakemono</td><td>10%</td></tr>
							</tbody>
						</table>
					</section>
				</section>
			</main>

			<div className="Btns">
				<Btn onClick={ouHandSetup}>Setup</Btn>
				<Btn className="Group" onClick={ouHandPlay}>Play again</Btn>
			</div>
		</div>
	);
}

ViewScore.propTypes = {
	StApp: PropTypes.string.isRequired,
	uUpd_StApp: PropTypes.func.isRequired,
	Setup: PropTypes.instanceOf(tSetup).isRequired,
	Board: PropTypes.instanceOf(tBoard)
};
