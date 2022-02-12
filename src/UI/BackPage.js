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
	function ouDie(ajX, ajY, aCkLt) {
		const oSize = 4;
		const oMarg = 0.1;
		const oRadCrn = 0.4;

		const oNameClassExt = aCkLt ? "Lt" : "";
		const oX = oSize * ajX;
		const oY = oSize * ajY;
		const oXMid = oX + (oSize / 2);
		const oYMid = oY + (oSize / 2);
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
					fontSize="3" letterSpacing="0" wordSpacing="0"
					fontFamily="Georgia, serif" fontWeight="bold"
					strokeWidth="0px" user-select="none" >
					O
				</text>
			</>
		);
	}

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
						width="16" height="12"
						patternTransform="rotate(-45)"
						patternUnits="userSpaceOnUse">

						{ouDie(0, 0, false)}
						{ouDie(1, 0, false)}
						{ouDie(2, 0, false)}
						{ouDie(3, 0, false)}
						{ouDie(0, 1, false)}
						{ouDie(1, 1, false)}
						{ouDie(2, 1, false)}
						{ouDie(3, 1, true)}
						{ouDie(0, 2, false)}
						{ouDie(1, 2, true)}
						{ouDie(2, 2, false)}
						{ouDie(3, 2, false)}
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
