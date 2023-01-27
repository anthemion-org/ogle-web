// Theme.js
// --------
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Theme from "./UI/Theme.js";
//

/** Stores objects representing UI themes. */
export const Themes = {
	Lt: { n: "Lt", Desc: "Light" },
	Dk: { n: "Dk", Desc: "Dark" }
};
Object.freeze(Themes);

/** The default theme object. */
export const Def = Themes.Dk;

/** Returns the theme object with name `an`, or the default object, if no match
 *  is found. */
export function uTheme(an) {
	return Themes[an] || Def;
}
