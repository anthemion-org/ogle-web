// App.js
// ======
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

// Import with:
//
//   import App from "./App.js";
//

import * as Persist from "./Persist.js";
import StsApp from "./StsApp.js";
import BackPage from "./UI/BackPage.js";
import View from "./UI/View.js";
import * as Theme from "./Theme.js";
import { uSelCfg } from "./Store/SliceSets.js";

import { React, useState, useReducer, useEffect } from "react";
import { useSelector } from "react-redux";

/** The top-level application component, to be placed in the Root element within
 *  'index.html'. */
export default function App() {
	const oCfg = useSelector(uSelCfg);
	const oNameClassTheme = Theme.ClassFromName(oCfg?.NameTheme);

	const oStAppInit = Persist.uGetPlain("StApp");
	const [ oStApp, ouUpd_StApp ] = useReducer(uNextStApp, oStAppInit);

	useEffect(
		() => Persist.uSet("StApp", oStApp),
		[oStApp]
	);

	return (
		<div id="ContainTheme" className={oNameClassTheme}>
			<BackPage />
			<View
				Cfg={oCfg}
				StApp={oStApp} uUpd_StApp={ouUpd_StApp}
			/>
		</div>
	);
}

/** A reducer that manages the top-level application state. */
function uNextStApp(aSt, aAct) {
	if (!StsApp[aAct])
		throw Error("uNextStApp: Invalid action");

	switch (aAct) {
		case StsApp.PlayInit: {
			Persist.uSet("Board", null);
			Persist.uSet("CardOgle", null);
			Persist.uSet("CardUser", null);
			Persist.uSet("TimeElap", 0);
			return StsApp.Play;
		}

		default:
			return aAct;
	}
}
