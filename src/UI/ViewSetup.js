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
import Slide from "./Slide.js";
import Btn from "./Btn.js";
import * as Store from "../Store.js";
import StsApp from "../StsApp.js";
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

		this.uHandChange = this.uHandChange.bind(this);
		this.uHandAbout = this.uHandAbout.bind(this);
		this.uHandPlay = this.uHandPlay.bind(this);
	}

	componentDidUpdate() {
		Store.uSet("Setup", this.uSetup());
	}

	uHandChange(aEvt) {
		const oEl = aEvt.target;
		const oVal = (oEl.type === "checkbox") ? oEl.checked : oEl.value;
		const oState = { [aEvt.target.name]: oVal };
		this.setState(oState);
	}

	uHandAbout(aEvt) {
		aEvt.preventDefault();
		this.props.uUpd_StApp(StsApp.About);
	}

	uHandPlay(aEvt) {
		aEvt.preventDefault();
		this.props.uUpd_StApp(StsApp.PlayInit);
	}

	/** Returns a tSetup instance representing the current selection. */
	uSetup() {
		const oYield = Yields[this.state.jYield][0];
		const [oPaceStart, oPaceBonus] = Paces[this.state.jPace];
		return new tSetup(oYield, oPaceStart, oPaceBonus);
	}

	render() {
		const oSetup = this.uSetup();

		return (
			<form id="ViewSetup">
				<h1>Ogle setup</h1>

				<section>
					<label htmlFor="RgYield">Yield</label>
					<div className="Name">
						{oSetup.uTextShortYield()}
					</div>
					<Slide id="RgYield" name="jYield" value={this.state.jYield}
						max={Yields.length - 1} onChange={this.uHandChange} />
					<div className="Instruct">
						{uInstructYield(this.state.jYield)}
					</div>
				</section>

				<section>
					<label htmlFor="RgPace">Pace</label>
					<div className="Name">
						{oSetup.uTextShortPace()}
					</div>
					<Slide id="RgPace" name="jPace" value={this.state.jPace}
						max={Paces.length - 1} onChange={this.uHandChange} />
					<div className="Instruct">
						{uInstructPace(this.state.jPace)}
					</div>
				</section>

				<div className="Btns">
					<Btn onClick={this.uHandAbout}>About</Btn>
					<Btn className="Group" onClick={this.uHandPlay}>Play</Btn>
				</div>
			</form>
		);
	}
}

ViewSetup.propTypes = {
	StApp: PropTypes.string.isRequired,
	uUpd_StApp: PropTypes.func.isRequired,
	SetupRest: PropTypes.instanceOf(tSetup).isRequired
};

// Yield data
// ----------

/** The yield names and ranges offered by this form. Each element stores the
 *  yield name and a tRg instance. */
const Yields = [
	[new tRg(1, 50)],
	[new tRg(50, 100)],
	[new tRg(100, Infinity)]
];

/** The yield setting to be selected if the stored yield does not match one of
 *  the form settings. */
const jYieldDef = 2;

/** Returns the Yields index that matches aSetup, or the default index, if no
 *  match is found. */
function uIdxYield(aSetup) {
	for (let oj = 0; oj < Yields.length; ++oj)
		if (Yields[oj][0].uCkEq(aSetup.Yield)) return oj;
	return jYieldDef;
}

function uInstructYield(ajYield) {
	const oYield = Yields[ajYield][0];
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
	[48, 8],
	[36, 6],
	[30, 5],
	[24, 4],
	[18, 3],
	[12, 2],
	[6, 1]
];

/** The pace setting to be selected if the stored pace does not match one of the
 *  form settings. */
const jPaceDef = 2;

/** Returns the Paces index that matches aSetup, or the default index, if no
 *  match is found. */
function uIdxPace(aSetup) {
	for (let oj = 0; oj < Paces.length; ++oj) {
		const [oPaceStart, oPaceBonus] = Paces[oj];
		if ((oPaceStart === aSetup.PaceStart)
			&& (oPaceBonus === aSetup.PaceBonus))
			return oj;
	}
	return jPaceDef;
}

function uInstructPace(ajPace) {
	const oPace = Paces[ajPace];
	const oStart = Text.uProseNum(oPace[0]);
	const oBonus = Text.uProseNum(oPace[1]);
	const oSuffBonus = ((oPace[1] > 1) ? "s" : "");
	return `Start with ${oStart} seconds and gain ${oBonus} second${oSuffBonus} for each letter over three in every entered word.`;
}
