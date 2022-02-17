// Slide.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import Slide from "./Slide.js";
//

import "./Slide.css";
import Sound from "../Sound.js";

import React from "react";

// Slide
// -----

/** A custom range input component that plays mouse-over and change sounds.
 *  Unlike the built-in range control, a single click always changes the value,
 *  even if the click position is only slighly offset from the thumb. The
 *  usual range inputs props are supported. */
export default function Slide(aProps) {
	function ouHandPointOver(aEvt) {
		Sound.uPointOver();
	}

	function ouHandPointDown(aEvt) {
		aEvt.preventDefault();

		const oIn = aEvt.target;
		const oWthIn = oIn.offsetWidth;
		const oFracOrig = oIn.value / oIn.max;
		const oFracClick = (aEvt.clientX - oIn.offsetLeft) / oWthIn;

		let oVal = Math.round(oIn.max * oFracClick);
		if (oVal === parseInt(oIn.value)) {
			if (oFracClick > oFracOrig) oVal = Math.min((oVal + 1), oIn.max);
			else if (oFracClick < oFracOrig) oVal = Math.max((oVal - 1), 0);
		}

		oIn.value = oVal.toString();
		ouHandChange(aEvt);
	}

	function ouHandPointMove(aEvt) {
		// This event is also produced when the mouse hovers over the control:
		if (aEvt.buttons !== 1) return;

		aEvt.preventDefault();

		const oIn = aEvt.target;
		const oWthIn = oIn.offsetWidth;
		const oFracClick = (aEvt.clientX - oIn.offsetLeft) / oWthIn;

		// Don't select the value on the other side, as in ouHandPointDown, or it
		// will 'bounce' as the user drags:
		const oVal = Math.round(oIn.max * oFracClick);
		if (oVal === parseInt(oIn.value)) return;

		oIn.value = oVal.toString();
		ouHandChange(aEvt);
	}

	function ouHandChange(aEvt) {
		Sound.uSelDie();

		if (aProps.onChange) aProps.onChange(aEvt);
	}

	function ouClasses() {
		let oName = "Slide";
		if (aProps.className) oName += (" " + aProps.className);
		return oName;
	}

	// 'onPointerOver' fires when the mouse first enters the control region.
	// 'onPointerMove' continues to fire as the pointer moves.
	//
	// Note that we are overwriting the 'onChange' handler that was assigned in
	// the component invocation. That handler will be called within ouHandChange:
	return (
		<input {...aProps} type="range" className={ouClasses()}
			onPointerOver={ouHandPointOver} onPointerDown={ouHandPointDown}
			onPointerMove={ouHandPointMove} onChange={ouHandChange} />
	);
}
