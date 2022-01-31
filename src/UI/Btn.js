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

/** A custom button component that plays mouse over and click sounds. The usual
 *  button props are supported, plus:
 *
 *  ~ CkDisabSoundClick: Set to 'true' if the click sound should not be played.
 *    This is useful when the button triggers an action that produces its own
 *    sound.
 */
export default function Btn(aProps) {
	function ouHandMouseOver(aEvt) {
		Sound.uMouseOver();

		if (aProps.onMouseOver) aProps.onMouseOver(aEvt);
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
		<button {...ouPropsPass()} className={ouClassName()} onClick={ouHandClick}
			onMouseOver={ouHandMouseOver}>
			{aProps.children}
		</button>
	);
}
