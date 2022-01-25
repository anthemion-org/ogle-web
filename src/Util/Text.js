// Text.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Text from "../Util/Text.js";
//

/** Returns words 'zero' through 'twelve', if aNum is between those values, or
 *  the usual string representation of aNum, if it is not. */
export function uProseNum(aNum) {
	switch (aNum) {
		case 0: return "zero";
		case 1: return "one";
		case 2: return "two";
		case 3: return "three";
		case 4: return "four";
		case 5: return "five";
		case 6: return "six";
		case 7: return "seven";
		case 8: return "eight";
		case 9: return "nine";
		case 10: return "ten";
		case 11: return "eleven";
		case 12: return "twelve";
	}
	return aNum.toString();
}

/** Returns 'true' if either string matches the beginning of the other, or if
 *  either string is empty. */
export function uCkEqBegin(aL, aR) {
	if (aL.length > aR.length) aL = aL.substr(0, aR.length);
	else if (aR.length > aL.length) aR = aR.substr(0, aL.length);
	return aL === aR;
}
