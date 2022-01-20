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
		return `LookDie X${this.props.X} Y${this.props.Y}`;
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
						fill="#c7b9ab"
						clipPath="url(#ClipCrnSE)"
					></rect>
					<rect id="CrnSW"
						width="50" height="50"
						x="0" y="50"
						rx="0" ry="0"
						fill="#ebddce"
						clipPath="url(#ClipCrnSW)"
					></rect>
					<rect id="CrnNE"
						width="50" height="50"
						x="50" y="0"
						rx="0" ry="0"
						fill="#ebddce"
						clipPath="url(#ClipCrnNE)"
					></rect>
					<rect id="CrnNW"
						width="50" height="50"
						x="0" y="0"
						rx="0" ry="0"
						fill="#fff"
						clipPath="url(#ClipCrnNW)"
					></rect>
				</g>

				<rect id="Face"
					width="100" height="100"
					rx="40" ry="40"
					fill="#f5efe9"
				></rect>
			</svg>
		);
	}
}

LookDie.propTypes = {
};
