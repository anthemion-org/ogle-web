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
				oLooks.push(<LookDie Pos={oPos} Die={oDie} />);
			}
		return oLooks;
	}

	/** Returns the center position of the specified die. */
	uCtrDie(aPos) {
		// This function requires that the following values:

		/** The LookBoard size, within the page. */
		const oSizeBoard = 50;
		/** The LookBoard padding. */
		const oPadBoard = 0.2;
		/** The LookBoard grid gap. */
		const oGapBoard = 0.1;

		// match the CSS attributes applied to the 'look':
		//
		//   #LookBoard {
		//     width: 50vh;
		//     height: 50vh;
		//     padding: 0.2vh;
		//     gap: 0.1vh;
		//     ...
		//
		// Moreover, all must use the same units.

		const oCtDie = Cfg.WthBoard;

		/** The amount by which these coordinates should be scaled. Setting this to
		 *  a number that implicitly sizes the dice at around 100 units allows SVG
		 *  to be copied to and from LookDie. Otherwise, stroke widths and other
		 *  attributes would have very different effects. */
		const oSc = 10;
		const oSizeDieSc = (oSizeBoard - (oPadBoard * 2) - (oGapBoard * 4))
			/ oCtDie * oSc;
		const oGapSc = oGapBoard * oSc;
		const oPadSc = oPadBoard * oSc;

		const oX = oPadSc + (oSizeDieSc / 2) + (aPos.X * (oSizeDieSc + oGapSc));
		const oY = oPadSc + (oSizeDieSc / 2) + (aPos.Y * (oSizeDieSc + oGapSc));
		return new tPt2(oX, oY);
	}

	uNodeSel(aPos) {
		const oCtr = this.uCtrDie(aPos);
		return (
			<circle className="Sel"
				cx={oCtr.X} cy={oCtr.Y}
				r="32"
				stroke="#000000"
				strokeWidth="2px"
				color="#000000"
				fill="hsla(30, 50%, 50%, 0.3)"
			></circle>
		);
	}

	uSel() {
		const oNodes = [];
		let oSel = this.state.Sel;
		while (oSel) {
			oNodes.push(this.uNodeSel(oSel.Pos));
			oSel = oSel.SelPrev;
		}

		return (
			<svg id="Sel"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 500 500"
			>
				{oNodes}
			</svg >
		);
	}

	render() {
		return (
			<div id="LookBoard">
				{this.uLooksDie()}
				{this.uSel()}
			</div>
		);
	}
}

LookBoard.propTypes = {
};
