// index.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import React from "react";
import ReactDOM from "react-dom";
//import ReportPerform from "./ReportPerform";

import App from "./App";
import "./index.css";

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("Root")
);

// Write performance data to the browser console:
//ReportPerform(console.log);
