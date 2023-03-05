// ConnSel.js
// ==========
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import ConnSel from "./UI/ConnSel.js";
//

import * as Pt2 from "../Util/Pt2.js";

import React from "react";
import PropTypes from "prop-types";

// ConnSel
// -------

ConnSel.propTypes = {
	Pos: PropTypes.object.isRequired,
	PosFrom: PropTypes.object
};

/** Draws a selection connecting line between one die and another. The following
 *  props are supported:
 *
 *  - Pos: A Pt2 record representing the board position that contains this
 *    instance. If PosFrom is defined, this is the end position of the
 *    connector. This prop is required;
 *
 *  - PosFrom: A Pt2 record representing the board position where the
 *    connecting line originates, if this instance is part of a selection, and
 *    if it is not the first die in the selection. 'undefined' otherwise.
 */
export default function ConnSel(aProps) {
	function ouFrom() {
		if (!aProps.PosFrom) return null;

		/** The position of the 'from' die, relative to this die, in die
		 *  coordinates.*/
		const oPosRelFrom = Pt2.uDiff(aProps.PosFrom, aProps.Pos);
		// These coordinates ignore the grid gap, so they only approximate the
		// center of the previous die:
		const oXStart = (50 + (oPosRelFrom.X * 100));
		const oYStart = (50 + (oPosRelFrom.Y * 100));
		const oCmd = `M${oXStart},${oYStart} L50,50`;
		return (
			<path className="From"
				fill="none"
				stroke="#000000"
				strokeDasharray="3,3"
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

	const oSty = {
		gridColumnStart: (aProps.Pos.X + 1),
		gridRowStart: (aProps.Pos.Y + 1)
	};

	// Set 'overflow' to 'visible' so the element can draw outside its own
	// viewport:
	return (
		<svg className="ConnSel" style={oSty}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 100 100" overflow="visible"
		>
			{ouFrom()}
		</svg >
	);
}
