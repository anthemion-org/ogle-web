// Timer.js
// --------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import { tTimer } from "../Util/Timer.js";
//

/** A self-regulating timer that offers better precision than 'setInterval. */
export class tTimer {
	/** Specify the work function with auWork, or set it to 'null' and specify it
	 *  later with uSet_Work. aPer sets the timer period, in millseconds. Set
	 *  aCkStart to 'true' to start the timer immediately. */
	constructor(auWork, aPer, aCkStart) {
		/** The work function to be invoked every interval, or 'null' if there is no
		 *  work to be done. */
		this.uWork = auWork;
		/** The timer period, in milliseconds. */
		this.Per = aPer;
		/** The ID returned by 'setTimeout', or 'null' if the timer is stopped. */
		this.IDTimer = null;

		this.uExec = this.uExec.bind(this);

		if (aCkStart) this.uStart();
	}

	/** Replaces the work function. Set to 'null' if the timer should continue
	 *  without doing any work. */
	uSet_Work(auWork) {
		this.uWork = auWork;
	}

	/** Starts the timer, doing nothing if the timer is already running. */
	uStart() {
		if (this.IDTimer !== null) return;

		this.TimeNext = Date.now() + this.Per;
		this.IDTimer = setTimeout(this.uExec, this.Per);
	}

	/** Stops the timer, doing nothing if the timer is already stopped. */
	uStop() {
		if (this.IDTimer === null) return;

		clearTimeout(this.IDTimer);
		this.IDTimer = null;
	}

	/** Runs the work function, if it is set, and schedules the next timeout,
	 *  adjusting the interval as necessary to account for 'setTimeout' jitter. */
	uExec() {
		const oTimeNow = Date.now();

		// While I have seen 'setInterval' run too fast, I haven't seen 'setTimeout'
		// do that, so we won't bother to check for early timing.

		if (this.uWork) this.uWork();

		let oWait = this.TimeNext + this.Per - oTimeNow;
		// If the timing is very late, oWait could be negative:
		while (oWait <= 0) oWait += this.Per;

		this.IDTimer = setTimeout(this.uExec, oWait);
	}
}
