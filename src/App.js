// App.js
// ------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

// Import with:
//
//   import App from "./App.js";
//

import * as Store from "./Store.js";
import { tCfg } from "./Cfg.js";
import StsApp from "./StsApp.js";
import BackPage from "./UI/BackPage.js";
import View from "./UI/View.js";

import { React, useState, useReducer, useEffect } from "react";

/** The top-level application component, to be placed in the Root element within
 *  'index.html'. */
export default function App() {
	const oCfgInit = Store.uGetPlain("Cfg");
	const [oCfg, ouUpd_Cfg] = useState(oCfgInit);

	const oStAppInit = Store.uGetPlain("StApp");
	const [oStApp, ouUpd_StApp] = useReducer(uNextStApp, oStAppInit);

	const ouStore = () => {
		Store.uSet("Cfg", new tCfg(oCfg.NameTheme));
		Store.uSet("StApp", oStApp);
	};
	useEffect(ouStore, [oCfg, oStApp]);

	// Define default elsewhere: [todo]
	const oNameTheme = "Theme" + (oCfg?.NameTheme ? oCfg.NameTheme : "Dk");
	return (
		<div id="ContainTheme" className={oNameTheme}>
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
