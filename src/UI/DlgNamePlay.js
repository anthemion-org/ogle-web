// DlgNamePlay.js
// --------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import DlgNamePlay from "./DlgNamePlay.js";
//

import "./DlgNamePlay.css";
import Btn from "./Btn.js";
import * as Store from "../Store.js";
import StsApp from "../StsApp.js";

import { React, useState, useEffect } from "react";
import PropTypes from "prop-types";

// DlgNamePlay
// -----------

DlgNamePlay.propTypes = {
	ScoreUser: PropTypes.number.isRequired,
	ScoreOgle: PropTypes.number.isRequired,
	uHandName: PropTypes.func.isRequired
};

/** The Player name dialog, used to query the player name after a high-scoring
 *  round. The following props are supported:
 *
 *  - ScoreUser: The number of points scored by the user. This prop is required;
 *
 *  - ScoreOgle: The number of points scored by Ogle. This prop is required;
 *
 *  - uHandName: The handler to be invoked when a name is entered. This prop is
 *    required.
 */
export default function DlgNamePlay(aProps) {
	/** The Name input value. */
	const [oName, ouSet_Name] = useState(uNameLast());

	function ouStore_Name() {
		Store.uSet("NamePlayLast", oName);
	}
	useEffect(ouStore_Name, [oName]);

	function ouPerc() {
		return Math.round(aProps.ScoreUser / aProps.ScoreOgle * 100);
	}

	function ouHandChange(aEvt) {
		ouSet_Name(aEvt.target.value);
	}

	function ouHandKeyDown(aEvt) {
		if (aEvt.code === "Enter") aProps.uHandName(oName);
	}

	function ouHandOK(aEvt) {
		aProps.uHandName(oName);
	}

	return (
		<div className="ScrimDlg">
			<div id="DlgNamePlay" className="Dlg">
				<header>
					<div><em>{aProps.ScoreUser}</em> Player</div>
					<div><strong>{ouPerc()}%</strong></div>
					<div>Ogle <em>{aProps.ScoreOgle}</em></div>
				</header>

				<hr />

				<h2>High score!</h2>

				<label htmlFor="Name">
					Enter name, or blank to be anonymous:
				</label>

				<input id="Name" name="Name" autoFocus value={oName}
					onChange={ouHandChange} onKeyDown={ouHandKeyDown} />

				<Btn onClick={ouHandOK}>OK</Btn>
			</div>
		</div>
	);
}

function uNameLast() {
	return Store.uGetPOD("NamePlayLast") || "";
}
