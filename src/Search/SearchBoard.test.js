// SearchBoard.test.js
// ===================
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import { tConfigPoolDie } from "../Board/PoolDie.js";
import * as SearchBoard from "./SearchBoard.js";
import { tBoard } from "../Board/Board.js";
import Lex from "./Lex.js";
import { tGenRnd } from "../Util/Rnd.js";
import * as Search from "../Util/Search.js";

/** A random number generator seed for test searches. */
const SeedTextDef = "OGLE";
/** The raw word output expected from the first board produced by SeedTextDef.
 *  These will change if the seed, the random number generator, the die pool, or
 *  the lexicon changes. */
const WordsExpDef = [
	"neat", "neon", "neonatal", "neonatal", "neat", "eating", "entangle", "alto",
	"atonal", "atone", "atone", "atone", "anti", "anting", "anal", "analog",
	"analogy", "analogs", "aeon", "lanai", "lane", "lane", "lane", "entangle",
	"eels", "eating", "nans", "nags", "natal", "naming", "namings", "nogs",
	"note", "noel", "noels", "noting", "neat", "neat", "natal", "tiny", "tins",
	"ting", "tings", "tingle", "tans", "tansy", "tang", "tangy", "tangs",
	"tangle", "tango", "tags", "talk", "talks", "tale", "talon", "taming", "togs",
	"toga", "tole", "tote", "totem", "tonal", "tone", "tone", "tone", "tonal",
	"mingy", "mingle", "main", "mains", "many", "mans", "mangy", "mangle",
	"mango", "mags", "magi", "malt", "male", "manta", "mane", "mane", "mane",
	"mana", "matins", "mating", "matings", "peon", "pels", "pelt", "peen", "peen",
	"pent", "penal", "penal", "pent", "penal", "penal", "peon", "peel", "peels",
	"peen", "peen", "peen", "peal", "peat", "elks", "elating", "ogle", "angle",
	"aglet", "alto", "aloe", "aloe", "alone", "alone", "alone", "anti", "anting",
	"anal", "atone", "atone", "atone", "atonal", "amigo", "ingot", "ingot",
	"inane", "inane", "inane", "imago", "melt", "melon", "mental", "mental",
	"tels", "temp", "tepee", "teen", "teen", "tent", "tenting", "togs", "toga",
	"tole", "tonal", "tone", "tone", "tone", "tonal", "toting", "total", "totals",
	"total", "lepton", "lent", "lento", "loan", "loans", "loan", "loam", "logy",
	"logs", "lone", "lone", "lone", "lain", "lags", "lane", "lane", "lane",
	"laming", "gnat", "glee", "glen", "gloat", "glans", "glam", "goal", "goals",
	"goat", "gone", "gone", "gone", "gain", "gains", "gait", "gals", "gale",
	"galena", "gaol", "gaols", "gamin", "gamins", "gins", "giant", "nags",
	"natal", "slept", "sleep", "slog", "slogan", "slogan", "slot", "sloe", "sloe",
	"slot", "slain", "slang", "slangy", "slag", "slant", "slanting", "slat",
	"slating", "slam", "snag", "snit"
];
WordsExpDef.sort(Search.uCompareStrFast);

// test("SearchBoard uExec: Output", () => {
// 	const oGenRnd = new tGenRnd(SeedTextDef);
// 	const oConfigPoolDie = tConfigPoolDie.suDef();
// 	const oBoard = tBoard.suNewRnd(oGenRnd, oConfigPoolDie);
// 	const oSelsWord = SearchBoard.uExec(Lex.WordsSearch, oBoard);
// 	const oWords = oSelsWord.map(a => a.TextAll).sort(Search.uCompareStrFast);
// 	expect(oWords).toEqual(WordsExpDef);
// });

test("SearchBoard uExec: Speed", () => {
	const oGenRnd = new tGenRnd(SeedTextDef);
	const oCt = 20;

	const oTimeStart = Date.now();
	for (let o = 0; o < oCt; ++o) {
		const oConfigPoolDie = tConfigPoolDie.suDef();
		const oBoard = tBoard.suNewRnd(oGenRnd, oConfigPoolDie);
		const oSelsWord = SearchBoard.uExec(Lex.WordsSearch, oBoard);
		expect(oSelsWord.length).toBeGreaterThan(10);
	}
	const oTimeEnd = Date.now();
	const oTimePer = (oTimeEnd - oTimeStart) / oCt;
	// console.log(`Search time: ${oTimePer}ms`);

	// This will vary on different machines. On mine, the search takes less than
	// 10ms:
	expect(oTimePer).toBeLessThan(20);
});
