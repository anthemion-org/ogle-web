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
import ConnSel from "./ConnSel.js";
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
		oSel = new tSelBoard(aProps.Board, new tPt2(2, 1), oSel);
		oSel = new tSelBoard(aProps.Board, new tPt2(3, 1), oSel);
		oSel = new tSelBoard(aProps.Board, new tPt2(3, 2), oSel);
		oSel = new tSelBoard(aProps.Board, new tPt2(4, 2), oSel);
		oSel = new tSelBoard(aProps.Board, new tPt2(4, 1), oSel);

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
		const oEls = [];
		for (let oX = 0; oX < Cfg.WthBoard; ++oX)
			for (let oY = 0; oY < Cfg.HgtBoard; ++oY) {
				const oKey = oX + "/" + oY;
				const oPos = new tPt2(oX, oY);
				const oDie = this.props.Board.uDie(oPos);
				const oSelAt = this.state.Sel.uSelAt(oPos);
				oEls.push(
					<LookDie key={oKey} Pos={oPos} Die={oDie} CkSel={!!oSelAt} />
				);
			}
		return oEls;
	}

	uConnsSel() {
		const oEls = [];
		for (let oX = 0; oX < Cfg.WthBoard; ++oX)
			for (let oY = 0; oY < Cfg.HgtBoard; ++oY) {
				const oKey = oX + "/" + oY;
				const oPos = new tPt2(oX, oY);
				const oSelAt = this.state.Sel.uSelAt(oPos);
				const oPosFrom = oSelAt?.SelPrev?.Pos;
				oEls.push(
					<ConnSel key={oKey} Pos={oPos} PosFrom={oPosFrom}/>
				);
			}
		return oEls;
	}

	render() {
		// There is no way to specify the z-order in SVG, so it is necessary to
		// render the connection lines after all of the dice. If they were rendered
		// in LookDie, connections in certain directions would be partially
		// overwritten by dice placed after the connecting die:
		return (
			<div id="LookBoard">
				{this.uLooksDie()}
				{this.uConnsSel()}
			</div>
		);
	}
}

LookBoard.propTypes = {
};
