// LookBoard.js
// ------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import LookBoard from "./UI/LookBoard.js";
//

import "./LookBoard.css";
import LookDie from "./LookDie.js";
import * as Cfg from "../Cfg.js";

import React from "react";
import PropTypes from "prop-types";

// LookBoard
// ---------

export default class LookBoard extends React.Component {
	constructor(aProps) {
		super(aProps);
		this.uDispatch = aProps.uDispatch;

		this.state = {
		};

		this.uHandClick = this.uHandClick.bind(this);
	}

	uHandClick(aEvt) {
	}

	componentDidUpdate() {
	}

	uLooksDie() {
		const oLooks = [];
		for (let oX = 0; oX < Cfg.WthBoard; ++oX)
			for (let oY = 0; oY < Cfg.HgtBoard; ++oY)
				oLooks.push(<LookDie X={oX} Y={oY} />);
		return oLooks;
	}

	render() {
		return (
			<div id="LookBoard">
				{this.uLooksDie()}
			</div>
		);
	}
}

LookBoard.propTypes = {
};