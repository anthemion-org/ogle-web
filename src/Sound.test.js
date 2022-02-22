// Sound.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import Sound from "./Sound.js";

test("Play sounds", () => {
	Sound.uPointOver();
	Sound.uSelDie();
	Sound.uUnselDie();
	Sound.uEntVal();
	Sound.uEntInval();
	Sound.uTick();
});
