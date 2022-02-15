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
	function ouDie(ajX, ajY, aText, aRot, aCkAlt) {
		const oSize = 4;
		const oMarg = 0.1;
		const oRadCrn = 0.4;

		const oNameClassExt = aCkAlt ? "Alt" : "";
		const oX = oSize * ajX;
		const oY = oSize * ajY;
		const oXMid = oX + (oSize / 2);
		const oYMid = oY + (oSize / 2);
		const oTrans = `rotate(${aRot} ${oXMid} ${oYMid})`;
		return (
			<>
				<rect className={"BackDieFace " + oNameClassExt}
					x={oX + oMarg} y={oY + oMarg}
					width={oSize - (oMarg * 2)} height={oSize - (oMarg * 2)}
					rx={oRadCrn} ry={oRadCrn}
				/>
				<text className={"BackDieText " + oNameClassExt}
					x={oXMid} y={oYMid}
					textAnchor="middle" dominantBaseline="central"
					fontSize="3.33" letterSpacing="0" wordSpacing="0"
					fontFamily="'Brygada 1918', serif" fontWeight="bold"
					strokeWidth="0px" user-select="none"
					transform={oTrans}>
					{aText}
				</text>
			</>
		);
	}

	// The pattern elements are sized relative to the viewbox, so the pattern
	// scales as the 'svg' element varies in size. I couldn't find a way to size
	// the pattern in absolute terms, so we will fix the 'svg' element size and
	// place it within #ContBackPage, with that element set not to scroll:
	return (
		<div id="ContBackPage">
			<svg id="BackPage"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"
				overflow="visible"
			>
				<defs>
					<pattern id="PattDie"
						x="0" y="0"
						width="16" height="16"
						patternTransform="rotate(-45)"
						patternUnits="userSpaceOnUse">

						{ouDie(0, 0, "O", 0, true)}
						{ouDie(1, 0, "G", 90, false)}
						{ouDie(2, 0, "O", 180, false)}
						{ouDie(3, 0, "G", 270, false)}
						{ouDie(0, 1, "L", 0, false)}
						{ouDie(1, 1, "E", 90, false)}
						{ouDie(2, 1, "L", 180, true)}
						{ouDie(3, 1, "E", 270, false)}
						{ouDie(0, 2, "O", 0, false)}
						{ouDie(1, 2, "G", 90, true)}
						{ouDie(2, 2, "O", 180, false)}
						{ouDie(3, 2, "G", 270, false)}
						{ouDie(0, 3, "L", 0, false)}
						{ouDie(1, 3, "E", 90, false)}
						{ouDie(2, 3, "L", 180, false)}
						{ouDie(3, 3, "E", 270, true)}
					</pattern>
				</defs>

				<rect
					x="0" y="0"
					width="100" height="100"
					strokeWidth="0" fill="url(#PattDie)"
				/>
			</svg >
		</div>
	);
}
