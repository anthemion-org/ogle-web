// Card.test.js
// ============
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import * as Card from "./Card.js";
import * as EntWord from "./EntWord.js";

test("Card uAdd", () => {
	const oCard = Card.uNewEmpty();

	let oEnt = uEntFromText("TON");
	Card.uAdd(oCard, oEnt);
	expect(oCard.Score).toEqual(0);
	expect(oCard.CtBonusTime).toEqual(0);

	oEnt = uEntFromText("TONE");
	Card.uAdd(oCard, oEnt);
	expect(oCard.Score).toEqual(1);
	expect(oCard.CtBonusTime).toEqual(1);

	oEnt = uEntFromText("TONERS");
	Card.uAdd(oCard, oEnt);
	expect(oCard.Score).toEqual(1);
	expect(oCard.CtBonusTime).toEqual(3);

	oEnt = uEntFromText("TONER");
	Card.uAdd(oCard, oEnt);
	expect(oCard.Score).toEqual(1);
	expect(oCard.CtBonusTime).toEqual(3);

	oEnt = uEntFromText("TONERS");
	Card.uAdd(oCard, oEnt);
	expect(oCard.Score).toEqual(1);
	expect(oCard.CtBonusTime).toEqual(3);
});


function uEntFromText(aText) {
	const oPosi = Array(aText.length);
	const oTexts = [ ...aText ];
	return EntWord.uNew(oPosi, oTexts);
}
