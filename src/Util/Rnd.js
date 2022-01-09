// Rnd.js
// ------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tGenRnd } from "../Util/Rnd.js";
//

// A seedable random number generator. This generator is not suitable for
// cryptographic use.
export class tGenRnd {
	// Set aSeedText to a non-empty string to seed the generator.
	constructor(aSeedText) {
		const ouGenSeed = uGenSeedXMUR3(aSeedText);
		this.SeedNum = ouGenSeed();
		this.GenNum = uGenNumMulberry32(this.SeedNum);
	}

	// Returns an integer less than aCeil, and greater than or equal to zero.
	uInt(aCeil) {
		return Math.floor(this.GenNum() * aCeil);
	}

	// Returns a random array element from ayEls, throwing instead if it is empty.
	uEl(ayEls) {
		if (!ayEls.length)
			throw new Error("tGenRnd.uEl: Empty array");
		return ayEls[this.uInt(ayEls.length)];
	}
}

// 'bryc' random number generation
// -------------------------------

// Accepts a string of any length greater than zero, and returns a function. The
// function generates numbers suitable for use as seeds.
function uGenSeedXMUR3(aSeedText) {
	// Adapted from 'xmur3' in:
	//
	//   https://github.com/bryc/code/blob/master/jshash/PRNGs.md
	//   https://stackoverflow.com/a/47593316/3728155
	//
	if (!aSeedText.length)
		throw new Error("Rnd uGenSeedXMUR3: Invalid source string");

	for (var i = 0, h = 1779033703 ^ aSeedText.length; i < aSeedText.length; i++)
		h = Math.imul(h ^ aSeedText.charCodeAt(i), 3432918353),
			h = h << 13 | h >>> 19;

	return function () {
		h = Math.imul(h ^ h >>> 16, 2246822507),
			h = Math.imul(h ^ h >>> 13, 3266489909);
		return (h ^= h >>> 16) >>> 0;
	}
}

// Accepts a numeric seed, and returns a function. The function generates random
// numbers that are greater than or equal to zero, and less than one.
function uGenNumMulberry32(aSeed) {
	// Adapted from:
	//
	//   https://github.com/bryc/code/blob/master/jshash/PRNGs.md
	//   https://stackoverflow.com/a/47593316/3728155
	//
	return function () {
		aSeed |= 0;
		aSeed = aSeed + 0x6D2B79F5 | 0;
		let t = Math.imul(aSeed ^ aSeed >>> 15, 1 | aSeed);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	}
}
