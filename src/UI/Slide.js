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

import { React, useRef } from "react";
import PropTypes from "prop-types";

// Slide
// -----

Slide.propTypes = {
	onPointOver: PropTypes.func,
	onChange: PropTypes.func
};

/** A custom range input component that plays mouse-over and change sounds.
 *  Unlike the built-in range control, a single click always changes the value,
 *  even if the click position is only slighly offset from the thumb. The
 *  following props are supported:
 *
 *  ~ onPointOver: The handler to be invoked when the user mouses over the
 *    slider;
 *
 *  ~ onChange: The handler to be invoked when the user moves the slider. An
 *    event other than onChange may be passed to this handler.
 *
 *  Other props will be forwarded to the 'button' element. */
export default function Slide(aProps) {
	function ouHandPointOver(aEvt) {
		Sound.uPointOver();

		if (aProps.onPointOver) aProps.onPointOver(aEvt);
	}

	function ouHandPointDown(aEvt) {
		aEvt.preventDefault();

		const oIn = aEvt.target;
		const oWthIn = oIn.offsetWidth;
		const oFracOrig = oIn.value / oIn.max;
		const oFracClick = (aEvt.clientX - oIn.offsetLeft) / oWthIn;

		let oVal = Math.round(oIn.max * oFracClick);
		// 'value' is a string:
		if (oVal == oIn.value) {
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
		// 'value' is a string:
		if (oVal == oIn.value) return;

		oIn.value = oVal.toString();
		ouHandChange(aEvt);
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

	// 'onPointerOver' fires when the mouse first enters the control region.
	// 'onPointerMove' continues to fire as the pointer moves:
	return (
		<input {...aProps} type="range" className={ouClassName()}
			onPointerOver={ouHandPointOver} onPointerDown={ouHandPointDown}
			onPointerMove={ouHandPointMove} />
	);
}
