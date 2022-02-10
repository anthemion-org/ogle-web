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
import { tEntWord } from "../Round/EntWord.js";
import * as Cfg from "../Cfg.js";

import React from "react";
import PropTypes from "prop-types";

// LookBoard
// ---------

LookBoard.propTypes = {
	Board: PropTypes.instanceOf(tBoard).isRequired,
	Ent: PropTypes.instanceOf(tEntWord),
	CkPause: PropTypes.bool,
	uCallTog: PropTypes.func,
	uCallClear: PropTypes.func,
	uCallRecord: PropTypes.func
};

/** Displays the board, and accepts user play input. The following props are
 *  supported:
 *
 *  ~ Board: A tBoard instance representing the board to be displayed. This prop
 *    is required;
 *
 *  ~ Ent: A tEntWord instance representing the board selection, or 'null' or
 *    'undefined' if there is no selection;
 *
 *  ~ uCallTog: A function to be invoked if a die is left-clicked;
 *
 *  ~ uCallClear: A function to be invoked if the board is middle-clicked;
 *
 *  ~ uCallRecord: A function to be invoked if the board is right-clicked.
 */
export default function LookBoard(aProps) {
	/** Returns 'true' if the specified board position can be selected or
	 *  unselected. */
	function ouCkEnab(aPos) {
		return !aProps.Ent || aProps.Ent.uCkTogAt(aPos);
	}

	function ouHandClick(aEvt) {
		// We handle these here because, if they were handled in LookDie with the
		// left mouse button, and if the user happened to click the gap between two
		// dice, they would be missed:
		switch (aEvt.button) {
			// The middle button:
			case 1:
				if (aProps.uCallClear) aProps.uCallClear();
				break;
			// The right button:
			case 2:
				if (aProps.uCallRecord) aProps.uCallRecord();
				break;
		}
	}

	function ouBacksDie() {
		const oEls = [];
		const oiPosi = Cfg.RectBoard.uPosi();
		for (const oPos of oiPosi) {
			const oKey = oPos.X + "/" + oPos.Y;
			const oCkDisp = !aProps.uCallTog;
			const oCkEnab = ouCkEnab(oPos);
			oEls.push(
				<BackDie key={oKey} Pos={oPos} CkDisp={oCkDisp} CkEnab={oCkEnab} />
			);
		}
		return oEls;
	}

	function ouConnsSel() {
		const oEls = [];
		const oiPosi = Cfg.RectBoard.uPosi();
		for (const oPos of oiPosi) {
			const oKey = oPos.X + "/" + oPos.Y;
			const oPosFrom = aProps.Ent && aProps.Ent.uPosPrev(oPos);
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
			const oCkDisp = !aProps.uCallTog;
			const oCkSel = aProps.Ent && aProps.Ent.uCkAt(oPos);
			const oCkEnab = ouCkEnab(oPos);
			oEls.push(
				<LookDie key={oKey} Pos={oPos} Die={oDie} CkDisp={oCkDisp}
					CkSel={oCkSel} CkEnab={oCkEnab} CkPause={aProps.CkPause}
					uCallTog={aProps.uCallTog} />
			);
		}
		return oEls;
	}

	// There is no way to specify the z-order in SVG, so it is necessary to use
	// the painter's algorithm; connection lines are rendered after the die
	// backgrounds, and before their foregrounds. If they were rendered within
	// either of those functions, lines in certain directions would overwrite or
	// be overwritten by dice placed before or after.
	//
	// As an alternative, LookDie could adjust the connection start and end points
	// to meet the selection circles, but it is difficult for that component to
	// know its neighbors' positions:
	return (
		<div className="LookBoard"
			onMouseDown={ouHandClick}
			onPointerDown={ouHandClick}
		>
			{ouBacksDie()}
			{ouConnsSel()}
			{ouLooksDie()}
		</div>
	);
}
