// Feed.js
// -------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

import Sound from "./Feed.js";

test("Play feedbacks", () => {
	Sound.uPointOver();
	Sound.uSelDie();
	Sound.uUnselDie();
	Sound.uEntVal();
	Sound.uEntInval();
	Sound.uTick();
});
