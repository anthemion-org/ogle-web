// View.js
// =======
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import View from "./UI/View.js";
//

import "./View.css";
import ViewSetsConn from "./ViewSets";
import ViewAbout from "./ViewAbout";
import ViewPlay from "./ViewPlay";
import ViewScore from "./ViewScore";
import ViewScram from "./ViewScram";
import StsApp from "../StsApp.js";
import { uSelStApp, uSelCkScram } from "../Store/SliceApp.js";

import { React } from "react";
import { useSelector } from "react-redux";

// View
// ----

/** Selects and displays the view that corresponds to the current application
 *  state. No props are supported. */
export default function View() {
	const oStApp = useSelector(uSelStApp);
	const oCkScram = useSelector(uSelCkScram);

	if (oCkScram) return <ViewScram />;

	switch (oStApp) {
		case StsApp.About:
			return <ViewAbout />;

		case StsApp.Play:
			return <ViewPlay />;

		case StsApp.Score:
			return <ViewScore />;

		case StsApp.Sets:
		default:
			return <ViewSetsConn />;
	}
}
