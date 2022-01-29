// Sound.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import Sound from "./Sound.js";
//

class tSound {
	constructor() {
		this.AudTick = document.querySelector("#AudTick");
		this.AudTick.volume = 0.8;
	}

	uTick() {
		this.AudTick.play();
	}
}

const Sound = new tSound();
export default Sound;
