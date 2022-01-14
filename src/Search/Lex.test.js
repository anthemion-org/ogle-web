// Lex.test.js
// -----------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tLex } from "./Lex.js";
import * as Store from "../Store.js";

test("tLex.uCkKnown: Old and new user words", () => {
	const oWordUserOld = "oooooooo";
	Store.uSet("WordsUser", [oWordUserOld]);

	const oLex = new tLex;

	expect(oLex.uCkKnown("abacus")).toBe(true);
	expect(oLex.uCkKnown(oWordUserOld)).toBe(true);

	const oWordUserNew = "nnnnnnnn";
	expect(oLex.uCkKnown(oWordUserNew)).toBe(false);

	oLex.uAdd_WordUser(oWordUserNew);
	expect(oLex.uCkKnown(oWordUserNew)).toBe(true);
});

test("tLex.uCtSearch: Add user words and merge", () => {
	Store.uSet("WordsUser", []);

	const oLex = new tLex;
	const oCtOrig = oLex.uCtSearch();

	oLex.uAdd_WordUser("aaaaaaaa");
	oLex.uAdd_WordUser("bbbbbbbb");
	oLex.uMerge_WordsUser();

	expect(oLex.uCtSearch()).toBe(oCtOrig + 2);
});
