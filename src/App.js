// App.js
// ======
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

// Import with:
//
//   import App from "./App.js";
//

import BoundErr from "./UI/BoundErr.js";
import BackPage from "./UI/BackPage.js";
import View from "./UI/View.js";
import * as Theme from "./Theme.js";
import { uSelCfg } from "./Store/SliceApp.js";

import { React } from "react";
import { useSelector } from "react-redux";

/** The top-level application component, to be placed in the Root element within
 *  'index.html'. */
export default function App() {
	const oCfg = useSelector(uSelCfg);
	const oNameClassTheme = Theme.ClassFromName(oCfg?.NameTheme);

	return (
		<div id="ContainTheme" className={oNameClassTheme}>
			<BoundErr>
				<BackPage />
				<View />
			</BoundErr>
		</div>
	);
}
