// LookupText.test.js
// ------------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tLookupText, OutsLookup } from "./LookupText.js";
import Lex from "./Lex.js";

test("tLookupText: Enumeration", () => {
	// 'ogles' is one of the built-in words:
	const oLookupOFull = new tLookupText(Lex.WordsSearch, "o");
	expect(oLookupOFull.uExec(false)).toBe(OutsLookup.Miss);

	const oLookupO = new tLookupText(Lex.WordsSearch, "o");
	expect(oLookupO.uExec(true)).toBe(OutsLookup.Frag);

	const oLookupOG = tLookupText.suFromPrev(oLookupO, "og");
	expect(oLookupOG.uExec(true)).toBe(OutsLookup.Frag);

	const oLookupOGL = tLookupText.suFromPrev(oLookupOG, "ogl");
	expect(oLookupOGL.uExec(true)).toBe(OutsLookup.Frag);

	const oLookupOGLE = tLookupText.suFromPrev(oLookupOGL, "ogle");
	expect(oLookupOGLE.uExec(true)).toBe(OutsLookup.Frag);

	const oLookupOGLES = tLookupText.suFromPrev(oLookupOGLE, "ogles");
	expect(oLookupOGLES.uExec(true)).toBe(OutsLookup.Match);
});
