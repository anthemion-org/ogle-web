// LookText.test.js
// ----------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tLookText, OutsLook } from "./LookText.js";
import Lex from "./Lex.js";

test("tLookText: Enumeration", () => {
	// 'ogles' is one of the built-in words:
	const oLookOFull = new tLookText(Lex.WordsSearch, "o");
	expect(oLookOFull.uExec(false)).toBe(OutsLook.Miss);

	const oLookO = new tLookText(Lex.WordsSearch, "o");
	expect(oLookO.uExec(true)).toBe(OutsLook.Frag);

	const oLookOG = tLookText.suFromPrev(oLookO, "og");
	expect(oLookOG.uExec(true)).toBe(OutsLook.Frag);

	const oLookOGL = tLookText.suFromPrev(oLookOG, "ogl");
	expect(oLookOGL.uExec(true)).toBe(OutsLook.Frag);

	const oLookOGLE = tLookText.suFromPrev(oLookOGL, "ogle");
	expect(oLookOGLE.uExec(true)).toBe(OutsLook.Frag);

	const oLookOGLES = tLookText.suFromPrev(oLookOGLE, "ogles");
	expect(oLookOGLES.uExec(true)).toBe(OutsLook.Match);
});
