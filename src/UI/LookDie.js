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

	uNamesClass() {
		// Inline the style instead: [to do]
		return `LookDie X${this.props.Pos.X} Y${this.props.Pos.Y}`;
	}

	uText() {
		if (this.props.Die.Text.length > 1)
			return (
				<text id="TextDbl"
					// Looks better when we shift this up slightly:
					x="50" y="48.5"
					fill="#000000"
					fontFamily="Georgia" fontSize="50px" fontWeight="bold"
					letterSpacing="0px"
					stroke="#000000" strokeWidth="0px"
					textAlign="center" textAnchor="middle"
					dominantBaseline="central"
					wordSpacing="0px">
					{this.props.Die.Text}
				</text>
			);

		return (
			<text id="TextSing"
				x="50" y="50"
				fill="#000000"
				fontFamily="Georgia" fontSize="66px" fontWeight="bold"
				letterSpacing="0px"
				stroke="#000000" strokeWidth="0px"
				textAlign="center" textAnchor="middle"
				dominantBaseline="central"
				wordSpacing="0px">
				{this.props.Die.Text}
			</text>
		);
	}

	uUnder() {
		const oCk = ["L", "T", "M", "W", "N", "Z"].includes(this.props.Die.Text);
		if (!oCk) return null;

		return (
			<path
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
			<g id="Text" transform={oTextTrans}>
				{this.uText()}
				{this.uUnder()}
			</g>
		);
	}

	render() {
		return (
			<svg className={this.uNamesClass()}
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

				<g id="Crns">
					<rect id="CrnSE"
						width="50" height="50"
						x="50" y="50"
						rx="0" ry="0"
						fill="#C7B9AB"
						clipPath="url(#ClipCrnSE)"
					></rect>
					<rect id="CrnSW"
						width="50" height="50"
						x="0" y="50"
						rx="0" ry="0"
						fill="#EBDDCE"
						clipPath="url(#ClipCrnSW)"
					></rect>
					<rect id="CrnNE"
						width="50" height="50"
						x="50" y="0"
						rx="0" ry="0"
						fill="#EBDDCE"
						clipPath="url(#ClipCrnNE)"
					></rect>
					<rect id="CrnNW"
						width="50" height="50"
						x="0" y="0"
						rx="0" ry="0"
						fill="#FFFFFF"
						clipPath="url(#ClipCrnNW)"
					></rect>
				</g>

				<rect id="Face"
					width="100" height="100"
					rx="40" ry="40"
					fill="#F5EFE9"
				></rect>

				{this.uGroupText()}
			</svg >
		);
	}
}

LookDie.propTypes = {
};
