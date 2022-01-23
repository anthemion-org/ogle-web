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
export default function LookBoard(aProps) {
	/** Returns 'true' if the specified board position can be selected or
	 *  unselected. */
	function ouCkEnab(aPos) {
		return !aProps.Sel || aProps.Sel.uCkTogAt(aPos);
	}

	function ouBacksDie() {
		const oEls = [];
		const oiPosi = Cfg.RectBoard.uPosi();
		for (const oPos of oiPosi) {
			const oKey = oPos.X + "/" + oPos.Y;
			oEls.push(
				<BackDie key={oKey} Pos={oPos} />
			);
		}
		return oEls;
	}

	function ouConnsSel() {
		const oEls = [];
		const oiPosi = Cfg.RectBoard.uPosi();
		for (const oPos of oiPosi) {
			const oKey = oPos.X + "/" + oPos.Y;
			const oSelAt = aProps.Sel && aProps.Sel.uSelAt(oPos);
			const oPosFrom = oSelAt?.SelPrev?.Pos;
			oEls.push(
				<ConnSel key={oKey} Pos={oPos} PosFrom={oPosFrom} />
			);
		}
		return oEls;
	}

	function ouLooksDie() {
		const oEls = [];
		const oiPosi = Cfg.RectBoard.uPosi();
		for (const oPos of oiPosi) {
			const oKey = oPos.X + "/" + oPos.Y;
			const oDie = aProps.Board.uDie(oPos);
			const oSelAt = aProps.Sel && aProps.Sel.uSelAt(oPos);
			oEls.push(
				<LookDie key={oKey} Pos={oPos} Die={oDie} CkSel={!!oSelAt}
					CkEnab={ouCkEnab(oPos)} uCallTog={aProps.uCallTog}
					uCallClear={aProps.uCallClear} uCallEnt={aProps.uCallEnt} />
			);
		}
		return oEls;
	}

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
			{ouBacksDie()}
			{ouConnsSel()}
			{ouLooksDie()}
		</div>
	);
}

LookBoard.propTypes = {
	Board: PropTypes.instanceOf(tBoard).isRequired
};
