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
import * as Misc from "../Util/Misc.js";

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
			<path key={aj} className="Ray" d={oCmd} />
		);
	}

	function ouRays(aCt) {
		const oIdxs = Array.from(Array(aCt), (a, aj) => aj);
		return oIdxs.map(a => ouRay(aCt, a));
	}

	const oRadCtr = 10;

	function ouCirc(aCt, aj) {
		const oFac = 1 - Math.pow((Math.cos((1 / aCt * aj) * (Math.PI / 2))), 0.5);
		const oRad = oRadCtr + (50 * oFac);
		return (
			<circle key={aj} className="Circ" cx="50" cy="50" r={oRad} />
		);
	}

	function ouCircs(aCt) {
		const oIdxs = Array.from(Array(aCt), (a, aj) => aj);
		return oIdxs.map(a => ouCirc(aCt, a));
	}

	// The pattern elements are sized relative to the viewbox, so the pattern
	// scales as the 'svg' element varies in size. I couldn't find a way to size
	// the pattern in absolute terms, so we will fix the 'svg' element size and
	// place it within #ContainBackPage, with that element set not to scroll:
	return (
		<div id="ContainBackPage">
			<svg id="BackPage"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 100 100"
			>
				{ouRays(180)}
				{ouCircs(180)}

				<circle className="Ctr" cx="50" cy="50" r={oRadCtr} />
			</svg >
		</div>
	);
}
