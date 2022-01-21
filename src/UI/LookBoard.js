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
import { tSelBoard } from "../Board/SelBoard.js";
import { tPt2 } from "../Util/Pt2.js";
import * as Cfg from "../Cfg.js";

import React from "react";
import PropTypes from "prop-types";

// LookBoard
// ---------

export default class LookBoard extends React.Component {
	constructor(aProps) {
		super(aProps);
		this.uDispatch = aProps.uDispatch;

		let oSel = new tSelBoard(aProps.Board, new tPt2(0, 0));
		oSel = new tSelBoard(aProps.Board, new tPt2(1, 1), oSel);
		oSel = new tSelBoard(aProps.Board, new tPt2(4, 4), oSel);

		this.state = {
			Sel: oSel
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
			for (let oY = 0; oY < Cfg.HgtBoard; ++oY) {
				const oPos = new tPt2(oX, oY);
				const oDie = this.props.Board.uDie(oPos);
				const oCkSel = this.state.Sel.uCkPos(oPos);
				oLooks.push(<LookDie Pos={oPos} Die={oDie} CkSel={oCkSel} />);
			}
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
