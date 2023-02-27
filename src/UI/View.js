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
import ViewSetup from "./ViewSetup";
import ViewAbout from "./ViewAbout";
import ViewPlay from "./ViewPlay";
import ViewScore from "./ViewScore";
import StsApp from "../StsApp.js";
import { tCfg } from "../Cfg.js";
import { tSetup } from "../Round/Setup.js";
import { tBoard } from "../Board/Board.js";
import { tCard } from "../Round/Card.js";
import * as StoreLoc from "../StoreLoc.js";

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
		case StsApp.Setup: {
			return <ViewSetup {...aProps} />;
		}

		case StsApp.About:
			return <ViewAbout {...aProps} />;

		case StsApp.Play: {
			const oSetup = tSetup.suFromPlain(StoreLoc.uGetPlain("Setup"));
			return <ViewPlay {...aProps} Setup={oSetup} />;
		}

		case StsApp.Score: {
			const oSetup = tSetup.suFromPlain(StoreLoc.uGetPlain("Setup"));
			const oBoard = tBoard.suFromPlain(StoreLoc.uGetPlain("Board"));
			const oCardOgle = tCard.suFromPlain(StoreLoc.uGetPlain("CardOgle"));
			const oCardUser = tCard.suFromPlain(StoreLoc.uGetPlain("CardUser"));
			return <ViewScore {...aProps} Setup={oSetup} Board={oBoard}
				CardOgle={oCardOgle} CardUser={oCardUser} />;
		}
	}
	throw Error("View: Invalid view");
}
