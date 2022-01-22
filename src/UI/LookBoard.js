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
import BackDie from "./BackDie.js";
import ConnSel from "./ConnSel.js";
import LookDie from "./LookDie.js";
import { tBoard } from "../Board/Board.js";
import { tPt2 } from "../Util/Pt2.js";
import * as Cfg from "../Cfg.js";

import React from "react";
import PropTypes from "prop-types";

// LookBoard
// ---------

/** Displays the board, and accepts user play input. The following props are
 *  supported:
 *
 *  ~ Board: A tBoard instance representing the board to be played. This prop is
 *    required.
 *
 *  ~ Sel: A tSelBoard instance representing the board selection, or 'undefined'
 *    if there is no selection.
 *
 *  ~ uCallTog: A function to be invoked when the die is left-clicked. This prop
 *    is required.
 *
 *  ~ uCallClear: A function to be invoked when the die is middle-clicked. This
 *    prop is required.
 *
 *  ~ uCallEnt: A function to be invoked when the die is right-clicked. This
 *    prop is required.
 */
export default class LookBoard extends React.Component {
	/** Returns 'true' if the specified board position can be selected or
	 *  unselected. */
	uCkEnab(aPos) {
		return !this.props.Sel
			|| this.props.Sel.uCkAddAt(aPos)
			|| !!this.props.Sel.SelsByPos.uGet(aPos);
	}

	uBacksDie() {
		const oEls = [];
		for (let oX = 0; oX < Cfg.WthBoard; ++oX)
			for (let oY = 0; oY < Cfg.HgtBoard; ++oY) {
				const oKey = oX + "/" + oY;
				const oPos = new tPt2(oX, oY);
				oEls.push(
					<BackDie key={oKey} Pos={oPos} />
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
				const oSelAt = this.props.Sel && this.props.Sel.uSelAt(oPos);
				const oPosFrom = oSelAt?.SelPrev?.Pos;
				oEls.push(
					<ConnSel key={oKey} Pos={oPos} PosFrom={oPosFrom} />
				);
			}
		return oEls;
	}

	uLooksDie() {
		const oEls = [];
		for (let oX = 0; oX < Cfg.WthBoard; ++oX)
			for (let oY = 0; oY < Cfg.HgtBoard; ++oY) {
				const oKey = oX + "/" + oY;
				const oPos = new tPt2(oX, oY);
				const oDie = this.props.Board.uDie(oPos);
				const oSelAt = this.props.Sel && this.props.Sel.uSelAt(oPos);
				oEls.push(
					<LookDie key={oKey} Pos={oPos} Die={oDie} CkSel={!!oSelAt}
						CkEnab={this.uCkEnab(oPos)} uCallTog={this.props.uCallTog}
						uCallClear={this.props.uCallClear} uCallEnt={this.props.uCallEnt} />
				);
			}
		return oEls;
	}

	render() {
		// There is no way to specify the z-order in SVG, so it is necessary to
		// render the connection lines after the die backgrounds, and before their
		// foregrounds. If they were rendered within either of those, lines in
		// certain directions would overwrite or be overwritten by dice placed
		// before or after.
		//
		// As an alternative, LookDie could adjust the connection start and end
		// points to meet the selection circles, but it is difficult for that
		// component to know its neighbors' positions:
		return (
			<div id="LookBoard">
				{this.uBacksDie()}
				{this.uConnsSel()}
				{this.uLooksDie()}
			</div>
		);
	}
}

LookBoard.propTypes = {
	Board: PropTypes.instanceOf(tBoard).isRequired
};
