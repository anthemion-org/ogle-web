// ViewAbout.js
// ============
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import ViewAbout from "./UI/ViewAbout.js";
//

import "./ViewAbout.css";
import Logo from "./Logo.js";
import Btn from "./Btn.js";
import StsApp from "../StsApp.js";
import { Set_StApp } from "../Store/SliceApp.js";
// This exposes 'package.json' to the client, which is said to have security
// implications in some cases, but ours is already open to the public:
import Pack from "../../package.json";

import React from "react";
import { useDispatch } from "react-redux";

// ViewAbout
// ---------

/** Implements the About view. Aside from those used by all `View` instances, no
 *  props are supported. */
export default function ViewAbout() {
	const ouDispatch = useDispatch();

	function ouHandOK(aEvt) {
		ouDispatch(Set_StApp(StsApp.Sets));
	}

	return (
		<div id="ViewAbout" className="View">
			<main>
				<section>
					<Logo id="Logo" />
					<h1>Ogle</h1>

					<div>Version {Pack.version}</div>
				</section>

				<section>
					<p>
						Copyright ©2006-2022 Jeremy Kelly<br />
						<a href="https://www.anthemion.org/ogle.html" target="_blank"
							rel="noopener noreferrer">
							www.anthemion.org
						</a>
					</p>

					<p>
						Ogle word lists derive from<br />
						<a href="http://wordlist.aspell.net/" target="_blank"
							rel="noopener noreferrer">SCOWL</a><br />
						Copyright ©2000-2004 Kevin Atkinson
					</p>
				</section>

				<section>
					<p>
						View Ogle source code at<br />
						<a href="https://github.com/anthemion-org/ogle-web" target="_blank"
							rel="noopener noreferrer">GitHub</a>
					</p>

					<p>
						Send your questions to<br />
						<a href="mailto://support@anthemion.org">support@anthemion.org</a>
					</p>
				</section>
			</main>

			<div className="Btns">
				<Btn onClick={ouHandOK}>OK</Btn>
			</div>
		</div>
	);
}
