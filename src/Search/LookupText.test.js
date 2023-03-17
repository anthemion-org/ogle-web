// LookupText.test.js
// ==================
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tLookupText, OutsLookup } from "./LookupText.js";
import Lex from "./Lex.js";

test("tLookupText: Enumeration", () => {
	// 'ogles' is one of the built-in words:
	const oLookupOFull = new tLookupText(Lex.WordsSearch, "o");

	let oOut = oLookupOFull.uExec(false);
	expect(oOut).toBe(OutsLookup.Miss);

	const oLookupO = new tLookupText(Lex.WordsSearch, "o");
	oOut = oLookupO.uExec(true);
	expect(oOut).toBe(OutsLookup.Frag);

	const oLookupOG = tLookupText.suFromPrev(oLookupO, "og");
	oOut = oLookupOG.uExec(true);
	expect(oOut).toBe(OutsLookup.Frag);

	const oLookupOGL = tLookupText.suFromPrev(oLookupOG, "ogl");
	oOut = oLookupOGL.uExec(true);
	expect(oOut).toBe(OutsLookup.Frag);

	const oLookupOGLE = tLookupText.suFromPrev(oLookupOGL, "ogle");
	oOut = oLookupOGLE.uExec(true);
	// The word list includes 'ogle' and various words (such as 'ogles') that
	// follow it. Any of them could be encountered first, and this will change as
	// words are added to or removed from the list:
	expect([ OutsLookup.Frag, OutsLookup.Match ].includes(oOut)).toBe(true);

	const oLookupOGLES = tLookupText.suFromPrev(oLookupOGLE, "ogles");
	oOut = oLookupOGLES.uExec(true);
	expect(oOut).toBe(OutsLookup.Match);
});
