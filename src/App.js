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
import View from "./UI/View.js";
import { tLex } from "./Search/Lex.js";

import React, { useReducer, useEffect } from "react";

/** The top-level application component, to be placed in the Root element within
 *  'index.html'. */
export default function App() {
	const oStAppInit = Store.uGet("StApp");
	const [oStApp, ouUpd_StApp] = useReducer(uNextStApp, oStAppInit);

	const ouStore_StApp = () => Store.uSet("StApp", oStApp);
	useEffect(ouStore_StApp, [oStApp]);

	return (
		<View StApp={oStApp} uUpd_StApp={ouUpd_StApp} />
	);
}

/** A reducer that manages the top-level application state. */
function uNextStApp(aSt, aAct) {
	if (!StApp.Views[aAct])
		throw Error("uNextStApp: Invalid action");
	return { View: aAct };
}

const Lex = new tLex();

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
