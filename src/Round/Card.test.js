// Card.test.js
// ------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tCard } from "./Card.js";
import { tEntWord } from "./EntWord.js";

test("Card uAdd", () => {
	const oCard = tCard.suNew();

	let oEnt = uEntFromText("TON");
	oCard.uAdd(oEnt);
	expect(oCard.Score).toEqual(0);
	expect(oCard.CtBonusTime).toEqual(0);

	oEnt = uEntFromText("TONE");
	oCard.uAdd(oEnt);
	expect(oCard.Score).toEqual(1);
	expect(oCard.CtBonusTime).toEqual(1);

	oEnt = uEntFromText("TONERS");
	oCard.uAdd(oEnt);
	expect(oCard.Score).toEqual(1);
	expect(oCard.CtBonusTime).toEqual(3);

	oEnt = uEntFromText("TONER");
	oCard.uAdd(oEnt);
	expect(oCard.Score).toEqual(1);
	expect(oCard.CtBonusTime).toEqual(3);

	oEnt = uEntFromText("TONERS");
	oCard.uAdd(oEnt);
	expect(oCard.Score).toEqual(1);
	expect(oCard.CtBonusTime).toEqual(3);
});


function uEntFromText(aText) {
	const oPosi = Array(aText.length);
	const oTexts = [...aText];
	return new tEntWord(oPosi, oTexts);
}
