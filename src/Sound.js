// Sound.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import Sound from "./Sound.js";
//

import { tTimer } from "./Util/Timer.js";

class tSound {
	constructor() {
		this.AudTick = document.querySelector("#AudTick");
		this.AudTick.volume = 0.8;

		this._CkLoopTick = false;
		this._uExecTimerTick = this._uExecTimerTick.bind(this);
		this._TimerTick = new tTimer(this._uExecTimerTick, 250, true);
	}

	uTick() {
		this.AudTick.play();
	}

	uLoopSlow_Tick() {
		this._CkFastTick = false;
		this._CkLoopTick = true;
	}

	uLoopFast_Tick() {
		this._CkFastTick = true;
		this._CkLoopTick = true;
	}

	uStop_Tick() {
		this._CkLoopTick = false;
	}

	_uExecTimerTick() {
		if (!this._CkLoopTick) return;

		if (this.cjTick) ++this.cjTick;
		else this.cjTick = 1;

		if (this._CkFastTick || (this.cjTick % 2)) this.uTick();
	}
}

const Sound = new tSound();
export default Sound;
