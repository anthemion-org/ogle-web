// DlgHelp.js
// ----------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import DlgHelp from "./DlgHelp.js";
//

import "./DlgHelp.css";
import Btn from "./Btn.js";

import React from "react";
import PropTypes from "prop-types";

// DlgHelp
// -------

DlgHelp.propTypes = {
	uHandOK: PropTypes.func.isRequired
};

/** The Help dialog, to be displayed when the user clicks the Play view Help
 *  button. The following prop is supported:
 *
 *  - uHandOK: The handler to be invoked when the OK button is clicked. This
 *    prop is required.
 */
export default function DlgHelp(aProps) {
	// This dialog does not scroll, so if the OK button somehow escapes the
	// viewport, there will be no way to click it. We will attach the click
	// handler to the background just in case:
	return (
		<div id="DlgHelp" onClick={aProps.uHandOK}>
			<article>
				<section id="SecGen">
					<h1>Ogle help</h1>

					<p>
						<em>Find all the words you can before time runs out!</em>
					</p>
					<p>
						Words must be <em>four or more letters</em> long.
						The <em>Qu</em> die counts as two letters. No names, acronymns,
						accents, or punctuation marks are allowed.
					</p>
					<p>
						Each valid word scores one point. Words also add time to the clock,
						with longer words adding more time.
					</p>
				</section>

				<section id="SecFollow">
					<h2>Followed words</h2>

					<p>
						A word is <em>followed</em> if it can be made into another word by
						appending letters. If you enter one word and <em>follow</em> it with
						another, the followed word will be discarded. Enter only the longest
						word to maximize your points and time.
					</p>
				</section>

				<div className="Btns">
					<Btn>OK</Btn>
				</div>
			</article>
		</div>
	);
}
