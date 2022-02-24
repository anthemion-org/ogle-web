// Sound.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import Sound from "../Sound.js";
//

// Audio on mobile devices
// -----------------------
// Audio performance on Android devices is truly abysmal. The playback latency
// is often very long, the loop timing is extremely variable (even though tTimer
// regulates the timing), my devices won't loop faster than once per second, and
// the volume on the Pixel 4a waxes and wanes very noticeably for no reason I
// can understand. I have therefore decided to disable audio on all mobile
// devices, which might be what users prefer in the first place.
//
//
// Audio loading problems
// ----------------------
// Twice I have encountered WAV file loading problems in this module that were
// very difficult to diagnose. In both cases, the development build stopped
// playing sounds, and this confusing message appeared in the DevTools console:
//
//   DOMException: The element has no supported sources
//
// In actual fact, 'null' values were being returned when 'querySelector' was
// used to reference the 'audio' elements. No changes had been made to the WAV
// files, however, and reverting to earlier commits did not fix the problem. In
// both cases, production builds continued to play sounds as expected.
//
// The first time this happened, I was able to fix it by restarting the
// development server with 'npm run start'. The second time, restarts did not
// help, nor did a reboot of my development PC. Looking at the WAV files in the
// DevTools Network tab, it appeared that the files were not being completely
// loaded, as their size was reported as 2.9KB in each case, even though most
// are larger. Then I noticed that the development server was setting their
// 'Content-Type' to 'text/plain', while the production server correctly set
// this to 'audio/wav'. I considered reconfiguring the WebPack development
// server to ensure that the correct type would be set, but it seemed like I
// would need something like 'react-app-rewired', which I do not want right now.
//
// Finally, I noticed that changing the development URL from:
//
//   http://localhost:3000
//
// to:
//
//   http://localhost:3000/play-ogle/
//
// allowed the sounds to be played. The second URL is the one listed by 'npm
// start', though it was not originally. I traced that change to the 'homepage'
// property I added to 'package.json' nine days ago. If that is the cause, I
// don't understand why it would take so long for the problem to appear, and it
// is hard to believe that the files were cached this whole time.
//
// So, finally, I prefixed the 'audio' element paths in 'index.html' with
// '%PUBLIC_URL%'. This changes the served HTML from:
//
//   <audio id="AudPointOver" src="AudPointOver.wav"></audio>
//
// to:
//
//   <audio id="AudPointOver" src="/play-ogle/AudPointOver.wav"></audio>
//
// Now the sounds play whether '/play-ogle/' is appended to 'localhost:3000' or
// not. These files were always siblings of the 'index.html' file that
// references them, so I don't understand this fix, nor do I understand why the
// development server would fail this way, if the paths were simply wrong.

import { tTimer } from "./Util/Timer.js";

/** Manages all audio resources and playback for the application. This class is
 *  mutable. */
class tSound {
	constructor() {
		/** Set to 'true' if the app is running on a mobile device. */
		this._CkMob = /Mobi/.test(navigator.userAgent);
		if (this._CkMob) return;

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
		if (this._CkMob) return;
		this._AudPointOver.play();
	}

	uSelDie() {
		if (this._CkMob) return;
		this._AudSelDie.play();
	}

	uUnselDie() {
		if (this._CkMob) return;
		this._AudUnselDie.play();
	}

	uEntVal() {
		if (this._CkMob) return;
		this._AudEntVal.play();
	}

	uEntInval() {
		if (this._CkMob) return;
		this._AudEntInval.play();
	}

	uTick() {
		if (this._CkMob) return;
		this._AudTick.play();
	}

	/** Starts the 'slow' tick loop. */
	uLoopSlow_Tick() {
		if (this._CkMob) return;
		this._StLoop = StsLoop.TickSlow;
	}

	/** Starts the 'fast' tick loop. */
	uLoopFast_Tick() {
		if (this._CkMob) return;
		this._StLoop = StsLoop.TickFast;
	}

	/** Stops the tick loop. */
	uStop_Tick() {
		if (this._CkMob) return;
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
