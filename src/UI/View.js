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
import StsApp from "../StsApp.js";
import * as Board from "../Board/Board.js";
import * as Card from "../Round/Card.js";
import { uSelStApp } from "../Store/SliceApp.js";
import * as Persist from "../Persist.js";

import { React } from "react";
import { useSelector } from "react-redux";

// View
// ----

/** Selects and displays the view that corresponds to the current application
 *  state. No props are supported. */
export default function View(aProps) {
	const oStApp = useSelector(uSelStApp);
	switch (oStApp) {
		case StsApp.About:
			return <ViewAbout {...aProps} />;

		case StsApp.Play: {
			return <ViewPlay {...aProps} />;
		}

		case StsApp.Score: {
			const oBoard = Board.uFromParse(Persist.uGetPlain("Board"));
			const oCardOgle = Card.uFromParse(Persist.uRead("CardOgle"));
			const oCardUser = Card.uFromParse(Persist.uRead("CardUser"));
			return <ViewScore {...aProps} Board={oBoard}
				CardOgle={oCardOgle} CardUser={oCardUser} />;
		}

		case StsApp.Sets:
		default: {
			return <ViewSetsConn {...aProps} />;
		}
	}
}
