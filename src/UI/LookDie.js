// LookDie.js
// ----------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import LookDie from "./UI/LookDie.js";
//

import "./LookDie.css";
import { tDie } from "../Board/Die.js";
import * as MetrDie from "./MetrDie.js";
import * as Dir4 from "../Util/Dir4.js";
import { tPt2 } from "../Util/Pt2.js";

import React from "react";
import PropTypes from "prop-types";

// LookDie
// -------

/** Renders one die within the board. The following props are supported:
 *
 *  ~ Pos: The board position that contains this instance. This prop is
 *  required.
 *
 *  ~ Die: The tDie instance to be rendered. This prop is required.
 *
 *  ~ CkSel: Set to 'true' if this die is selected. This prop is required.
 *
 *  ~ CkEnab: Set to 'true' if this die can be clicked. This prop is required.
 *
 *  ~ uCallTog: A function to be invoked when a die is left-clicked. This prop
 *  is required.
 */
export default class LookDie extends React.Component {
	constructor(aProps) {
		super(aProps);

		this.state = {
		};

		this.uHandClick = this.uHandClick.bind(this);
		this.uHandContext = this.uHandContext.bind(this);
	}

	uHandClick(aEvt) {
		aEvt.preventDefault();
		switch (aEvt.button) {
			// The left button:
			case 0:
				this.props.uCallTog(this.props.Pos);
				break;
			// The middle button:
			case 1:
				this.props.uCallEnt();
				break;
			// The right button:
			case 2:
				this.props.uCallEnt();
				break;
		}
	}

	uHandContext(aEvt) {
		aEvt.preventDefault();
	}

	componentDidUpdate() {
	}

	uSty() {
		return {
			gridColumnStart: (this.props.Pos.X + 1),
			gridRowStart: (this.props.Pos.Y + 1)
		}
	}

	uText() {
		if (this.props.Die.Text.length > 1)
			return (
				<text className="TextDbl"
					// Looks better when we shift this up slightly:
					x="50" y="48.5"
					fill="#000000"
					fontFamily="Georgia, serif" fontSize="50px" fontWeight="bold"
					letterSpacing="0px"
					stroke="#000000" strokeWidth="0px"
					textAnchor="middle" dominantBaseline="central"
					wordSpacing="0px">
					{this.props.Die.Text}
				</text>
			);

		return (
			<text className="TextSing"
				x="50" y="50"
				fill="#000000"
				fontFamily="Georgia, serif" fontSize="66px" fontWeight="bold"
				letterSpacing="0px"
				stroke="#000000" strokeWidth="0px"
				textAnchor="middle" dominantBaseline="central"
				wordSpacing="0px">
				{this.props.Die.Text}
			</text>
		);
	}

	uUnder() {
		const oCk = ["L", "T", "M", "W", "N", "Z"].includes(this.props.Die.Text);
		if (!oCk) return null;

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
				d="M26 83 h48"
				stopColor="#000000"
			></path>
		);
	}

	uGroupText() {
		const oDeg = Dir4.uDeg(this.props.Die.Dir4);
		const oTextTrans = `rotate(${oDeg} 50 50)`;
		return (
			<g className="Text" transform={oTextTrans}>
				{this.uText()}
				{this.uUnder()}
			</g>
		);
	}

	uSel() {
		if (!this.props.CkSel) return null;

		return (
			<circle className="Sel"
				cx="50" cy="50"
				r={MetrDie.RadSel}
				stroke="#000000"
				strokeWidth="2px"
				color="#000000"
				fill="hsla(30, 50%, 50%, 0.3)"
			></circle>
		);
	}

	uHov() {
		return (
			<circle className="DecHov"
				visibility="hidden"
				cx="50" cy="50"
				r="36"
				stroke="#000000"
				strokeWidth="2"
				strokeDasharray="3, 3"
				color="#000000"
				fill="none"
			></circle>
		);
	}

	render() {
		let oClasses = "LookDie";
		if (this.props.CkEnab) oClasses += " CkEnab";

		// When selecting dice quickly, there is a tendency to click and drag, which
		// causes many selection to be missed if onClick is used. For this reason,
		// we use onMouseDown instead:
		return (
			<svg className={oClasses} style={this.uSty()}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 100 100"
				onMouseDown={this.uHandClick}
				onContextMenu={this.uHandContext}
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
						fill="#C7B9AB"
						clipPath="url(#ClipCrnSE)"
					></rect>
					<rect className="CrnSW"
						width="50" height="50"
						x="0" y="50"
						rx="0" ry="0"
						fill="#EBDDCE"
						clipPath="url(#ClipCrnSW)"
					></rect>
					<rect className="CrnNE"
						width="50" height="50"
						x="50" y="0"
						rx="0" ry="0"
						fill="#EBDDCE"
						clipPath="url(#ClipCrnNE)"
					></rect>
					<rect className="CrnNW"
						width="50" height="50"
						x="0" y="0"
						rx="0" ry="0"
						fill="#FFFFFF"
						clipPath="url(#ClipCrnNW)"
					></rect>
				</g>

				<rect className="Face"
					width="100" height="100"
					rx="40" ry="40"
					fill="#F5EFE9"
				></rect>

				{this.uGroupText()}
				{this.uSel()}
				{this.uHov()}
			</svg >
		);
	}
}

LookDie.propTypes = {
	Pos: PropTypes.instanceOf(tPt2).isRequired,
	Die: PropTypes.instanceOf(tDie).isRequired,
	CkSel: PropTypes.bool.isRequired,
	CkEnab: PropTypes.bool.isRequired,
	uCallTog: PropTypes.func.isRequired
};
