// Lex.js
// ------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tLex } from "./Lex.js";

test("tLex.uCkKnown: Old and new user words", () => {
	const oWordUserOld = "oooooooo";
	localStorage.yWordsUser = JSON.stringify([ oWordUserOld ]);

	const oqLex = new tLex;

	expect(oqLex.uCkKnown("abacus")).toBe(true);
	expect(oqLex.uCkKnown(oWordUserOld)).toBe(true);

	const oWordUserNew = "nnnnnnnn";
	expect(oqLex.uCkKnown(oWordUserNew)).toBe(false);

	oqLex.uAdd_WordUser(oWordUserNew);
	expect(oqLex.uCkKnown(oWordUserNew)).toBe(true);
});

test("tLex.uCtSearch: Add user words and merge", () => {
	localStorage.removeItem("yWordsUser");

	const oqLex = new tLex;
	const oCtOrig = oqLex.uCtSearch();

	oqLex.uAdd_WordUser("aaaaaaaa");
	oqLex.uAdd_WordUser("bbbbbbbb");
	oqLex.uMerge_WordsUser();

	expect(oqLex.uCtSearch()).toBe(oCtOrig + 2);
});
