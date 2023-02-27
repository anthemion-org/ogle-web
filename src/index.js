// index.js
// ========
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import Store from "./Store/Store.js";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import ReportPerform from "./ReportPerform";

import "./index.css";
import App from "./App";

import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.render(
	<React.StrictMode>
		<Provider store={Store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById("Root")
);

// Set to 'true' to write performance data to the browser console, and to enable
// recording within the Profiler tab in the React DevTools:
const oCkProfile = false;
if (oCkProfile) ReportPerform(console.log);

// This function checks for the production build:
serviceWorkerRegistration.register();
