// Btn.js
// ------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import Btn from "./Btn.js";
//

import Sound from "../Sound.js";

import React from "react";

// Btn
// ---

/** A custom button component that plays mouse over and click sounds. */
export default function Btn(aProps) {
	function ouHandMouseOver(aEvt) {
		Sound.uMouseOver();

		if (aProps.onMouseOver) aProps.onMouseOver(aEvt);
	}

	function ouHandClick(aEvt) {
		Sound.uSelDie();

		if (aProps.onClick) aProps.onClick(aEvt);
	}

	function ouClassName() {
		let oName = "Btn";
		if (aProps.className) oName += (" " + aProps.className);
		return oName;
	}

	return (
		<button {...aProps} className={ouClassName()} onClick={ouHandClick}
			onMouseOver={ouHandMouseOver}>
			{aProps.children}
		</button>
	);
}
