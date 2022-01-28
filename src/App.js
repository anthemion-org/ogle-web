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
import StsApp from "./StsApp.js";
import View from "./UI/View.js";

import { React, useReducer, useEffect } from "react";

/** The top-level application component, to be placed in the Root element within
 *  'index.html'. */
export default function App() {
	const ouStAppInit = () => Store.uGet("StApp");
	const [oStApp, ouUpd_StApp] = useReducer(uNextStApp, null, ouStAppInit);

	const ouStore_StApp = () => Store.uSet("StApp", oStApp);
	useEffect(ouStore_StApp, [oStApp]);

	return (
		<View StApp={oStApp} uUpd_StApp={ouUpd_StApp} />
	);
}

/** A reducer that manages the top-level application state. */
function uNextStApp(aSt, aAct) {
	if (!StsApp[aAct])
		throw Error("uNextStApp: Invalid action");

	switch (aAct) {
		case StsApp.Setup: {
			return StsApp.Setup;
		}

		case StsApp.PlayInit: {
			Store.uSet("Board", null);
			Store.uSet("CardOgle", null);
			Store.uSet("CardUser", null);
			Store.uSet("TimeElap", 0);
			return StsApp.Play;
		}

		default:
			return aAct;
	}
}
