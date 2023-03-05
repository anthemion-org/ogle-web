// LookDie.js
// ==========
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import LookDie from "./UI/LookDie.js";
//

import "./Die.css";
import { tDie } from "../Board/Die.js";
import * as MetrDie from "./MetrDie.js";
import Feed from "../Feed.js";
import * as Dir4 from "../Util/Dir4.js";
import * as Pt2 from "../Util/Pt2.js";

import React from "react";
import PropTypes from "prop-types";

// LookDie
// -------

LookDie.propTypes = {
	Pos: PropTypes.object.isRequired,
	Die: PropTypes.instanceOf(tDie).isRequired,
	CkSel: PropTypes.bool,
	CkEnab: PropTypes.bool,
	CkPause: PropTypes.bool,
	CkDisp: PropTypes.bool,
	uCallTog: PropTypes.func
};

/** Displays the text and other foreground for one die within the board, and
 *  forwards mouse input. The following props are supported:
 *
 *  - Pos: A Pt2 record representing the board position that contains this
 *    instance. This prop is required;
 *
 *  - Die: The tDie instance at this board position. This prop is required;
 *
 *  - CkSel: Set to `true` if this die is selected;
 *
 *  - CkEnab: Set to `true` if this die can be selected or unselected;
 *
 *  - CkPause: Set to `true` if the board is being rendered in 'pause' mode;
 *
 *  - CkDisp: Set to `true` if the board is being rendered in 'display-only'
 *    mode;
 *
 *  - uCallTog: A function to be invoked if the die is left-clicked.
 */
export default function LookDie(aProps) {
	function ouHandPointOver(aEvt) {
		if (!aProps.CkDisp) Feed.uPointOver();
	}

	function ouHandPointDown(aEvt) {
		// The left button:
		if ((aEvt.button === 0) && aProps.uCallTog)
			aProps.uCallTog(aProps.Pos);

		// The middle and right buttons are handled in LookBoard.
	}

	function ouBackText() {
		return (
			<circle className="BackText"
				cx="50" cy="50"
				r={MetrDie.RadSel}
				stroke="none"
			></circle>
		);
	}

	function ouText() {
		if (aProps.CkPause)
			return (
				<text className="TextPause"
					x="50" y="50"
					fontSize="70px"
					letterSpacing="0px"
					stroke="#000000" strokeWidth="0px"
					textAnchor="middle" dominantBaseline="central"
					wordSpacing="0px"
				>
					?
				</text>
			);

		if (aProps.Die.Text.length > 1)
			return (
				<text className="TextDbl"
					x="50" y="50"
					fontSize="55px"
					letterSpacing="0px"
					stroke="#000000" strokeWidth="0px"
					textAnchor="middle" dominantBaseline="central"
					wordSpacing="0px"
				>
					{aProps.Die.Text}
				</text>
			);

		return (
			<text className="TextSing"
				x="50" y="50"
				fontSize="70px"
				letterSpacing="0px"
				stroke="#000000" strokeWidth="0px"
				textAnchor="middle" dominantBaseline="central"
				wordSpacing="0px"
			>
				{aProps.Die.Text}
			</text>
		);
	}

	function ouUnder() {
		const oCk = [ "L", "T", "M", "W", "N", "Z" ].includes(aProps.Die.Text);
		if (!oCk || aProps.CkPause) return null;

		return (
			<path className="Under"
				fill="none"
				stroke="#000000"
				strokeDasharray="3, 3"
				strokeDashoffset="0"
				strokeLinejoin="round"
				strokeMiterlimit="4"
				strokeOpacity="1"
				strokeWidth="2"
				d="M26,83 h48"
				stopColor="#000000"
			></path>
		);
	}

	function ouGroupText() {
		const oDeg = Dir4.uDeg(aProps.Die.Dir4);
		const oTextTrans = `rotate(${oDeg} 50 50)`;
		return (
			<g className="Text" transform={oTextTrans}>
				{ouText()}
				{ouUnder()}
			</g>
		);
	}

	function ouMarkSel() {
		if (!aProps.CkSel) return null;

		let oClasses = "MarkSel";
		if (aProps.CkSelFirst) oClasses += " First";

		return (
			<circle className={oClasses}
				cx="50" cy="50"
				r={MetrDie.RadSel}
				stroke="#000000"
				strokeWidth="2px"
				color="#000000"
			></circle>
		);
	}

	function ouMarkEnab() {
		// The 'strokeDasharray' values, like the 'stroke-dashoffset' animation
		// attribute, should be chosen to divide evenly into the circumference.
		// Otherwise, a discontinuity will appear in the circle:
		return (
			<circle className="MarkEnab"
				visibility="hidden"
				cx="50" cy="50"
				r="36"
				stroke="#000000"
				strokeWidth="2"
				strokeDasharray="3.14, 3.14"
				color="#000000"
				fill="none"
			></circle>
		);
	}

	let oClasses = "LookDie";
	if (aProps.CkDisp) oClasses += " CkDisp";
	if (aProps.CkEnab) oClasses += " CkEnab";

	const oSty = {
		gridColumnStart: (aProps.Pos.X + 1),
		gridRowStart: (aProps.Pos.Y + 1)
	};

	// When entering words quickly, there is a tendency to click and drag, which
	// causes many selections to be missed if onClick is used to toggle die
	// selections. For that reason, I replaced onClick with onMouseDown, and later
	// onPointerDown.
	//
	// Note that only the left mouse button clicks are handled here; the middle
	// and right are left to LookBoard:
	return (
		<svg className={oClasses} style={oSty}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 100 100"
			onPointerOver={ouHandPointOver} onPointerDown={ouHandPointDown}
		>
			{ouBackText()}
			{ouMarkSel()}
			{ouMarkEnab()}
			{ouGroupText()}
		</svg >
	);
}
