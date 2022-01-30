// Sound.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import Sound from "../Sound.js";
//

import { tTimer } from "./Util/Timer.js";

/** Manages all audio resources and playback for the application. This class is
 *  a singleton. */
class tSound {
	constructor() {
		this.AudMouseOver = document.querySelector("#AudMouseOver");
		this.AudSelDie = document.querySelector("#AudSelDie");
		this.AudUnselDie = document.querySelector("#AudUnselDie");
		this.AudEntVal = document.querySelector("#AudEntVal");
		this.AudEntInval = document.querySelector("#AudEntInval");

		this.AudTick = document.querySelector("#AudTick");
		this.AudTick.volume = 0.8;

		/** The loop play state, which determines whether the tick loop generates
		 *  sound. The loop timer always runs. */
		this._StLoop = StsLoop.Stop;
		this._uWorkTimerLoop = this._uWorkTimerLoop.bind(this);
		/** The timer that runs the tick loop. */
		this._TimerLoop = new tTimer(this._uWorkTimerLoop, 250, true);
	}

	uMouseOver() {
		this.AudMouseOver.play();
	}

	uSelDie() {
		this.AudSelDie.play();
	}

	uUnselDie() {
		this.AudUnselDie.play();
	}

	uEntVal() {
		this.AudEntVal.play();
	}

	uEntInval() {
		this.AudEntInval.play();
	}

	uTick() {
		this.AudTick.play();
	}

	/** Starts the 'slow' tick loop. */
	uLoopSlow_Tick() {
		this._StLoop = StsLoop.TickSlow;
	}

	/** Starts the 'fast' tick loop. */
	uLoopFast_Tick() {
		this._StLoop = StsLoop.TickFast;
	}

	/** Stops the tick loop. */
	uStop_Tick() {
		this._StLoop = StsLoop.Stop;
	}

	/** The loop timer work function, which uses the loop play state to determine
	 *  whether a tick should be played. The loop timer always runs. */
	_uWorkTimerLoop() {
		if (this._StLoop === StsLoop.Stop) return;

		/** The index of the next loop iteration. */
		this._jLoop = (this._jLoop ?? 0) + 1;
		if ((this._StLoop === StsLoop.TickFast) || (this._jLoop % 2))
			this.uTick();
	}
}

/** Stores properties representing the loop play state. */
export const StsLoop = {
	/** No looped sound is played. */
	Stop: "Stop",
	/** Slow ticks are played. */
	TickSlow: "TickSlow",
	/** Fast ticks are played. */
	TickFast: "TickFast"
};
Object.freeze(StsLoop);

const Sound = new tSound();
export default Sound;
