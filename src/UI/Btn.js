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

import { React, useState } from "react";
import PropTypes from "prop-types";

// Btn
// ---

Btn.propTypes = {
	CkDownClick: PropTypes.bool,
	CkDisabSoundClick: PropTypes.bool,
	onPointOver: PropTypes.func,
	onClick: PropTypes.func
};

/** A custom button component that plays mouse over and click sounds. The button
 *  uses no special styling. The following props are supported:
 *
 *  ~ onPointOver: The handler to be invoked when the user mouses over this
 *    button;
 *
 *  ~ onClick: The handler to be invoked when the user clicks this button.
 *
 *  ~ CkDownClick: Set to 'true' if the click handler should be invoked for the
 *    'pointer down' event. Android sometimes fails to register brief taps as
 *    clicks, so this is helpful for Play view buttons.
 *
 *  ~ CkDisabSoundClick: Set to 'true' if the click sound should not be played.
 *    This is useful when the button triggers an action that produces its own
 *    sound;
 *
 *  Other props will be forwarded to the 'button' element. */
export default function Btn(aProps) {
	/** Set to 'true' if this button has processed an 'onPointerDown' event at any
	 *  time. */
	const [oCkDown, ouSet_CkDown] = useState(false);

	function ouHandPointOver(aEvt) {
		Sound.uPointOver();

		if (aProps.onPointOver) aProps.onPointOver(aEvt);
	}

	function ouHandPointDown(aEvt) {
		ouSet_CkDown(true);

		if (!aProps.CkDownClick) return;

		aEvt.preventDefault();
		ouHandClick(aEvt);
	}

	function ouHandClick(aEvt) {
		// This works around a bizarre problem that appears on mobile devices, and
		// on desktop browsers when their DevTools emulate the same. On these
		// platforms, if the DlgPause BtnResume button happens to overlap BtnPause
		// in ViewPlay underneath it, tapping the overlapping region within BtnPause
		// displays DlgPause, as expected, but a click event then occurs within
		// BtnResume when the pointer is lifted, causing the dialog to be dismissed.
		// The events occur in this order:
		//
		// 1) BtnPause 'onPointerDown';
		//
		// 2) BtnPause 'onClick';
		//
		// 3) BtnPause 'onPointerUp' (added for testing purposese);
		//
		// 4) BtnResume 'onClick'.
		//
		// The BtnPause uses CkDownClick, and when that code is removed, the problem
		// disappears. The game can be difficult to play on Android without that
		// option, however.
		//
		// The view structure suggests that the problem is not caused by event
		// capture or bubbling. The fact that it occurs on Chrome and Firefox
		// suggests that it is not a bug; however, I don't see how it can be
		// acceptable for a 'button' to generate 'onClick' without 'onPointerDown'
		// and 'onPointerUp'. For now, this is all I can do:
		if (!oCkDown) return;

		if (!aProps.CkDisabSoundClick) Sound.uSelDie();

		if (aProps.onClick) aProps.onClick(aEvt);
	}

	/** Returns this component's props, less any component-specific props that
	 *  should not be passed to the 'button' element: */
	function ouPropsPass() {
		const oProps = {...aProps};
		delete oProps.CkDownClick;
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
			onPointerOver={ouHandPointOver} onPointerDown={ouHandPointDown}
			onClick={ouHandClick}>
			{aProps.children}
		</button>
	);
}
