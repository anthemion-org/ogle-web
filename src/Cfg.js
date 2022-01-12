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

/** The board width, in dice. */
export const WthBoard = 5;
/** The board height, in dice. */
export const HgtBoard = 5;
/** The board size, in dice. */
export const SizeBoard = new tPt2(WthBoard, HgtBoard);
/** The board rectangle, in dice. */
export const RectBoard = new tRect(new tPt2(0, 0), SizeBoard);

/** The total die count. */
export const CtDie = WthBoard * HgtBoard;
