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
// This view allows the user to select configuration and setup options.
//
// 'Configuration' options are those that affect the entire app. These are
// forwarded to every view with the `Cfg` prop, and persisted with the
// `uUpd_Cfg` prop function, which is implemented in `App.js`, and which writes
// to the `Cfg` key in the local storage. Right now, `NameTheme` is the only
// configuration option.
//
// 'Setup' options are specific to game play. They are persisted with the
// `uStore_Setup` method in this class, which writes to the `Setup` key.
//
// The setup selections are represented with a `tSetup` instance. This view
// reads the instance from the store, which records data in 'real' terms that
// are usable in other parts of the app. Many controls (particularly the sliders
// in this view) reference values in 'nominal' terms, such as indices, which
// identify user selections without being directly usable as values. The
// `Yield.Vals` and `Pace.Vals` arrays associate nominal selections with real
// values. That allows the view (and its particular way of selecting or
// identifying values) to change without affecting the modules that consume real
// values.

/** Implements the Setup view, which is displayed when Ogle starts. Aside from
 *  those used by all `View` instances, no props are supported. */
export default class ViewSetup extends React.Component {
	constructor(aProps) {
		super(aProps);

		const oSetupInit = tSetup.suFromPlain(Store.uGetPlain("Setup"));
		this.state = {
			...this.props.Cfg,
			/** The selected `Yield.Vals` index. */
			jYield: Yield.uIdxValMatchOrDef(oSetupInit),
			/** The selected `Pace.Vals` index. */
			jPace: Pace.uIdxValMatchOrDef(oSetupInit)
		};

		this.uHandChangeCfg = this.uHandChangeCfg.bind(this);
		this.uHandChangeSetup = this.uHandChangeSetup.bind(this);
		this.uHandAbout = this.uHandAbout.bind(this);
		this.uHandPlay = this.uHandPlay.bind(this);
	}

	componentDidUpdate() {
		// Persist setup changes after the view state is updated. Note that this
		// will also happen after configuration changes (as produced by the Theme
		// dropdown), even though that data is persisted differently:
		this.uStore_Setup();
	}

	/** Stores the setup selected in this view. */
	uStore_Setup() {
		Store.uSet("Setup", this.uSetup());
	}

	/** Returns a `tSetup` instance representing the setup selected in this view. */
	uSetup() {
		const oYield = Yield.Vals[this.state.jYield][0];
		const [oPaceStart, oPaceBonus] = Pace.Vals[this.state.jPace];
		return new tSetup(oYield, oPaceStart, oPaceBonus);
	}

	// Event handling
	// --------------

	/** Uses properties in the specified `onChange` event to return a state object
	 *  that describes the user's change. */
	uStateFromEvtChange(aEvt) {
		const oEl = aEvt.target;
		const oVal = (oEl.type === "checkbox") ? oEl.checked : oEl.value;
		return { [aEvt.target.name]: oVal };
	}

	/** Accepts an event representing a configuration change, and forwards it to
	 *  the configuration update function. */
	uHandChangeCfg(aEvt) {
		this.props.uUpd_Cfg(this.uStateFromEvtChange(aEvt));
	}

	/** Accepts an event representing a setup change, and uses it to update the
	 *  view state. */
	uHandChangeSetup(aEvt) {
		this.setState(this.uStateFromEvtChange(aEvt));
	}

	/** Causes the About view to be displayed. */
	uHandAbout(aEvt) {
		this.props.uUpd_StApp(StsApp.About);
	}

	/** Causes the Play view to be displayed. */
	uHandPlay(aEvt) {
		// This is called when controls are changed, but the user may not have
		// changed anything, so just for consistency:
		this.uStore_Setup();
		this.props.uUpd_StApp(StsApp.PlayInit);
	}

	// View content
	// ------------

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
							{Yield.uDesc(this.state.jYield)}
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
							{Pace.uDesc(this.state.jPace)}
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
