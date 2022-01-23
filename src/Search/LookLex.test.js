// LookLex.test.js
// ---------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tLookLex, OutsLook } from "./LookLex.js";
import { tLex } from "./Lex.js";

test("tLookLex: Enumeration", () => {
	const oLex = new tLex();
	const oLookOFull = new tLookLex(oLex.WordsSearch, "o");
	expect(oLookOFull.uExec(false)).toBe(OutsLook.Miss);

	const oLookO = new tLookLex(oLex.WordsSearch, "o");
	expect(oLookO.uExec(true)).toBe(OutsLook.Frag);

	const oLookOG = tLookLex.suFromPrev(oLookO, "og");
	expect(oLookOG.uExec(true)).toBe(OutsLook.Frag);

	const oLookOGL = tLookLex.suFromPrev(oLookOG, "ogl");
	expect(oLookOGL.uExec(true)).toBe(OutsLook.Frag);

	const oLookOGLE = tLookLex.suFromPrev(oLookOGL, "ogle");
	expect(oLookOGLE.uExec(true)).toBe(OutsLook.Frag);

	const oLookOGLES = tLookLex.suFromPrev(oLookOGLE, "ogles");
	expect(oLookOGLES.uExec(true)).toBe(OutsLook.Match);
});
