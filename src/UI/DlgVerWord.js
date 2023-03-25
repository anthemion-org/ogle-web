// DlgVerWord.js
// =============
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import DlgVerWord from "./DlgVerWord.js";
//

import "./DlgVerWord.css";
import Btn from "./Btn.js";
import * as EntWord from "../Round/EntWord.js";

import React from "react";
import PropTypes from "prop-types";

// DlgVerWord
// ----------

DlgVerWord.propTypes = {
	Ent: PropTypes.object.isRequired,
	uHandAdd: PropTypes.func.isRequired,
	uHandCancel: PropTypes.func.isRequired
};

/** The Word Verification dialog, to be displayed when enters a word that is not
 *  recognized by Ogle. The following props are supported:
 *
 *  - Ent: An EntWord stereotype representing the user entry. This prop is
 *    required;
 *
 *  - uHandAdd: The handler to be invoked if the user accepts the word. This
 *    prop is required;
 *
 *  - uHandCancel: The handler to be invoked if the user rejects the word. This
 *    prop is required.
 */
export default function DlgVerWord(aProps) {
	const oTextEnt = EntWord.uTextAll(aProps.Ent);
	const oURL = "https://en.wiktionary.org/wiki/" + oTextEnt;

	return (
		<div className="ScrimDlg">
			<div id="DlgVerWord" className="Dlg">
				<div id="BoxWik">
					<div id="TextIntro">
						This word is not found in the Ogle lexicon:
					</div>

					<a id="BtnWik" className="BtnLink" href={oURL} target="_blank"
						rel="noopener noreferrer">
						{oTextEnt}
					</a>

					<div id="TextPromptClick">
						Click for Wiktionary entry.
					</div>
				</div>

				<hr />

				All English words are valid, with these exceptions:

				<ul>
					<li>
						No <em>person</em>, <em>place</em>, <em>organization</em>, or <em>brand</em> names. Words like <em>Frisbee</em> and <em>Judas</em> that have been genericized or repurposed are acceptable.
					</li>
					<li>
						No <em>acronyms</em>. Words like <em>snafu</em> that are no longer used as acronyms are acceptable.
					</li>
					<li>
						No words requiring <em>accents</em> or <em>punctuation</em>, including <em>contractions</em> and <em>hyphenated</em> words.
					</li>
				</ul>

				<div className="Btns">
					<Btn onClick={aProps.uHandAdd}>
						Add to lexicon
					</Btn>
					<Btn className="Group" onClick={aProps.uHandCancel}>
						Cancel entry
					</Btn>
				</div>
			</div>
		</div>
	);
}
