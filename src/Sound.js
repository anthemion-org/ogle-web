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
 *  mutable. */
class tSound {
	constructor() {
		this._AudPointOver = uReady_Aud("#AudPointOver", 1.0);
		this._AudSelDie = uReady_Aud("#AudSelDie", 1.0);
		this._AudUnselDie = uReady_Aud("#AudUnselDie", 1.0);
		this._AudEntVal = uReady_Aud("#AudEntVal", 1.0);
		this._AudEntInval = uReady_Aud("#AudEntInval", 1.0);
		this._AudTick = uReady_Aud("#AudTick", 0.8);

		/** The loop play state, which determines whether the tick loop generates
		 *  sound. The loop timer always runs. */
		this._StLoop = StsLoop.Stop;
		this._uWorkTimerLoop = this._uWorkTimerLoop.bind(this);
		/** The timer that runs the tick loop. */
		this._TimerLoop = new tTimer(this._uWorkTimerLoop, 250, true);
	}

	uPointOver() {
		this._AudPointOver.play();
	}

	uSelDie() {
		this._AudSelDie.play();
	}

	uUnselDie() {
		this._AudUnselDie.play();
	}

	uEntVal() {
		this._AudEntVal.play();
	}

	uEntInval() {
		this._AudEntInval.play();
	}

	uTick() {
		this._AudTick.play();
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

/** Uses selector aSelEl to find the element in the document, sets its volume,
 *  and then returns it, throwing instead if the element cannot be found. */
function uReady_Aud(aSelEl, aVol) {
	const oEl = document.querySelector(aSelEl);
	if (!oEl)
		throw Error(`tSound._suReady_Aud: Cannot load element '${aSelEl}'`);

	oEl.volume = aVol ?? 1.0;
	return oEl;
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
