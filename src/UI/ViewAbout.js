// ViewAbout.js
// ------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import ViewAbout from "./UI/ViewAbout.js";
//

import "./ViewAbout.css";
import Logo from "./Logo.js";
import * as StApp from "../StApp.js";
import * as Cfg from "../Cfg.js";

import React from "react";
import PropTypes from "prop-types";

/** The About view. */
export default function ViewAbout(aProps) {
	function ouHandOK(aEvt) {
		const oSt = { View: StApp.Views.Setup };
		aProps.uUpd_StApp(oSt);
	}

	return (
		<div id="ViewAbout">
			<Logo id="Logo" />
			<h1>Ogle</h1>

			<div>Version {Cfg.VerApp}</div>

			<div className="MargV2">
				Copyright ©2007-2022 Jeremy Kelly<br />
				<a href="https://www.anthemion.org" target="_blank"
					rel="noopener noreferrer">
					www.anthemion.org
				</a>
			</div>

			<div className="MargV2">
				Ogle word lists derive from<br />
				<a href="http://wordlist.aspell.net/" target="_blank"
					rel="noopener noreferrer">SCOWL</a><br />
				Copyright ©2000-2004 Kevin Atkinson
			</div>

			<div className="MargV2">
				View Ogle source code at<br />
				<a href="https://github.com/anthemion-org/ogle-web" target="_blank"
					rel="noopener noreferrer">GitHub</a>
			</div>

			<div className="MargV2">
				Send your questions to<br />
				<a href="mailto://support@anthemion.org">support@anthemion.org</a>
			</div>

			<div className="Btns Ctr MargV3">
				<button onClick={ouHandOK}>OK</button>
			</div>
		</div>
	);
}

ViewAbout.propTypes = {
	StApp: PropTypes.object.isRequired,
	uUpd_StApp: PropTypes.func.isRequired
};
