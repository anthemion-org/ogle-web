// LookBoard.js
// ============
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
import * as Board from "../Board/Board.js";
import * as EntWord from "../Round/EntWord.js";
import * as Rect from "../Util/Rect.js";
import * as Const from "../Const.js";

import React from "react";
import PropTypes from "prop-types";

// LookBoard
// ---------

LookBoard.propTypes = {
	Board: PropTypes.object.isRequired,
	Ent: PropTypes.object,
	CkPause: PropTypes.bool,
	uCallTog: PropTypes.func,
	uCallClear: PropTypes.func,
	uCallRecord: PropTypes.func
};

/** Displays the board, and accepts user play input. The following props are
 *  supported:
 *
 *  - Board: A Board record representing the board to be displayed. This prop
 *    is required;
 *
 *  - Ent: An EntWord record representing the board selection, or a falsy value
 *    if there is no selection;
 *
 *  - uCallTog: A function to be invoked if a die is left-clicked;
 *
 *  - uCallClear: A function to be invoked if the board is middle-clicked;
 *
 *  - uCallRecord: A function to be invoked if the board is right-clicked.
 */
export default function LookBoard(aProps) {
	/** Returns `true` if the specified board position can be selected or
	 *  unselected. */
	function ouCkEnab(aPos) {
		return !aProps.Ent || EntWord.uCkTogAt(aProps.Ent, aPos);
	}

	function ouHandPointDown(aEvt) {
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
		const oiPosi = Rect.uPosi(Const.RectBoard);
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
		const oiPosi = Rect.uPosi(Const.RectBoard);
		for (const oPos of oiPosi) {
			const oKey = oPos.X + "/" + oPos.Y;
			const oPosFrom = aProps.Ent && EntWord.uPosPrev(aProps.Ent, oPos);
			oEls.push(
				<ConnSel key={oKey} Pos={oPos} PosFrom={oPosFrom} />
			);
		}
		return oEls;
	}

	function ouLooksDie() {
		const oEls = [];
		const oiPosi = Rect.uPosi(Const.RectBoard);
		for (const oPos of oiPosi) {
			const oKey = oPos.X + "/" + oPos.Y;
			const oDie = Board.uDie(aProps.Board, oPos);
			const oCkDisp = !aProps.uCallTog;
			const oCkSel = aProps.Ent && EntWord.uCkAt(aProps.Ent, oPos);
			const oCkSelFirst = aProps.Ent && !EntWord.uPosPrev(aProps.Ent, oPos);
			const oCkEnab = ouCkEnab(oPos);
			oEls.push(
				<LookDie key={oKey} Pos={oPos} Die={oDie} CkDisp={oCkDisp}
					CkSel={oCkSel} CkSelFirst={oCkSelFirst} CkEnab={oCkEnab}
					CkPause={aProps.CkPause} uCallTog={aProps.uCallTog} />
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
	// know its neighbors' positions.
	//
	// There is a tendency to leave the left mouse button down while clicking the
	// right, and for whatever reason, that prevents the click from firing when
	// onPointerDown is used by itself. The `preventDefault` calls that were in
	// the handlers produced the same problem, so I removed those too. Everything
	// seems to be working now, but this is obviously more complex than expected.
	// This document might help if there is more trouble:
	//
	//   https://w3c.github.io/pointerevents/
	//
	return (
		<div className="LookBoard"
			onMouseDown={ouHandPointDown} onPointerDown={ouHandPointDown}
		>
			{ouBacksDie()}
			{ouConnsSel()}
			{ouLooksDie()}
		</div>
	);
}
