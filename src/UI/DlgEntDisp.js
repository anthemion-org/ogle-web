// DlgEntDisp.js
// -------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import DlgEntDisp from "./DlgEntDisp.js";
//

import "./DlgEntDisp.css";
import LookBoard from "./LookBoard.js";
import Btn from "./Btn.js";
import { tEntWord } from "../Round/EntWord.js";

import React from "react";
import PropTypes from "prop-types";

/** The Word Verification dialog. */
export default function DlgEntDisp(aProps) {
	const oTextEnt = aProps.Ent.uTextAll();
	const oURL = "https://en.wiktionary.org/wiki/" + oTextEnt;

	return (
		<div className="ScreenDlg">
			<div id="DlgEntDisp">
				<div id="BoxLen" className="Box">
					6
				</div>

				<div id="BoxWik" className="Box">
					<a className="Btn" href={oURL} target="_blank"
						rel="noopener noreferrer">
						{oTextEnt}
					</a>

					<label>
						Click for Wiktionary
					</label>
				</div>

				<LookBoard Board={aProps.Board} Ent={aProps.Ent} />

				<div id="BoxScoreUser" className="Box">
					missed
				</div>

				<div id="ItScoreOgle">
					<div id="BoxScoreOgle" className="Box">
						scored
					</div>

					<Btn className="Group" onClick={aProps.uHandOK}>OK</Btn>
				</div>
			</div>
		</div>
	);
}

DlgEntDisp.propTypes = {
	Ent: PropTypes.instanceOf(tEntWord).isRequired,
	uHandOK: PropTypes.func.isRequired
};
