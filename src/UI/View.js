// View.js
// -------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import View from "./UI/View.js";
//

import ViewSetup from "./ViewSetup";
import ViewAbout from "./ViewAbout";
import ViewPlay from "./ViewPlay";
import * as StApp from "../StApp.js";
import { tSetup } from "../Round/Setup.js";
import { tBoard } from "../Board/Board.js";
import { tCard } from "../Round/Card.js";
import * as Store from "../Store.js";

import { React, useReducer, useEffect } from "react";
import PropTypes from "prop-types";

// View
// ----

/** A component that selects and displays the view corresponding to the current
 *  application state. The following props are supported:
 *
 *  ~ StApp: The StApp.Views element representing the current state. This prop
 *    is required.
 *
 *  ~ uUpd_StApp: A dispatcher that triggers application state transitions. This
 *    prop is required.
 */
export default function View(aProps) {
	switch (aProps.StApp.View) {
		case StApp.Views.Setup: {
			const oSetup = tSetup.suFromPOD(Store.uGet("Setup"));
			return <ViewSetup SetupRest={oSetup} {...aProps} />;
		}

		case StApp.Views.About:
			return <ViewAbout {...aProps} />;

		case StApp.Views.Play: {
			const oSetup = tSetup.suFromPOD(Store.uGet("Setup"));
			const oBoard = tBoard.suFromPOD(Store.uGet("Board"));
			const oCardOgleRest = tCard.suFromPOD(Store.uGet("CardOgle"));
			const oCardUserRest = tCard.suFromPOD(Store.uGet("CardUser"));

			return <ViewPlay Setup={oSetup} BoardRest={oBoard}
				CardOgleRest={oCardOgleRest} CardUserRest={oCardUserRest}
				{...aProps} />;
		}
	}
	throw Error("View: Invalid view");
}

View.propTypes = {
	StApp: PropTypes.object.isRequired,
	uUpd_StApp: PropTypes.func.isRequired
};
