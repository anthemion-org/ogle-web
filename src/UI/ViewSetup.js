// ViewSetup.js
// ------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import ViewSetup from "./UI/ViewSetup.js";
//

import "./ViewSetup.css";
import * as Store from "../Store.js";
import * as StApp from "../StApp.js";
import { tSetup } from "../Round/Setup.js";
import { tRg } from "../Util/Rg.js";
import * as Text from "../Util/Text.js";

import React from "react";
import PropTypes from "prop-types";

// ViewSetup
// ---------
// The component accepts a single tSetup instance, which stores 'real' data used
// in other parts of the app. The Yields and Paces arrays associate 'nominal'
// form input selections with specific real configurations. The form can be
// changed to offer different real configurations without affecting any other
// part of the app.

/** Implements the Setup view, which is displayed when Ogle starts. Along with
 *  StApp and uUpd_StApp, the following props are supported:
 *
 *  ~ Setup: A tSetup instance that stores the original user settings. This prop
 *    is required.
 */
export default class ViewSetup extends React.Component {
	constructor(aProps) {
		super(aProps);

		this.state = {
			/** The selected Yields index. */
			jYield: uIdxYield(aProps.SetupRest),
			/** The selected Paces index. */
			jPace: uIdxPace(aProps.SetupRest)
		};

		this.uHandChg = this.uHandChg.bind(this);
		this.uHandAbout = this.uHandAbout.bind(this);
		this.uHandPlay = this.uHandPlay.bind(this);
	}

	uHandChg(aEvt) {
		const oEl = aEvt.target;
		const oVal = (oEl.type === "checkbox") ? oEl.checked : oEl.value;
		const oState = { [aEvt.target.name]: oVal };
		this.setState(oState);
	}

	uHandAbout(aEvt) {
		aEvt.preventDefault();

		const oSt = { View: StApp.Views.About };
		this.props.uUpd_StApp(oSt);
	}

	uHandPlay(aEvt) {
		aEvt.preventDefault();

		const oSt = { View: StApp.Views.Play };
		this.props.uUpd_StApp(oSt);
	}

	componentDidUpdate() {
		const oYield = Yields[this.state.jYield][1];
		const [, oPaceStart, oPaceBonus] = Paces[this.state.jPace];
		const oSetup = new tSetup(oYield, oPaceStart, oPaceBonus);
		Store.uSet("Setup", oSetup);
	}

	render() {
		return (
			<form id="ViewSetup">
				<h1>Ogle setup</h1>

				<div className="Box">
					<label htmlFor="RgYield">Yield</label>
					<div className="Name">
						{uNameYield(this.state.jYield)}
					</div>
					<input id="RgYield" type="range" name="jYield"
						value={this.state.jYield} max={Yields.length - 1}
						onChange={this.uHandChg} />
					<div>
						{uInstructYield(this.state.jYield)}
					</div>
				</div>

				<div className="Box">
					<label htmlFor="RgPace">Pace</label>
					<div className="Name">
						{uNamePace(this.state.jPace)}
					</div>
					<input id="RgPace" type="range" name="jPace"
						value={this.state.jPace} max={Paces.length - 1}
						onChange={this.uHandChg} />
					<div>
						{uInstructPace(this.state.jPace)}
					</div>
				</div>

				<div className="Btns">
					<button onClick={this.uHandAbout}>About</button>
					<button className="Group" onClick={this.uHandPlay}>Play</button>
				</div>
			</form>
		);
	}
}

ViewSetup.propTypes = {
	StApp: PropTypes.object.isRequired,
	uUpd_StApp: PropTypes.func.isRequired,
	SetupRest: PropTypes.instanceOf(tSetup).isRequired
};

// Yield data
// ----------

/** The yield names and ranges offered by this form. Each element stores the
 *  yield name and a tRg instance. */
const Yields = [
	["Sparse", new tRg(-Infinity, 50)],
	["Middling", new tRg(50, 100)],
	["Full", new tRg(100, Infinity)]
];

/** The yield setting to be selected if the stored yield does not match one of
 *  the form settings. */
const jYieldDef = 2;

/** Returns the Yields index that matches aSetup, or the default index, if no
 *  match is found. */
function uIdxYield(aSetup) {
	for (let oj = 0; oj < Yields.length; ++oj)
		if (Yields[oj][1].uCkEq(aSetup.Yield)) return oj;
	return jYieldDef;
}

function uNameYield(ajYield) {
	return Yields[ajYield][0];
}

function uInstructYield(ajYield) {
	const oYield = Yields[ajYield][1];
	if (!isFinite(oYield.Start))
		return `At most ${oYield.End} words.`;
	if (!isFinite(oYield.End))
		return `At least ${oYield.Start} words.`;
	return `Between ${oYield.Start} and ${oYield.End} words.`;
}

// Pace data
// ---------

/** The pace names and values offered by this form. Each element stores the pace
 *  name, the starting time, and the bonus time. */
const Paces = [
	["Plodding", 48, 8],
	["Slow", 36, 6],
	["Unhurried", 30, 5],
	["Measured", 24, 4],
	["Brisk", 18, 3],
	["Fast", 12, 2],
	["Dizzying", 6, 1]
];

/** The pace setting to be selected if the stored pace does not match one of the
 *  form settings. */
const jPaceDef = 2;

/** Returns the Paces index that matches aSetup, or the default index, if no
 *  match is found. */
function uIdxPace(aSetup) {
	for (let oj = 0; oj < Paces.length; ++oj) {
		const [, oPaceStart, oPaceBonus] = Paces[oj];
		if ((oPaceStart === aSetup.PaceStart)
			&& (oPaceBonus === aSetup.PaceBonus))
			return oj;
	}
	return jPaceDef;
}

function uNamePace(ajPace) {
	return Paces[ajPace][0];
}

function uInstructPace(ajPace) {
	const oPace = Paces[ajPace];
	const oStart = Text.uProseNum(oPace[0]);
	const oBonus = Text.uProseNum(oPace[1]);
	const oSuffBonus = ((oPace[1] > 1) ? "s" : "");
	return `Start with ${oStart} seconds and gain ${oBonus} second${oSuffBonus} for each letter over three in every entered word.`;
}
