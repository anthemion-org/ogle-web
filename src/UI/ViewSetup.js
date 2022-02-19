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
import * as Yield from "../Round/Yield.js";
import * as Pace from "../Round/Pace.js";
import { tSetup } from "../Round/Setup.js";

import React from "react";
import PropTypes from "prop-types";

// ViewSetup
// ---------
// The component accepts a single tSetup instance, which stores 'real' data used
// in other parts of the app. The Yield.Vals and Pace.Vals arrays associate
// 'nominal' form input selections with specific real configurations. The form
// can be changed to offer different real configurations without affecting any
// other part of the app.

/** Implements the Setup view, which is displayed when Ogle starts. Aside from
 *  StApp and uUpd_StApp, no props are supported. */
export default class ViewSetup extends React.Component {
	constructor(aProps) {
		super(aProps);

		const oSetupInit = uSetupInit();
		this.state = {
			/** The selected 'Yield.Vals' index. */
			jYield: Yield.uIdxVal(oSetupInit),
			/** The selected 'Pace.Vals' index. */
			jPace: Pace.uIdxVal(oSetupInit)
		};

		this.uHandChange = this.uHandChange.bind(this);
		this.uHandAbout = this.uHandAbout.bind(this);
		this.uHandPlay = this.uHandPlay.bind(this);
	}

	componentDidUpdate() {
		this.uStore();
	}

	uStore() {
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

		// In case no controls were changed:
		this.uStore();
		this.props.uUpd_StApp(StsApp.PlayInit);
	}

	/** Returns a tSetup instance representing the current selection. */
	uSetup() {
		const oYield = Yield.Vals[this.state.jYield][0];
		const [oPaceStart, oPaceBonus] = Pace.Vals[this.state.jPace];
		return new tSetup(oYield, oPaceStart, oPaceBonus);
	}

	render() {
		const oSetup = this.uSetup();

		return (
			<div id="ViewSetup" className="View">
				<h1>Ogle setup</h1>

				<main>
					<section>
						<label htmlFor="RgYield">Yield</label>
						<div className="Name">
							{oSetup.uTextShortYield()}
						</div>
						<Slide id="RgYield" name="jYield" value={this.state.jYield}
							max={Yield.Vals.length - 1} onChange={this.uHandChange} />
						<div className="Instruct">
							{Yield.uInstruct(this.state.jYield)}
						</div>
					</section>

					<section>
						<label htmlFor="RgPace">Pace</label>
						<div className="Name">
							{oSetup.uTextShortPace()}
						</div>
						<Slide id="RgPace" name="jPace" value={this.state.jPace}
							max={Pace.Vals.length - 1} onChange={this.uHandChange} />
						<div className="Instruct">
							{Pace.uInstruct(this.state.jPace)}
						</div>
					</section>
				</main>

				<div className="Btns">
					<Btn onClick={this.uHandAbout}>About</Btn>
					<Btn className="Group" onClick={this.uHandPlay}>Play</Btn>
				</div>
			</div>
		);
	}
}

ViewSetup.propTypes = {
	StApp: PropTypes.string.isRequired,
	uUpd_StApp: PropTypes.func.isRequired
};

export function uSetupInit() {
	return tSetup.suFromPOD(Store.uGetPOD("Setup"));
}
