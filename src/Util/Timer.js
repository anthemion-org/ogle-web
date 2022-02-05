// Timer.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tTimer } from "../Util/Timer.js";
//

/** A timer that self-regulates to offer somewhat better precision than
 *  'setInterval. This class is mutable.*/
export class tTimer {
	/** Specify the work function with auWork, or set it to 'null' and specify it
	 *  later with uSet_Work. aPer sets the timer period, in millseconds. Set
	 *  aCkStart to 'true' to start the timer immediately. */
	constructor(auWork, aPer, aCkStart) {
		/** The work function to be invoked every interval, or 'null' if there is no
		 *  work to be done. */
		this._uWork = auWork;
		/** The timer period, in milliseconds. */
		this.Per = aPer;
		/** The ID returned by 'setTimeout', or 'null' if the timer is stopped. */
		this._IDTimer = null;

		this._uExec = this._uExec.bind(this);

		if (aCkStart) this.uStart();
	}

	/** Replaces the work function. Set to 'null' if the timer should continue to
	 *  run without doing any work. */
	uSet_Work(auWork) {
		this._uWork = auWork;
	}

	/** Starts the timer, doing nothing if the timer is already running. */
	uStart() {
		if (this._IDTimer) return;

		this.TimeNext = Date.now() + this.Per;
		this._IDTimer = setTimeout(this._uExec, this.Per);
	}

	/** Stops the timer, doing nothing if the timer is already stopped. */
	uStop() {
		if (!this._IDTimer) return;

		clearTimeout(this._IDTimer);
		this._IDTimer = null;
	}

	/** Executes the work function, if it is set, and schedules the next timeout,
	 *  adjusting the interval as necessary to account for 'setTimeout' jitter. */
	_uExec() {
		const oTimeNow = Date.now();

		// While I have seen 'setInterval' run too fast, I haven't seen 'setTimeout'
		// do that, so we won't bother to check for early timing.

		if (this._uWork) this._uWork();

		let oWait = this.TimeNext + this.Per - oTimeNow;
		// If the timing is very late, oWait could be negative:
		while (oWait <= 0) oWait += this.Per;

		this._IDTimer = setTimeout(this._uExec, oWait);
	}
}
