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

		this.AudLoopTick = document.querySelector("#AudLoopTick");
		this.AudLoopTick.volume = 0.8;

		this.AudLoopTickLast = document.querySelector("#AudLoopTickLast");
		this.AudLoopTickLast.volume = 0.8;
	}

	uTick() {
		this.AudTick.play();
	}

	uPlay_LoopTick() {
		this.AudLoopTick.loop = true;
		if (this.AudLoopTick.paused)
			this.AudLoopTick.play();
	}

	uStop_LoopTick() {
		this.AudLoopTick.loop = false;
	}

	uPlay_LoopTickLast() {
		this.AudLoopTickLast.loop = true;
		if (this.AudLoopTickLast.paused)
			this.AudLoopTickLast.play();
	}

	uStop_LoopTickLast() {
		this.AudLoopTickLast.loop = false;
	}
}

const Sound = new tSound();
export default Sound;
