// Slide.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import Slide from "./Slide.js";
//

import Sound from "../Sound.js";

import React from "react";

// Slide
// -----

/** A custom range input component that plays mouse over and change sounds. */
export default function Slide(aProps) {
	function ouHandMouseOver(aEvt) {
		Sound.uMouseOver();

		if (aProps.onMouseOver) aProps.onMouseOver(aEvt);
	}

	function ouHandChange(aEvt) {
		Sound.uSelDie();

		if (aProps.onChange) aProps.onChange(aEvt);
	}

	function ouClassName() {
		let oName = "Slide";
		if (aProps.className) oName += (" " + aProps.className);
		return oName;
	}

	return (
		<input {...aProps} type="range" className={ouClassName()} onChange={ouHandChange}
			onMouseOver={ouHandMouseOver} />
	);
}
