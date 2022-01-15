// FrmSetup.js
// -----------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tLex } from "./Lex.js";
//

import "./FrmSetup.css";
import { tSetup } from "../Setup.js";
import * as Text from "../Util/Text.js";
import React from "react";

export default class FrmSetup extends React.Component {
	constructor(aProps) {
		super(aProps);

		this.state = {
			Yield: aProps.Yield,
			Pace: aProps.Pace
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
				<div>
					<label>Yield
					<input type="range" name="Yield" value={this.state.Yield}
							max={tSetup.sYieldMax} list="StepsYield"
							onChange={this.uHandChg} />
					</label>
					<p>
						{uInstructYield(this.state.Yield)}
					</p>
				</div>

				<div>
					<label>Pace
					<input type="range" name="Pace" value={this.state.Pace}
							max={tSetup.sPaceMax} list="StepsPace"
							onChange={this.uHandChg} />
					</label>
					<p>
						{uInstructPace(this.state.Pace)}
					</p>
				</div>

				<input type="submit" value="Play" />
			</form>
		);
	}
}

function uInstructYield(aYield) {
	return "XXX";
}

function uInstructPace(aPace) {
	return "XXX";
}
