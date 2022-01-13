// LookLex.test.js
// ---------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tLookLex, pOutsLook } from "./LookLex.js";
import { tLex } from "./Lex.js";

test("tLookLex: Enumeration", () => {
	const oqLex = new tLex;
	const oqLookOFull = new tLookLex(oqLex, "o");
	expect(oqLookOFull.uExec(false)).toBe(pOutsLook.Miss);

	const oqLookO = new tLookLex(oqLex, "o");
	expect(oqLookO.uExec(true)).toBe(pOutsLook.Frag);

	const oqLookOG = tLookLex.suFromPrev(oqLookO, "og");
	expect(oqLookOG.uExec(true)).toBe(pOutsLook.Frag);

	const oqLookOGL = tLookLex.suFromPrev(oqLookOG, "ogl");
	expect(oqLookOGL.uExec(true)).toBe(pOutsLook.Frag);

	const oqLookOGLE = tLookLex.suFromPrev(oqLookOGL, "ogle");
	expect(oqLookOGLE.uExec(true)).toBe(pOutsLook.Frag);

	const oqLookOGLES = tLookLex.suFromPrev(oqLookOGLE, "ogles");
	expect(oqLookOGLES.uExec(true)).toBe(pOutsLook.Match);
});
