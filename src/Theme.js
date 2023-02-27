// Theme.js
// ========
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import * as Theme from "./Theme.js";
//

const ThemeDk = { Name: "Dk", Desc: "Dark" };
const ThemeLt = { Name: "Lt", Desc: "Light" };

/** Stores objects representing UI themes. */
export const All = [
	ThemeDk,
	ThemeLt
];
Object.freeze(All);

/** The default theme object. */
export const Def = ThemeDk;

/** Returns the CSS class that implements the specified theme, or the class for
 *  the default theme, if `aNameTheme` is falsy. */
export function ClassFromName(aNameTheme) {
	return "Theme" + (aNameTheme || Def.Name);
}
