// ViewPlay.js
// -----------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import ViewPlay from "./UI/ViewPlay.js";
//

import "./ViewPlay.css";
import * as Store from "../Store.js";
import * as View from "../StApp.js";
import { tSetup } from "../Setup.js";
import { tBoard } from "../Board/Board.js";
import LookBoard from "./LookBoard.js";

import React from "react";
import PropTypes from "prop-types";

// ViewPlay
// --------

/** Implements the Play view. Along with St and uDispatch, the following props
 *  are supported:
 *
 *  ~ Setup: A tSetup instance that gives the user settings. This prop is
 *    required.
 */
export default class ViewPlay extends React.Component {
	constructor(aProps) {
		super(aProps);
		this.uDispatch = aProps.uDispatch;

		this.state = {
			CkPause: false
		};

		this.uHandPause = this.uHandPause.bind(this);
		this.uHandEnd = this.uHandEnd.bind(this);
		this.uHandResume = this.uHandResume.bind(this);
	}

	uHandPause(aEvt) {
		this.setState({ CkPause: true });
	}

	uHandEnd(aEvt) {
		this.uDispatch(View.Views.Setup);
	}

	uHandResume(aEvt) {
		this.setState({ CkPause: false });
	}

	componentDidUpdate() {
	}

	uDlgPause() {
		if (!this.state.CkPause) return null;

		return (
			<div className="ScreenDlg">
				<div id="DlgPause">
					<button onClick={this.uHandEnd}>End round</button>
					<button onClick={this.uHandResume}>Resume</button>
				</div>
			</div>
		);
	}

	render() {
		return (
			<div id="ViewPlay">
				<h1>Ogle</h1>

				<LookBoard Board={this.props.Board} />

				<div className="Btns">
					<button onClick={this.uHandPause}>Pause</button>
				</div>

				{this.uDlgPause()}
			</div>
		);
	}
}

ViewPlay.propTypes = {
	St: PropTypes.object.isRequired,
	uDispatch: PropTypes.func.isRequired,
	Setup: PropTypes.instanceOf(tSetup).isRequired,
	Board: PropTypes.instanceOf(tBoard).isRequired
};
