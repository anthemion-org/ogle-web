// Logo.js
// =======
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import Logo from "./UI/Logo";
//

import "./Die.css";
import BackDie from "./BackDie.js";
import { tPt2 } from "../Util/Pt2.js";

import React from "react";

export default function Logo(aProps) {
	const oPos = new tPt2(0, 0);

	return (
		<svg {...aProps} className="Logo"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 100 100"
		>
			<BackDie Pos={oPos} CkDisp={true} />

			<text className="Text"
				x="50" y="50"
				fontSize="80px"
				letterSpacing="0px"
				stroke="#000000" strokeWidth="0px"
				textAnchor="middle" dominantBaseline="central"
				wordSpacing="0px"
			>
				O
			</text>
		</svg>
	);
}
