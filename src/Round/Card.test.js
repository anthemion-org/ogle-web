// Card.test.js
// ------------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tCard } from "./Card.js";
import { tEntWord } from "./EntWord.js";

test("Card uAdd", () => {
	const oCard = tCard.suNew();

	let oEnt = uEntFromText("TON");
	let oCtBonus = oCard.uAdd(oEnt);
	expect(oCtBonus).toEqual(0);
	expect(oCard.Score).toEqual(0);

	oEnt = uEntFromText("TONE");
	oCtBonus = oCard.uAdd(oEnt);
	expect(oCtBonus).toEqual(1);
	expect(oCard.Score).toEqual(1);

	oEnt = uEntFromText("TONERS");
	oCtBonus = oCard.uAdd(oEnt);
	expect(oCtBonus).toEqual(2);
	expect(oCard.Score).toEqual(1);

	oEnt = uEntFromText("TONER");
	oCtBonus = oCard.uAdd(oEnt);
	expect(oCtBonus).toEqual(0);
	expect(oCard.Score).toEqual(1);

	oEnt = uEntFromText("TONERS");
	oCtBonus = oCard.uAdd(oEnt);
	expect(oCtBonus).toEqual(0);
	expect(oCard.Score).toEqual(1);
});


function uEntFromText(aText) {
	const oPosi = Array(aText.length);
	const oTexts = [...aText];
	return new tEntWord(oPosi, oTexts);
}
