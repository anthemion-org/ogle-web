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
import Feed from "../Feed.js";

import React from "react";

// Slide
// -----

/** A custom range input component that plays mouse-over and change sounds or
 *  vibrations. Unlike the built-in range control, a single click always changes
 *  the value, even if the click position is only slighly offset from the thumb.
 *  The usual range inputs props are supported. */
export default function Slide(aProps) {
	function ouHandPointOver(aEvt) {
		Feed.uPointOver();
	}

	// Different rules are used in ouHandPointDown and ouHandPointMove to
	// determine whether a new value is selected; for this reason, there must be
	// no track position to which both rules apply, otherwise the thumb may
	// 'bounce' between values as the user clicks down, and then generates one or
	// more drag events. This boundary is determined implicitly by oFracDead.

	/** The distance on either side of the thumb that does not cause the adjacent
	 *  value to be selected during a 'pointer down' event, as a fraction of the
	 *  total distance between values. */
	const oFracDead = 0.1;

	function ouHandPointDown(aEvt) {
		aEvt.preventDefault();

		const oIn = aEvt.target;
		const oFracNew = (aEvt.clientX - oIn.offsetLeft) / oIn.offsetWidth;
		let oValNew = Math.round(oIn.max * oFracNew);
		if (oValNew === parseInt(oIn.value)) {
			const oFracOrig = oIn.value / oIn.max;
			const oFracDiff = oFracNew - oFracOrig;
			const oFracPer = 1.0 / oIn.max;
			const oFracDeadPer = oFracPer * oFracDead;
			// Select the value on the other side of the click unless the mouse is
			// very close to the current value:
			if (oFracDiff > oFracDeadPer)
				oValNew = Math.min((oValNew + 1), oIn.max);
			else if (oFracDiff < -oFracDeadPer)
				oValNew = Math.max((oValNew - 1), 0);
			else return;
		}

		oIn.value = oValNew.toString();
		ouHandChange(aEvt);
	}

	function ouHandPointMove(aEvt) {
		// This event is also produced when the mouse hovers over the control:
		if (aEvt.buttons !== 1) return;

		aEvt.preventDefault();

		const oIn = aEvt.target;
		const oFracOrig = oIn.value / oIn.max;
		const oFracNew = (aEvt.clientX - oIn.offsetLeft) / oIn.offsetWidth;
		const oFracPer = 1.0 / oIn.max;
		// We must make it slightly easier to select the next value, otherwise it
		// will be impossible to drag to the first or last values, beyond which the
		// user cannot drag:
		const oFracPerMod = oFracPer * (1 - oFracDead);
		// Don't select the value on the other side, as in ouHandPointDown, unless
		// the mouse is very close to the next value:
		if (Math.abs(oFracNew - oFracOrig) < oFracPerMod) return;

		const oValNew = Math.round(oIn.max * oFracNew);
		oIn.value = oValNew.toString();
		ouHandChange(aEvt);
	}

	function ouHandChange(aEvt) {
		Feed.uSelDie();

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
