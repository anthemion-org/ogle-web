// Lex.test.js
// ===========
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { ForTest } from "./Lex.js";
import * as StoreLoc from "../StoreLoc.js";

test("tLex: Add user words and merge", () => {
	StoreLoc.uSet("WordsUser", []);

	const oLex = new ForTest.tLex();
	const oCtOrig = oLex.WordsSearch.length;

	oLex.uAdd_WordUser("aaaaaaaa");
	oLex.uAdd_WordUser("bbbbbbbb");
	oLex.uMerge_WordsUser();

	expect(oLex.WordsSearch.length).toBe(oCtOrig + 2);
});

test("tLex.uCkKnown: Old and new user words", () => {
	const oWordUserOld = "oooooooo";
	StoreLoc.uSet("WordsUser", [oWordUserOld]);

	const oLex = new ForTest.tLex();

	expect(oLex.uCkKnown("abacus")).toBe(true);
	expect(oLex.uCkKnown(oWordUserOld)).toBe(true);

	const oWordUserNew = "nnnnnnnn";
	expect(oLex.uCkKnown(oWordUserNew)).toBe(false);

	oLex.uAdd_WordUser(oWordUserNew);
	expect(oLex.uCkKnown(oWordUserNew)).toBe(true);
});
