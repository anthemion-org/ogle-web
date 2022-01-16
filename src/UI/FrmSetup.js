// FrmSetup.js
// -----------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import FrmSetup from "./UI/FrmSetup";
//

import "./FrmSetup.css";
import { tSetup } from "../Setup.js";
import { tRg } from "../Util/Rg.js";
import * as Text from "../Util/Text.js";
import React from "react";

// FrmSetup
// --------

export default class FrmSetup extends React.Component {
	constructor(aProps) {
		super(aProps);

		this.state = {
			jYield: uIdxYield(aProps.Setup.Yield),
			jPace: uIdxPace(aProps.Setup.Pace)
		};

		this.uHandChg = this.uHandChg.bind(this);
		this.uHandSubmit = this.uHandSubmit.bind(this);
	}

	uHandChg(aEvt) {
		const oEl = aEvt.target;
		const oVal = (oEl.type === "checkbox") ? oEl.checked : oEl.value;
		const oState = { [aEvt.target.name]: oVal };
		this.setState(oState);
	}

	uHandSubmit(aEvt) {
		aEvt.preventDefault();
	}

	render() {
		return (
			<form onSubmit={this.uHandSubmit}>
				<div class="Box">
					<label for="RgYield">Yield</label>
					<div class="Name">
						{uNameYield(this.state.jYield)}
					</div>
					<input id="RgYield" type="range" name="jYield"
						value={this.state.jYield} max={Yields.length - 1}
						onChange={this.uHandChg} />
					<div>
						{uInstructYield(this.state.jYield)}
					</div>
				</div>

				<div class="Box">
					<label for="RgPace">Pace</label>
					<div class="Name">
						{uNamePace(this.state.jPace)}
					</div>
					<input id="RgPace" type="range" name="jPace"
						value={this.state.jPace} max={Paces.length - 1}
						onChange={this.uHandChg} />
					<div>
						{uInstructPace(this.state.jPace)}
					</div>
				</div>

				<input type="submit" value="Play" />
			</form>
		);
	}
}

// Yield data
// ----------

/** The yield names and ranges produced by this form. */
const Yields = [
	["Sparse", new tRg(-Infinity, 50)],
	["Middling", new tRg(50, 100)],
	["Full", new tRg(100, Infinity)]
];

const jYieldDef = 2;

/** Returns the Yields index that matches aYield, or the default index, if no
 *  match is found. */
function uIdxYield(aYield) {
	for (let oj = 0; oj < Yields.length; ++oj)
		if (Yields[oj][1].uCkEqual(aYield)) return oj;
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

/** The pace names and values produced by this form. */
const Paces = [
	["Plodding", 48, 8],
	["Slow", 36, 6],
	["Unhurried", 30, 5],
	["Measured", 24, 4],
	["Brisk", 18, 3],
	["Fast", 12, 2],
	["Dizzying", 6, 1]
];

const jPaceDef = 2;

/** Returns the Paces index that matches aPaceStart and aPaceBonus, or the
 *  default index, if no match is found. */
function uIdxPace(aPaceStart, aPaceBonus) {
	for (let oj = 0; oj < Paces.length; ++oj) {
		const [oPaceStart, oPaceBonus] = Paces[oj];
		if ((oPaceStart === aPaceStart) && (oPaceBonus === aPaceBonus)) return oj;
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
