// Const.js
// ========
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Const from "../Const.js";
//

import * as Pt2 from "./Util/Pt2.js";
import * as Rect from "./Util/Rect.js";

// Game constants
// --------------

/** The board width, in dice. */
export const WthBoard = 5;
/** The board height, in dice. */
export const HgtBoard = 5;

/** The board size, in dice. */
export const SizeBoard = Pt2.uNew(WthBoard, HgtBoard);
Object.freeze(SizeBoard);

/** The board rectangle, in dice. */
export const RectBoard = Rect.uNew(Pt2.uNew(0, 0), SizeBoard);
Object.freeze(RectBoard);

/** The number of dice in the board. */
export const CtDie = WthBoard * HgtBoard;

/** The shortest allowable word, in letters. Recall that the 'Qu' die counts as
 *  two letters, not one. */
export const LenWordMin = 4;
/** The longest possible word, in letters. Recall that the 'Qu' die counts as
 *  two letters, not one. */
export const LenWordMax = CtDie * 2;

// UI constants
// ------------

/** The maximum word length to track in the Coverage table within the Score
 *  view. */
export const LenCoverMax = 9;
/** The number of high scores to be stored and displayed. */
//
// For aesthetic reasons, we'll match the number of lines in the Score view
// Coverage table:
export const CtStoreScoreHigh = 6;
