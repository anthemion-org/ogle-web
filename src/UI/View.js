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
import { tBoard } from "../Board/Board.js";
import { tCard } from "../Round/Card.js";
import * as Persist from "../Persist.js";

import { React } from "react";
import PropTypes from "prop-types";

// View
// ----

View.propTypes = {
	Cfg: PropTypes.object.isRequired,
	uUpd_Cfg: PropTypes.func.isRequired,
	StApp: PropTypes.string.isRequired,
	uUpd_StApp: PropTypes.func.isRequired
};

/** Selects and displays the view that corresponds to the current application
 *  state. The following props are required:
 *
 *  - Cfg: A tCfg object containing the current application configuration. This
 *    prop is required;
 *
 *  - uUpd_Cfg: A function that updates properties in the application
 *    configuration state. This prop is required.
 *
 *  - StApp: A StsApp value that gives the view to be displayed. This prop is
 *    required;
 *
 *  - uUpd_StApp: A dispatcher that triggers application state transitions. This
 *    prop is required.
 *
 *  All these props will be forwarded to the displayed view. */
export default function View(aProps) {
	switch (aProps.StApp) {
		case StsApp.About:
			return <ViewAbout {...aProps} />;

		case StsApp.Play: {
			return <ViewPlay {...aProps} />;
		}

		case StsApp.Score: {
			const oBoard = tBoard.suFromPlain(Persist.uGetPlain("Board"));
			const oCardOgle = tCard.suFromPlain(Persist.uGetPlain("CardOgle"));
			const oCardUser = tCard.suFromPlain(Persist.uGetPlain("CardUser"));
			return <ViewScore {...aProps} Board={oBoard}
				CardOgle={oCardOgle} CardUser={oCardUser} />;
		}

		case StsApp.Sets:
		default: {
			return <ViewSetsConn {...aProps} />;
		}
	}
}
