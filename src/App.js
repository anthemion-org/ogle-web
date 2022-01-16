// App.js
// ------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import FrmSetup from "./UI/FrmSetup";
import { tSetup } from "./Setup.js";
import * as Store from "./Store.js";

const Setup = tSetup.suFromData(Store.uGet("Setup"));

function App() {
	return (
		<>
			<h1>Ogle</h1>

			<FrmSetup Setup={Setup} />
		</>
	);
}

export default App;
