// BoundErr.js
// ===========
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org
//
// Import with:
//
//   import BoundErr from "./UI/BoundErr.js";
//

import "./BoundErr.css";

import React from "react";

// BoundErr
// --------
// This component acts as a React error boundary.

export default class BoundErr extends React.Component {
	constructor(aProps) {
		super(aProps);

		this.state = {
			Err: null,
			InfoErr: null,
		};
	}

	componentDidCatch(aErr, aInfoErr) {
		this.setState({
			Err: aErr,
			InfoErr: aInfoErr
		});
	}

	uErr() {
		if (!this.state.Err) return null;

		return (
			<div id="Msg">
				{this.state.Err.message}
			</div>
		);
	}

	uStack() {
		if (!this.state?.InfoErr?.componentStack) return null;

		const oLines = this.state.InfoErr.componentStack
			.split("\n")
			.map(a => (<div key={a}>{a}</div>));
		return (
			<div id="Stack">
				{oLines}
			</div>
		);
	}

	uHRefMail() {
		const oSubj = encodeURIComponent("Ogle error");
		let oBody = encodeURIComponent(this.state.Err.message);
		if (this.state?.InfoErr?.componentStack)
			oBody += encodeURIComponent(this.state.InfoErr.componentStack);
		return `mailto:support@anthemion.org?subject=${oSubj}&body=${oBody}`;
	}

	render() {
		if (this.state.Err) return (
			<div id="BoundErr">
				<div id="Head">
					<h3>
						Sorry, something is wrong with Ogle!
					</h3>
					<p>
						Please send the text below to <a href={this.uHRefMail()}>
							support@anthemion.org
						</a>:
					</p>
				</div>

				<hr />

				{this.uErr()}
				{this.uStack()}
			</div>
		);

		return this.props.children;
	}
}
