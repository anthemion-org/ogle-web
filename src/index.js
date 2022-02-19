// index.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import React from "react";
import ReactDOM from "react-dom";
//import ReportPerform from "./ReportPerform";

import "./index.css";
import App from "./App";

import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("Root")
);

// Write performance data to the browser console:
//ReportPerform(console.log);

serviceWorkerRegistration.register();
