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
import { tLex } from "./Search/Lex.js";
import { tGenRnd } from "./Util/Rnd.js";

import React, { useReducer, useEffect } from "react";
import PropTypes from "prop-types";

/** The top-level application component, to be placed in the Root element within
 *  'index.html'. */
export default function App() {
	const oStAppInit = Store.uGet("StApp");
	const [oStApp, ouUpd_StApp] = useReducer(uNextStApp, oStAppInit);

	function ouStore_StApp() {
		Store.uSet("StApp", oStApp);
	}
	useEffect(ouStore_StApp, [oStApp]);

	return (
		<View StApp={oStApp} uUpd_StApp={ouUpd_StApp} />
	);
}

const GenRnd = new tGenRnd();
const Lex = new tLex();

/** A reducer that manages the top-level application state. */
function uNextStApp(aSt, aAct) {
	if (!StApp.Views[aAct])
		throw Error("uReducSt: Invalid action");
	return { View: aAct };
}

function uCreate_Board(aSetup) {
	const Work = new Worker(new URL("./Search/WorkSearch.js", import.meta.url));

	Work.postMessage({
		WordsSearch: Lex.WordsSearch,
		Setup: aSetup
	});
	Work.onmessage = function (aMsg) {
		console.log(aMsg.data.SelsOgle.length);
	};
}

/** A component that displays the form or other view corresponding to the
 *  current application state. The following props are supported:
 *
 *  ~ StApp: The StApp.Views element representing the current state. This prop
 *    is required.
 *
 *  ~ uUpd_StApp: A dispatcher that signals application state transitions.
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
	uUpd_StApp: PropTypes.func.isRequired
};
