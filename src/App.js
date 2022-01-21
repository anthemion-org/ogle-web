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

/** A reducer function that manages the top-level application state. */
function uStNext(aSt, aAct) {
	if (!StApp.Views[aAct])
		throw Error("uStNext: Invalid action");

	const oSt = { View: aAct };
	Store.uSet("St", oSt);
	return oSt;
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
	St: PropTypes.object.isRequired,
	uDispatch: PropTypes.func.isRequired
};

/** The top-level component, to be placed in the Root element within
 *  'index.html'. */
export default function App() {
	const oStInit = Store.uGet("St");
	const [oSt, ouDispatch] = useReducer(uStNext, oStInit);

	return (
		<View St={oSt} uDispatch={ouDispatch} />
	);
}
