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
import ViewScore from "./ViewScore";
import StsApp from "../StsApp.js";
import { tSetup } from "../Round/Setup.js";
import { tBoard } from "../Board/Board.js";
import { tCard } from "../Round/Card.js";
import { tScorePlay } from "../Round/ScorePlay.js";
import * as Store from "../Store.js";

import { React, useReducer, useEffect } from "react";
import PropTypes from "prop-types";

// View
// ----

/** A component that selects and displays the view corresponding to the current
 *  application state. The following props are supported:
 *
 *  ~ StApp: An object containing a View property that gives the view to be
 *    displayed. This prop is required.
 *
 *  ~ uUpd_StApp: A dispatcher that triggers application state transitions. This
 *    prop is required.
 */
export default function View(aProps) {
	switch (aProps.StApp) {
		case StsApp.Setup: {
			const oSetup = tSetup.suFromPOD(Store.uGetPOD("Setup"));
			return <ViewSetup {...aProps} SetupRest={oSetup} />;
		}

		case StsApp.About:
			return <ViewAbout {...aProps} />;

		case StsApp.Play: {
			const oSetup = tSetup.suFromPOD(Store.uGetPOD("Setup"));
			const oBoard = tBoard.suFromPOD(Store.uGetPOD("Board"));
			const oCardOgleRest = tCard.suFromPOD(Store.uGetPOD("CardOgle"));
			const oCardUserRest = tCard.suFromPOD(Store.uGetPOD("CardUser"));
			const oTimeElapRest = Store.uGetPOD("TimeElap");

			return <ViewPlay {...aProps} Setup={oSetup} BoardRest={oBoard}
				CardOgleRest={oCardOgleRest} CardUserRest={oCardUserRest}
				TimeElapRest={oTimeElapRest} />;
		}

		case StsApp.Score: {
			const oSetup = tSetup.suFromPOD(Store.uGetPOD("Setup"));
			const oBoard = tBoard.suFromPOD(Store.uGetPOD("Board"));
			const oCardOgle = tCard.suFromPOD(Store.uGetPOD("CardOgle"));
			const oCardUser = tCard.suFromPOD(Store.uGetPOD("CardUser"));
			const oScoresPlayRest
				= tScorePlay.suArrFromPODs(Store.uGetPOD("ScoresPlay"));

			return <ViewScore {...aProps} Setup={oSetup} Board={oBoard}
				CardOgle={oCardOgle} CardUser={oCardUser}
				ScoresPlayRest={oScoresPlayRest} />;
		}
	}
	throw Error("View: Invalid view");
}

View.propTypes = {
	StApp: PropTypes.string.isRequired,
	uUpd_StApp: PropTypes.func.isRequired
};
