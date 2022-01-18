// App.js
// ------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import App from "./App.js";
//

import * as Store from "./Store.js";
import * as StApp from "./StApp.js";
import { tSetup } from "./Setup.js";
import FrmSetup from "./UI/FrmSetup";
import PanAbout from "./UI/PanAbout";

import React, { useReducer } from "react";

/** A reducer function that manages the top-level application state. */
function uStNext(aSt, aAct) {
	if (!StApp.Views[aAct])
		throw Error("uStNext: Invalid action");
	return { View: aAct };
}

/** A component that displays the form or other view corresponding to the
 *  current application state. The following props are supported:
 *
 *  ~ St: The StApp.Views element representing the current state. This prop is
 *    required.
 *
 *  ~ uDispatch: The dispatcher function that should be used to signal a state
 *    transition. This prop is required.
 */
function View(aProps) {
	switch (aProps.St.View) {
		case StApp.Views.Setup: {
			const oSetup = tSetup.suFromData(Store.uGet("Setup"));
			return <FrmSetup Setup={oSetup} {...aProps} />;
		}
		case StApp.Views.About:
			return <PanAbout {...aProps} />;
		default:
			throw Error("uView: Invalid view");
	}
}

/** The top-level component, to be placed in the Root element within
 *  'index.html'. */
export default function App() {
	const oStInit = { View: StApp.Views.Setup };
	const [oSt, ouDispatch] = useReducer(uStNext, oStInit);

	return (
		<View St={oSt} uDispatch={ouDispatch} />
	);
}
