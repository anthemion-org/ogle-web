// BackDie.js
// ----------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import BackDie from "./UI/BackDie.js";
//

import "./Die.css";
import { tPt2 } from "../Util/Pt2.js";

import React from "react";
import PropTypes from "prop-types";

// BackDie
// -------

BackDie.propTypes = {
	Pos: PropTypes.instanceOf(tPt2).isRequired,
	CkEnab: PropTypes.bool,
	CkDisp: PropTypes.bool
};

/** Renders the background of one die within the board. The following props are
 *  supported:
 *
 *  - Pos: The board position that contains this instance. This prop is
 *    required;
 *
 *  - CkEnab: Set to `true` if the die can be selected or unselected;
 *
 *  - CkDisp: Set to `true` if the die is being rendered in 'display-only'
 *    mode.
 */
export default function BackDie(aProps) {
	const oSty = {
		gridColumnStart: (aProps.Pos.X + 1),
		gridRowStart: (aProps.Pos.Y + 1)
	}

	let oClasses = "BackDie";
	if (aProps.CkDisp) oClasses += " CkDisp";
	if (aProps.CkEnab) oClasses += " CkEnab";

	return (
		<svg className={oClasses} style={oSty}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 100 100"
		>
			<defs>
				<clipPath id="ClipCrnNW">
					<rect
						width="100" height="100"
						x="0" y="0"
						rx="12" ry="12"
						fill="#000000"
					></rect>
				</clipPath>
				<clipPath id="ClipCrnNE">
					<rect
						width="100" height="100"
						x="0" y="0"
						rx="12" ry="12"
						fill="#000000"
					></rect>
				</clipPath>
				<clipPath id="ClipCrnSW">
					<rect
						width="100" height="100"
						x="0" y="0"
						rx="12" ry="12"
						fill="#000000"
					></rect>
				</clipPath>
				<clipPath id="ClipCrnSE">
					<rect
						width="100" height="100"
						x="0" y="0"
						rx="12" ry="12"
						fill="#000000"
					></rect>
				</clipPath>
			</defs>

			<g className="Crns">
				<rect className="CrnSE"
					width="50" height="50"
					x="50" y="50"
					rx="0" ry="0"
					clipPath="url(#ClipCrnSE)"
				></rect>
				<rect className="CrnSW"
					width="50" height="50"
					x="0" y="50"
					rx="0" ry="0"
					clipPath="url(#ClipCrnSW)"
				></rect>
				<rect className="CrnNE"
					width="50" height="50"
					x="50" y="0"
					rx="0" ry="0"
					clipPath="url(#ClipCrnNE)"
				></rect>
				<rect className="CrnNW"
					width="50" height="50"
					x="0" y="0"
					rx="0" ry="0"
					clipPath="url(#ClipCrnNW)"
				></rect>
			</g>

			<rect className="Face"
				width="100" height="100"
				rx="40" ry="40"
			></rect>
		</svg >
	);
}
