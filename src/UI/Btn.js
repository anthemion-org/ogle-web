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
import PropTypes from "prop-types";

// Btn
// ---

Btn.propTypes = {
	CkDisabSoundClick: PropTypes.bool,
	onPointOver: PropTypes.func,
	onClick: PropTypes.func
};

/** A custom button component that plays mouse over and click sounds. The button
 *  uses no special styling. The following props are supported:
 *
 *  ~ CkDisabSoundClick: Set to 'true' if the click sound should not be played.
 *    This is useful when the button triggers an action that produces its own
 *    sound;
 *
 *  ~ onPointOver: The handler to be invoked when the user mouses over this
 *    button;
 *
 *  ~ onClick: The handler to be invoked when the user clicks this button.
 *
 *  Other props will be forwarded to the 'button' element. */
export default function Btn(aProps) {
	function ouHandPointOver(aEvt) {
		Sound.uPointOver();

		if (aProps.onPointOver) aProps.onPointOver(aEvt);
	}

	function ouHandClick(aEvt) {
		if (!aProps.CkDisabSoundClick) Sound.uSelDie();

		if (aProps.onClick) aProps.onClick(aEvt);
	}

	/** Returns this component's props, less any component-specific props that
	 *  should not be passed to the 'button' element: */
	function ouPropsPass() {
		const oProps = {...aProps};
		delete oProps.CkDisabSoundClick;
		return oProps;
	}

	function ouClassName() {
		let oName = "Btn";
		if (aProps.className) oName += (" " + aProps.className);
		return oName;
	}

	return (
		<button {...ouPropsPass()} className={ouClassName()}
			onPointerOver={ouHandPointOver} onClick={ouHandClick}>
			{aProps.children}
		</button>
	);
}
