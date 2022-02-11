// Cfg.js
// -------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Cfg from "../Cfg.js";
//

import { tPt2 } from "./Util/Pt2.js";
import { tRect } from "./Util/Rect.js";

/** The Ogle version. */
export const VerApp = 0;

/** The board width, in dice. */
export const WthBoard = 5;
/** The board height, in dice. */
export const HgtBoard = 5;
/** The board size, in dice. */
export const SizeBoard = new tPt2(WthBoard, HgtBoard);
/** The board rectangle, in dice. */
export const RectBoard = new tRect(new tPt2(0, 0), SizeBoard);

/** The number of dice in the board. */
export const CtDie = WthBoard * HgtBoard;

/** The shortest allowable word, in letters. Recall that the 'Qu' die counts as
 *  two letters, not one. */
export const LenWordMin = 4;
/** The longest possible word, in letters. Recall that the 'Qu' die counts as
 *  two letters, not one. */
export const LenWordMax = CtDie * 2;

/** The maximum word length to track in the Coverage table within the Score
 *  view. */
export const LenCoverMax = 9;
/** The number of high scores to be stored and displayed. */
//
// For aesthetic reasons, we'll match the number of lines in the Score view
// Coverage table:
export const CtStoreScoreHigh = 6;
