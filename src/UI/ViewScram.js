// ViewScram.js
// ============
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import ViewScram from "./UI/ViewScram.js";
//

import "./ViewScram.css";

// ViewScram
// ---------

/** Implements the Scram view. No props are supported. */
export default function ViewScram() {
	return (
		<div id="ViewScram" className="View">
			<main>
				<section>
					<h3>Ogle is running in another tab!</h3>
					<p>
						Refresh this tab to play again here,
						or close this tab and continue in the other.
					</p>
				</section>
			</main>
		</div>
	);
}
