// App.js
// ======
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

// Import with:
//
//   import App from "./App.js";
//

import * as StoreLoc from "./StoreLoc.js";
import StsApp from "./StsApp.js";
import BackPage from "./UI/BackPage.js";
import View from "./UI/View.js";
import * as Theme from "./Theme.js";

import { React, useState, useReducer, useEffect } from "react";

/** The top-level application component, to be placed in the Root element within
 *  'index.html'. */
export default function App() {
	const oCfgInit = StoreLoc.uGetPlain("Cfg");
	const [oCfg, ouUpd_Cfg] = useState(oCfgInit);

	const oStAppInit = StoreLoc.uGetPlain("StApp");
	const [oStApp, ouUpd_StApp] = useReducer(uNextStApp, oStAppInit);

	useEffect(
		() => StoreLoc.uSet("Cfg", oCfg),
		[oCfg,]
	);
	useEffect(
		() => StoreLoc.uSet("StApp", oStApp),
		[oStApp]
	);

	return (
		<div id="ContainTheme" className={Theme.ClassFromName(oCfg?.NameTheme)}>
			<BackPage />
			<View
				Cfg={oCfg} uUpd_Cfg={ouUpd_Cfg}
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
			StoreLoc.uSet("Board", null);
			StoreLoc.uSet("CardOgle", null);
			StoreLoc.uSet("CardUser", null);
			StoreLoc.uSet("TimeElap", 0);
			return StsApp.Play;
		}

		default:
			return aAct;
	}
}
