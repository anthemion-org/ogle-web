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
import { tBoard } from "./Board/Board.js";
import ViewSetup from "./UI/ViewSetup";
import ViewAbout from "./UI/ViewAbout";
import ViewPlay from "./UI/ViewPlay";
import { tGenRnd } from "./Util/Rnd.js";

import React, { useReducer } from "react";
import PropTypes from "prop-types";

const GenRnd = new tGenRnd();

/** The top-level component, to be placed in the Root element within
 *  'index.html'. */
export default function App() {
	const oStAppInit = Store.uGet("StApp");
	const [oStApp, ouDispatStApp] = useReducer(uReducSt, oStAppInit);

	return (
		<View StApp={oStApp} uDispatStApp={ouDispatStApp} />
	);
}

/** A reducer that manages the top-level application state. */
function uReducSt(aSt, aAct) {
	if (!StApp.Views[aAct])
		throw Error("uReducSt: Invalid action");

	const oStApp = { View: aAct };
	Store.uSet("StApp", oStApp);
	return oStApp;
}

/** A component that displays the form or other view corresponding to the
 *  current application state. The following props are supported:
 *
 *  ~ StApp: The StApp.Views element representing the current state. This prop
 *    is required.
 *
 *  ~ uDispatStApp: A dispatcher that signals application state transitions.
 *    This prop is required.
 */
function View(aProps) {
	switch (aProps.StApp.View) {
		case StApp.Views.Setup: {
			const oSetup = tSetup.suFromData(Store.uGet("Setup"));
			return <ViewSetup Setup={oSetup} {...aProps} />;
		}

		case StApp.Views.About:
			return <ViewAbout {...aProps} />;

		case StApp.Views.Play: {
			const oSetup = tSetup.suFromData(Store.uGet("Setup"));
			const oBoard = new tBoard(GenRnd);
			return <ViewPlay Setup={oSetup} Board={oBoard} {...aProps} />;
		}
	}
	throw Error("View: Invalid view");
}

View.propTypes = {
	StApp: PropTypes.object.isRequired,
	uDispatStApp: PropTypes.func.isRequired
};
