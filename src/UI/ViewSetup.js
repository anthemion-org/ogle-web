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
import Logo from "./Logo.js";
import Slide from "./Slide.js";
import Btn from "./Btn.js";
import * as Store from "../Store.js";
import StsApp from "../StsApp.js";
import * as Yield from "../Round/Yield.js";
import * as Pace from "../Round/Pace.js";
import * as Theme from "../Theme.js";
import { tSetup } from "../Round/Setup.js";

import React from "react";
import PropTypes from "prop-types";

// ViewSetup
// ---------
// This component reads a `tSetup` instance from the store, which records 'real'
// data used in other parts of the app. The `Yield.Vals` and `Pace.Vals` arrays
// associate 'nominal' form input selections with specific real configurations.
// The form can be changed to offer different real configurations without
// affecting any other part of the app.

/** Implements the Setup view, which is displayed when Ogle starts. Aside from
 *  those used by all `View` instances, no props are supported. */
export default class ViewSetup extends React.Component {
	constructor(aProps) {
		super(aProps);

		const oSetupInit = tSetup.suFromPlain(Store.uGetPlain("Setup"));
		this.state = {
			...this.props.Cfg,
			/** The selected 'Yield.Vals' index. */
			jYield: Yield.uIdxVal(oSetupInit),
			/** The selected 'Pace.Vals' index. */
			jPace: Pace.uIdxVal(oSetupInit)
		};

		this.uHandChangeCfg = this.uHandChangeCfg.bind(this);
		this.uHandChangeSetup = this.uHandChangeSetup.bind(this);
		this.uHandAbout = this.uHandAbout.bind(this);
		this.uHandPlay = this.uHandPlay.bind(this);
	}

	componentDidUpdate() {
		this.uStore();
	}

	uStore() {
		Store.uSet("Setup", this.uSetup());
	}

	/** Uses properties in the specified `onChange` event to return a state object
	 *  that describes the user's input. */
	uStateFromEvtChange(aEvt) {
		const oEl = aEvt.target;
		const oVal = (oEl.type === "checkbox") ? oEl.checked : oEl.value;
		return { [aEvt.target.name]: oVal };
	}

	uHandChangeCfg(aEvt) {
		this.props.uUpd_Cfg(this.uStateFromEvtChange(aEvt));
	}

	uHandChangeSetup(aEvt) {
		this.setState(this.uStateFromEvtChange(aEvt));
	}

	uHandAbout(aEvt) {
		aEvt.preventDefault();
		this.props.uUpd_StApp(StsApp.About);
	}

	uHandPlay(aEvt) {
		aEvt.preventDefault();

		// This is called when controls are changed, but the user may not have
		// changed anything:
		this.uStore();

		this.props.uUpd_StApp(StsApp.PlayInit);
	}

	/** Returns a tSetup instance representing the current round setup selections. */
	uSetup() {
		const oYield = Yield.Vals[this.state.jYield][0];
		const [oPaceStart, oPaceBonus] = Pace.Vals[this.state.jPace];
		return new tSetup(oYield, oPaceStart, oPaceBonus);
	}

	/** Returns `option` elements for the UI theme dropdown. */
	uOptsDropTheme() {
		return Theme.All.map(o =>
			<option value={o.Name} key={o.Name}>{o.Desc}</option>
		);
	}

	render() {
		const oSetup = this.uSetup();

		return (
			<div id="ViewSetup" className="View">
				<Logo id="Logo" />
				<h1>Ogle setup</h1>

				<main>
					<section>
						<label htmlFor="RgYield">Yield</label>
						<div className="Name">
							{oSetup.uTextShortYield()}
						</div>
						<Slide id="RgYield" name="jYield" value={this.state.jYield}
							max={Yield.Vals.length - 1} onChange={this.uHandChangeSetup} />
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
							max={Pace.Vals.length - 1} onChange={this.uHandChangeSetup} />
						<div className="Instruct">
							{Pace.uInstruct(this.state.jPace)}
						</div>
					</section>

					<section className="Row">
						<label htmlFor="DropTheme">Theme</label>
						<select id="DropTheme" name="NameTheme"
							value={this.props.Cfg?.NameTheme} onChange={this.uHandChangeCfg}>
							{this.uOptsDropTheme()}
						</select>
					</section>
				</main>

				<div id="BtnsMain" className="Btns">
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
