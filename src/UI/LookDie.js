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
import { tBoard } from "../Board/Board.js";
import * as Dir4 from "../Util/Dir4.js";

import React from "react";
import PropTypes from "prop-types";

// LookDie
// --------

export default class LookDie extends React.Component {
	constructor(aProps) {
		super(aProps);
		this.uDispatch = aProps.uDispatch;

		this.state = {
		};

		this.uHandClick = this.uHandClick.bind(this);
	}

	uHandClick(aEvt) {
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

	uFrom() {
		if (!this.props.PosFrom) return null;

		/** The position of the 'from' die, relative to this die, in die
		 *  coordinates.*/
		const oPosRelFrom = this.props.PosFrom.uDiff(this.props.Pos);
		/** The amount by which the offsets should be scaled, to reach from one
		 *  selection circle edge to another. */
		const oSc = (oPosRelFrom.X && oPosRelFrom.Y) ? Math.SQRT1_2 : 1;
		/** The X adjustment that moves the endpoint from the center of this die to
		 *  the edge of its selection circle. */
		const oXSh = RadSel * oSc * oPosRelFrom.X;
		/** The Y adjustment that moves the endpoint from the center of this die to
		 *  the edge of its selection circle. */
		const oYSh = RadSel * oSc * oPosRelFrom.Y;

		const oXStart = (50 + (oPosRelFrom.X * 100)) - oXSh;
		const oYStart = (50 + (oPosRelFrom.Y * 100)) - oYSh;
		const oXEnd = 50 + oXSh;
		const oYEnd = 50 + oYSh;
		const oCmd = `M${oXStart} ${oYStart} L${oXEnd} ${oYEnd}`;
		return (
			<path className="From"
				fill="none"
				stroke="#000000"
				strokeDasharray="3, 3"
				strokeDashoffset="0"
				strokeLinejoin="round"
				strokeMiterlimit="4"
				strokeOpacity="1"
				strokeWidth="2"
				d={oCmd}
				stopColor="#000000"
			></path>
		);
	}

	uSel() {
		if (!this.props.CkSel) return null;

		return (
			<circle className="Sel"
				cx="50" cy="50"
				r={RadSel}
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
		return (
			// Set 'overflow' to 'visible' so the die can draw selection connectors
			// outside its own viewport:
			<svg className="LookDie" style={this.uSty()}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 100 100" overflow="visible"
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
				{this.uFrom()}
				{this.uSel()}
				{this.uHov()}
			</svg >
		);
	}
}

LookDie.propTypes = {
};

/** The selection circle radius. */
const RadSel = 40;
