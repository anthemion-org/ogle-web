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
import { tScoreWord, Stats, uScoresFromCards } from "../Round/ScoreWord.js";
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
	const oScores = uScoresFromCards(aProps.CardOgle, aProps.CardUser);

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
			return (aStat === Stats.Score) ? "1" : "";
		}

		const oLines = oScores.map(aScore => (
			<div key={aScore.Text} className="Line">
				<div className="Score">{ouTextScore(aScore.StatUser)}</div>
				<div>{aScore.Text}</div>
				<div className="Score">{ouTextScore(aScore.StatOgle)}</div>
			</div>
		));
		return oLines;
	}

	function ouPerc() {
		return Math.round(aProps.CardUser.Score / aProps.CardOgle.Score * 100);
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

					<div id="Lines">
						{ouLinesScore()}
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

					<section id="BoxStats">
						<h3>Coverage</h3>

						<table>
							<thead>
								<tr>
									<th>Length</th><th>Scored</th>
								</tr>
							</thead>
							<tbody>
								<tr><td>9+</td><td>10%</td></tr>
								<tr><td>8</td><td>10%</td></tr>
								<tr><td>7</td><td>20%</td></tr>
								<tr><td>6</td><td>30%</td></tr>
								<tr><td>5</td><td>40%</td></tr>
								<tr><td>4</td><td>50%</td></tr>
							</tbody>
						</table>

						<div>
							Your score this game, by word length
						</div>
					</section>

					<section id="BoxScores">
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
