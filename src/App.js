// App.js
// ------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import FrmSetup from "./UI/FrmSetup";
import PanAbout from "./UI/PanAbout";
import { tSetup } from "./Setup.js";
import * as Store from "./Store.js";

const Setup = tSetup.suFromData(Store.uGet("Setup"));

function App() {
	// <FrmSetup Setup={Setup} />
	return (
		< PanAbout />
	);
}

export default App;
