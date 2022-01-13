// LookLex.test.js
// ---------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tLookLex, OutsLook } from "./LookLex.js";
import { tLex } from "./Lex.js";

test("tLookLex: Enumeration", () => {
	const oqLex = new tLex;
	const oqLookOFull = new tLookLex(oqLex, "o");
	expect(oqLookOFull.uExec(false)).toBe(OutsLook.Miss);

	const oqLookO = new tLookLex(oqLex, "o");
	expect(oqLookO.uExec(true)).toBe(OutsLook.Frag);

	const oqLookOG = tLookLex.suFromPrev(oqLookO, "og");
	expect(oqLookOG.uExec(true)).toBe(OutsLook.Frag);

	const oqLookOGL = tLookLex.suFromPrev(oqLookOG, "ogl");
	expect(oqLookOGL.uExec(true)).toBe(OutsLook.Frag);

	const oqLookOGLE = tLookLex.suFromPrev(oqLookOGL, "ogle");
	expect(oqLookOGLE.uExec(true)).toBe(OutsLook.Frag);

	const oqLookOGLES = tLookLex.suFromPrev(oqLookOGLE, "ogles");
	expect(oqLookOGLES.uExec(true)).toBe(OutsLook.Match);
});
