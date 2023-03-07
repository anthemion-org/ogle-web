// ViewSets.js
// ===========
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import ViewSets from "./UI/ViewSets.js";
//

import "./ViewSets.css";
import Logo from "./Logo.js";
import Slide from "./Slide.js";
import Btn from "./Btn.js";
import { Set_Setup } from "../Store/SliceSets.js";
import StsApp from "../StsApp.js";
import * as Yield from "../Round/Yield.js";
import * as Pace from "../Round/Pace.js";
import * as Theme from "../Theme.js";
import * as Setup from "../Round/Setup.js";

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// ViewSets
// --------
// This view allows the user to select app configuration and game setup options.
//
// 'Configuration' options are those that affect the entire app. These are
// forwarded to every view with the `Cfg` prop, and persisted with the
// `uUpd_Cfg` prop function, which is implemented in `App.js`, and which writes
// to the `Cfg` key in the local storage. Right now, `NameTheme` is the only
// configuration option.
//
// 'Setup' options are specific to game play. They are updated with the
// `uSet_Setup` dispatch prop, which writes to the `Setup` slice.
//
// The setup selections are represented with a Setup record. This view reads the
// instance from the store, which records data in 'real' terms that are usable
// in other parts of the app. Many controls (particularly the sliders in this
// view) reference values in 'nominal' terms, such as indices, which identify
// user selections without being directly usable when playing the game. The
// `Yield.Vals` and `Pace.Vals` arrays associate nominal selections with real
// values. That allows the view (and its particular way of selecting or
// identifying values) to change without affecting the modules that consume real
// values.

/** Implements the Settings view, which is displayed when Ogle starts. The
 *  following props are required:
 *
 *  - Setup: A Setup record containing the player's game configuration
 *    selections. This prop is required;
 *
 *  - uSet_Setup: A function that dispatches a new Setup record to the store.
 *    This prop is required.
 */
class ViewSets extends React.Component {
	constructor(aProps) {
		super(aProps);

		this.state = {
			...this.props.Cfg
		};

		this.uHandChangeCfg = this.uHandChangeCfg.bind(this);
		this.uHandChangeSetup = this.uHandChangeSetup.bind(this);
		this.uHandAbout = this.uHandAbout.bind(this);
		this.uHandPlay = this.uHandPlay.bind(this);
	}

	/** Converts a Setup record into an object containing `jYield` and `jPace`
	 *  selection indices. These reference elements in `Yield.Vals` and
	 *  `Pace.Vals`.*/
	uSelsFromSetup(aSetup) {
		return {
			jYield: Yield.uIdxValMatchOrDef(aSetup),
			jPace: Pace.uIdxValMatchOrDef(aSetup)
		};
	}

	/** Converts an object containing `jYield` and `jPace` selection indices into
	 *  a Setup record. */
	uSetupFromSels(aSelsSetup) {
		const oYield = Yield.Vals[aSelsSetup.jYield][0];
		const [oPaceStart, oPaceBonus] = Pace.Vals[aSelsSetup.jPace];
		return Setup.uNew(oYield, oPaceStart, oPaceBonus);
	}

	// Event handling
	// --------------

	/** Uses properties in the specified `onChange` event to return an object
	 *  containing the name of the UI element that changed, with the new value. */
	uDataEvtChg(aEvt) {
		const oEl = aEvt.target;
		const oVal = (oEl.type === "checkbox") ? oEl.checked : oEl.value;
		return { [aEvt.target.name]: oVal };
	}

	/** Accepts an event representing a configuration change, and forwards it to
	 *  the configuration update function. */
	uHandChangeCfg(aEvt) {
		this.props.uUpd_Cfg(this.uDataEvtChg(aEvt));
	}

	/** Accepts an event representing a setup change, and uses it to update the
	 *  store. */
	uHandChangeSetup(aEvt) {
		const oSelsOrig = this.uSelsFromSetup(this.props.Setup);
		const oSelsChg = this.uDataEvtChg(aEvt);
		const oSetup = this.uSetupFromSels({ ...oSelsOrig, ...oSelsChg });
		this.props.uSet_Setup(oSetup);
	}

	/** Causes the About view to be displayed. */
	uHandAbout(aEvt) {
		this.props.uUpd_StApp(StsApp.About);
	}

	/** Causes the Play view to be displayed. */
	uHandPlay(aEvt) {
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
		const oSelsSetup = this.uSelsFromSetup(this.props.Setup);

		return (
			<div id="ViewSets" className="View">
				<Logo id="Logo" />
				<h1>Ogle settings</h1>

				<main>
					<section>
						<label htmlFor="RgYield">Yield</label>
						<div className="Name">
							{Setup.uTextShortYield(this.props.Setup)}
						</div>
						<Slide id="RgYield" name="jYield" value={oSelsSetup.jYield}
							max={Yield.Vals.length - 1} onChange={this.uHandChangeSetup} />
						<div className="Instruct">
							{Yield.uDesc(oSelsSetup.jYield)}
						</div>
					</section>

					<section>
						<label htmlFor="RgPace">Pace</label>
						<div className="Name">
							{Setup.uTextShortPace(this.props.Setup)}
						</div>
						<Slide id="RgPace" name="jPace" value={oSelsSetup.jPace}
							max={Pace.Vals.length - 1} onChange={this.uHandChangeSetup} />
						<div className="Instruct">
							{Pace.uDesc(oSelsSetup.jPace)}
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

ViewSets.propTypes = {
	StApp: PropTypes.string.isRequired,
	uUpd_StApp: PropTypes.func.isRequired,
	Setup: PropTypes.object.isRequired,
	uSet_Setup: PropTypes.func.isRequired
};

// ViewSetsConn
// ------------

function uPropsSt(aSt) {
	return { Setup: aSt.Sets.Setup };
}

function uPropsDispatch(auDispatch) {
	return {
		uSet_Setup: (aSetup) => auDispatch(Set_Setup(aSetup))
	};
}

/** Wraps and forwards store props to `ViewSets`. */
const ViewSetsConn = connect(uPropsSt, uPropsDispatch)(ViewSets);
export default ViewSetsConn;
