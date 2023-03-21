// SearchBoard.test.js
// ===================
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tConfigPoolDie } from "../Board/PoolDie.js";
import * as SearchBoard from "./SearchBoard.js";
import * as Board from "../Board/Board.js";
import Lex from "./Lex.js";
import { tGenRnd } from "../Util/Rnd.js";
import * as Search from "../Util/Search.js";

/** A random number generator seed for test searches. */
const SeedTextDef = "OGLE";
/** The raw word output expected from the first board produced by SeedTextDef.
 *  These will change if the seed, the random number generator, the die pool, or
 *  the base lexicon changes. */
const WordsExpDef = [
	"adrift", "aegis", "afire", "afire", "afire", "ages", "airs", "area", "area",
	"area", "area", "areas", "areas", "areas", "areas", "areas", "areas", "ares",
	"ares", "aria", "arias", "arias", "arson", "arson", "aspersion", "bead",
	"beads", "bear", "bear", "bear", "beard", "beard", "beard", "beards",
	"beards", "beards", "bearer", "bearer", "bearer", "bearer", "bearish",
	"bearish", "bearish", "bears", "bears", "bears", "bearskin", "bearskin",
	"bearskin", "beep", "beeps", "beer", "beer", "beer", "beer", "beer", "beers",
	"beers", "beers", "bees", "begin", "begs", "dare", "dare", "dare", "darer",
	"darer", "dares", "dash", "draft", "drafty", "drag", "drags", "drain",
	"dregs", "drift", "eager", "eagerer", "ears", "ears", "ears", "ears", "ease",
	"eras", "eras", "eras", "eras", "eras", "eras", "eras", "eras", "eras",
	"erase", "erase", "fain", "faint", "fair", "fairer", "fairer", "fairs",
	"farad", "farads", "fare", "fare", "fare", "fares", "figs", "fire", "fire",
	"fire", "firer", "firer", "fires", "firs", "fish", "font", "gain", "garish",
	"gars", "gash", "gasp", "gear", "gears", "geas", "geas", "gift", "gird",
	"girds", "ikon", "info", "ires", "nifty", "noir", "nosh", "oiks", "pear",
	"pears", "peas", "peas", "peer", "peer", "peers", "pegs", "perish", "person",
	"personify", "rads", "raft", "rage", "rages", "rags", "rain", "rainy", "rash",
	"rash", "rasp", "read", "read", "read", "read", "reads", "reads", "reads",
	"reads", "rear", "rear", "rear", "rears", "rears", "rears", "reason",
	"reason", "reason", "reason", "reason", "reason", "reason", "regain",
	"region", "regs", "reps", "reread", "reread", "reread", "reread", "rereads",
	"rereads", "rereads", "rereads", "rift", "rigs", "risk", "rube", "rube",
	"rubes", "rubs", "rues", "sage", "sage", "sager", "sager", "sages", "sags",
	"saint", "saint", "saree", "saree", "saree", "saree", "saree", "saree",
	"saree", "saree", "saree", "saree", "saree", "saree", "sarees", "sarees",
	"sari", "sari", "sari", "saris", "sash", "sear", "sears", "seas", "season",
	"seer", "seer", "seers", "sere", "sere", "serer", "serer", "serif", "sift",
	"sire", "sire", "sire", "siree", "siree", "siree", "siree", "sires", "skin",
	"skint", "sofa", "sofas", "soft", "softy", "spear", "spears", "urea", "urea",
	"urea"
];

test("SearchBoard uExec: Output", () => {
	const oGenRnd = new tGenRnd(SeedTextDef);
	const oConfigPoolDie = tConfigPoolDie.suDef();
	const oBoard = Board.uNewRnd(oGenRnd, oConfigPoolDie);
	const oSelsWord = SearchBoard.uExec(Lex.WordsSearch, oBoard);
	const oWords = oSelsWord.map(a => a.TextAll).sort(Search.uCompareStrFast);
	expect(oWords).toEqual(WordsExpDef);
});

test("SearchBoard uExec: Speed", () => {
	const oGenRnd = new tGenRnd(SeedTextDef);
	// The average varied tremendously when this was '20'. It still varies by up
	// to one second:
	const oCt = 200;

	const oTimeStart = Date.now();
	for (let o = 0; o < oCt; ++o) {
		const oConfigPoolDie = tConfigPoolDie.suDef();
		const oBoard = Board.uNewRnd(oGenRnd, oConfigPoolDie);
		const oSelsWord = SearchBoard.uExec(Lex.WordsSearch, oBoard);
	}
	const oTimeEnd = Date.now();
	const oTimePer = (oTimeEnd - oTimeStart) / oCt;

	console.log(`SearchBoard uExec: Speed ${oTimePer}ms`);
	// This will vary on different machines. On mine, `oTimePer` is usually around
	// 7.3ms, though it can vary from 6.5ms to 8.2ms:
	expect(oTimePer).toBeLessThan(10);
});
