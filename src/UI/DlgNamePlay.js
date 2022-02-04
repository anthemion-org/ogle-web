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

import { React, useState } from "react";
import PropTypes from "prop-types";

// DlgNamePlay
// -----------

export default function DlgNamePlay(aProps) {
	/** The Name input value. */
	const [oName, ouSet_Name] = useState(uNameLast());

	function ouPerc() {
		return Math.round(aProps.ScoreUser / aProps.ScoreOgle * 100);
	}

	function ouHandChange(aEvt) {
		ouSet_Name(aEvt.target.value);
	}

	function ouHandOK(aEvt) {
		aProps.uHandName(oName);
	}

	return (
		<div className="ScreenDlg">
			<div id="DlgNamePlay">
				<header>
					<div><em>{aProps.ScoreUser}</em> Player</div>
					<div><em>{ouPerc()}%</em></div>
					<div>Ogle <em>{aProps.ScoreOgle}</em></div>
				</header>

				<hr />

				<h2>High score!</h2>

				<label htmlFor="Name">
					Enter name, or blank to be anonymous:
				</label>

				<input id="Name" name="Name" value={oName} onChange={ouHandChange} />

				<Btn onClick={ouHandOK}>OK</Btn>
			</div>
		</div>
	);
}

DlgNamePlay.propTypes = {
};

function uNameLast() {
	return Store.uGetPOD("NamePlayLast") || "";
}
