// BackPage.js
// -----------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import BackPage from "./UI/BackPage.js";
//

import "./BackPage.css";

import React from "react";

// BackPage
// --------

export default function BackPage(aProps) {
	function ouRay(aCt, aj) {
		const oWthSpan = 2 * Math.PI / aCt;
		const oWthRay = oWthSpan / 2;
		const oStart = oWthSpan * aj;
		const oEnd = oStart + oWthRay;

		const oDist = 150;
		const oXStart = 50 + (Math.cos(oStart) * oDist);
		const oYStart = 50 + (Math.sin(oStart) * oDist);
		const oXEnd = 50 + (Math.cos(oEnd) * oDist);
		const oYEnd = 50 + (Math.sin(oEnd) * oDist);

		const oCmd = `M50,50 L${oXStart},${oYStart} L${oXEnd},${oYEnd} L50,50`;
		return (
			<path key={aj} className="Ray"
				strokeLinejoin="round"
				strokeOpacity="1"
				d={oCmd}
				stopColor="#000000"
			></path>
		);
	}

	function ouRays(aCt) {
		const oIdxs = Array.from(Array(aCt), (a, aj) => aj);
		return oIdxs.map(a => ouRay(aCt, a));
	}

	return (
	// Set 'overflow' to 'visible' so the element can draw outside its own
	// viewport:
		<svg id="BackPage"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 100 100" overflow="visible"
		>
			{ouRays(24)}
		</svg >
	);
}
