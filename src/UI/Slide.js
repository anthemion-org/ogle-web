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
import PropTypes from "prop-types";

// Slide
// -----

Slide.propTypes = {
	onMouseOver: PropTypes.func,
	onChange: PropTypes.func
};

/** A custom range input component that plays mouse-over and change sounds. The
 *  following props are supported:
 *
 *  ~ onMouseOver: The handler to be invoked when the user mouses over the
 *    slider;
 *
 *  ~ onChange: The handler to be invoked when the user moves the slider.
 *
 *  Other props will be forwarded to the 'button' element. */
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
		<input {...aProps} type="range" className={ouClassName()}
			onChange={ouHandChange} onMouseOver={ouHandMouseOver} />
	);
}
