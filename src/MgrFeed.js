// MgrFeed.js
// ==========
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

// Import with:
//
//   import MgrFeed from "../MgrFeed.js";
//

// Audio on mobile devices
// -----------------------
// Audio performance on Android devices is really awful. The playback latency is
// irritatingly long, the loop timing is extremely variable (even though tTimer
// regulates the timing), my devices won't loop faster than once per second, and
// the volume on the Pixel 4a waxes and wanes for no reason I can understand.
// For these reasons, I am disabling audio on all mobile devices, which might be
// what users prefer in the first place. I have changed this module to vibrate
// the device, if possible, in place of the sounds that would have been played.
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
// In actual fact, `null` values were being returned when 'querySelector' was
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
import * as Misc from "./Util/Misc.js";

/** Provides audio or haptic feedback appropriate for various application
 *  events. This class is mutable. */
class tMgrFeed {
	constructor() {
		/** Set to `true` if the app is running on a mobile device. */
		this._CkMob = Misc.uCkMob();

		/** The loop play state, which determines whether the tick loop generates
		 *  sound or vibrations. The loop timer always runs. */
		this._StLoop = StsLoop.Stop;

		this._uWorkTimerLoop = this._uWorkTimerLoop.bind(this);
		// Many mobile devices won't allow shorter timer periods:
		const oPer = this._CkMob ? 1000 : 250;
		/** The timer that runs the tick loop. */
		this._TimerLoop = new tTimer(this._uWorkTimerLoop, oPer, true);

		if (!this._CkMob) {
			const oVolBase = 0.4;
			this._AudPointOver = uReady_Aud("#AudPointOver", oVolBase);
			this._AudSelDie = uReady_Aud("#AudSelDie", oVolBase);
			this._AudUnselDie = uReady_Aud("#AudUnselDie", oVolBase);
			this._AudEntVal = uReady_Aud("#AudEntVal", oVolBase);
			this._AudEntInval = uReady_Aud("#AudEntInval", oVolBase);
			this._AudTick = uReady_Aud("#AudTick", (oVolBase * 0.8));
		}
	}

	uPointOver() {
		this._PlayOrVibe(this._AudPointOver);
	}

	uSelDie() {
		this._PlayOrVibe(this._AudSelDie);
	}

	uUnselDie() {
		this._PlayOrVibe(this._AudUnselDie);
	}

	uEntVal() {
		this._PlayOrVibe(this._AudEntVal);
	}

	uEntInval() {
		this._PlayOrVibe(this._AudEntInval);
	}

	uTick() {
		this._PlayOrVibe(this._AudTick);
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

		// Otherwise the loop would not stop until the next timer iteration:
		if (this._CkMob) uCancel_Vibe();
	}

	/** Plays the specified 'audio' element, vibrating instead if the app is
	 *  running on a mobile device. */
	async _PlayOrVibe(aAud) {
		if (this._CkMob) {
			// Playing a single pulse cancels the queued pattern, if there is one,
			// which produces gaps in the TickFast pattern when time is low.
			// Restarting the pattern eliminates these gaps, while still providing
			// feedback for the die selection:
			if (this._StLoop === StsLoop.TickFast) uVibe_Patt();
			else uVibe_One();

			return;
		}

		try {
			await aAud.play();
		}
		catch (oErr) {
			// If the user does not click the page some time before `play` is called,
			// this exception is thrown:
			//
			//   DOMException: play() failed because the user didn't interact with the
			//   document first
			//
			// The exception is harmless, but I am sick of seeing it in the log, so:
			const oCkFailInteract = (oErr instanceof DOMException)
				&& oErr.message.includes("user didn't interact");
			if (!oCkFailInteract) throw oErr;
		}
	}

	/** The loop timer work function, which uses the loop play state to determine
	 *  whether a tick should be played. The loop timer always runs. */
	_uWorkTimerLoop() {

		// Mobile device
		// -------------
		// While the tick sound is played twice per second for TickSlow, and four
		// times per second for TickFast, that seems too fast for vibrations, so we
		// will halve those frequencies.

		if (this._CkMob) {
			switch (this._StLoop) {
				case StsLoop.TickSlow:
					// The desired vibration period happens to match the timer period:
					uVibe_One();
					return;

				case StsLoop.TickFast: {
					uVibe_Patt();
					return;
				}

				default:
					uCancel_Vibe();
					return;
			}
		}

		// Desktop browser
		// ---------------

		if (this._StLoop === StsLoop.Stop) return;

		/** The index of the next loop iteration. */
		this._jLoop = (this._jLoop ?? 0) + 1;
		if ((this._StLoop === StsLoop.TickFast) || (this._jLoop % 2))
			this.uTick();
	}
}

/** Uses selector `aSelEl` to find the element in the document, sets its volume,
 *  and then returns it, throwing instead if the element cannot be found. */
function uReady_Aud(aSelEl, aVol) {
	const oEl = document.querySelector(aSelEl);
	if (!oEl)
		throw Error(`tFeed.uReady_Aud: Cannot load element '${aSelEl}'`);

	oEl.volume = aVol ?? 1.0;
	return oEl;
}

/** The vibration pulse length, in milliseconds. */
const LenVibe = 50;

/** Cancels any pending vibrations. */
function uCancel_Vibe() {
	navigator.vibrate(0);
}

/** Vibrates the device once, briefly. */
function uVibe_One() {
	// This does nothing on iOS browsers, and it is ignored on Android phones
	// set to 'do not disturb':
	navigator.vibrate(LenVibe);
}

/** Causes the device to produce a one-second vibration pattern. */
function uVibe_Patt() {
	const oLenOff = 500 - LenVibe;
	navigator.vibrate([ LenVibe, oLenOff, LenVibe, oLenOff ]);
}

/** Stores properties representing the loop play state. */
export const StsLoop = {
	/** No looped sound or vibration is played. */
	Stop: "Stop",
	/** Slow tick sounds or vibrations are played. */
	TickSlow: "TickSlow",
	/** Fast tick sounds or vibrations are played. */
	TickFast: "TickFast"
};
Object.freeze(StsLoop);

const MgrFeed = new tMgrFeed();
export default MgrFeed;
