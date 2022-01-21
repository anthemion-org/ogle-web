// ConnSel.js
// ----------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import ConnSel from "./UI/ConnSel.js";
//

import "./ConnSel.css";
import * as MetrDie from "./MetrDie.js";
import { tPt2 } from "../Util/Pt2.js";

import React from "react";
import PropTypes from "prop-types";

// ConnSel
// -------

/** Draws a connecting line between one die selection marker and another. The
 *  following props are supported:
 *
 *  ~ Pos: The board position that contains this instance. If PosFrom is
 *  defined, this determines the end position of the connector. This prop is
 *  required.
 *
 *  ~ PosFrom: The board position where the connecting line originates, if this
 *  position is selected, and if it is not the first die in the selection;
 *  'undefined' otherwise.
 */
export default class ConnSel extends React.Component {
	uSty() {
		return {
			gridColumnStart: (this.props.Pos.X + 1),
			gridRowStart: (this.props.Pos.Y + 1)
		}
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
		const oXSh = MetrDie.RadSel * oSc * oPosRelFrom.X;
		/** The Y adjustment that moves the endpoint from the center of this die to
		 *  the edge of its selection circle. */
		const oYSh = MetrDie.RadSel * oSc * oPosRelFrom.Y;

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

	render() {
		return (
			// Set 'overflow' to 'visible' so the element can draw selection
			// connectors outside its own viewport:
			<svg className="ConnSel" style={this.uSty()}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 100 100" overflow="visible"
			>
				{this.uFrom()}
			</svg >
		);
	}
}

ConnSel.propTypes = {
	Pos: PropTypes.instanceOf(tPt2).isRequired,
	PosFrom: PropTypes.instanceOf(tPt2)
};
