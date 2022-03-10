// View.js
// -------
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
import { tSetup } from "../Round/Setup.js";
import { tBoard } from "../Board/Board.js";
import { tCard } from "../Round/Card.js";
import * as Store from "../Store.js";

import { React } from "react";
import PropTypes from "prop-types";

// View
// ----

View.propTypes = {
	StApp: PropTypes.string.isRequired,
	uUpd_StApp: PropTypes.func.isRequired
};

/** Selects and displays the view that corresponds to the current application
 *  state. The following props are supported:
 *
 *  ~ StApp: A StsApp value that gives the view to be displayed. This prop is
 *    required;
 *
 *  ~ uUpd_StApp: A dispatcher that triggers application state transitions. This
 *    prop is required.
 *
 *  Both these props will be forwarded to the displayed view. */
export default function View(aProps) {
	switch (aProps.StApp) {
		case StsApp.Setup: {
			return <ViewSetup {...aProps} />;
		}

		case StsApp.About:
			return <ViewAbout {...aProps} />;

		case StsApp.Play: {
			const oSetup = tSetup.suFromPOD(Store.uGetPOD("Setup"));
			return <ViewPlay {...aProps} Setup={oSetup} />;
		}

		case StsApp.Score: {
			const oSetup = tSetup.suFromPOD(Store.uGetPOD("Setup"));
			const oBoard = tBoard.suFromPOD(Store.uGetPOD("Board"));
			const oCardOgle = tCard.suFromPOD(Store.uGetPOD("CardOgle"));
			const oCardUser = tCard.suFromPOD(Store.uGetPOD("CardUser"));
			return <ViewScore {...aProps} Setup={oSetup} Board={oBoard}
				CardOgle={oCardOgle} CardUser={oCardUser} />;
		}
	}
	throw Error("View: Invalid view");
}
