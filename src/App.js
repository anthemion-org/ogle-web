// App.js
// ------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import FrmSetup from "./UI/FrmSetup";
import { tSetup } from "./Setup.js";

const Setup = new tSetup(1, 1);

function App() {
	return (
		<>
			<h1>Ogle</h1>

			<FrmSetup Setup={Setup} />
		</>
	);
}

export default App;
