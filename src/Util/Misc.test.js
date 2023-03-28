// Misc.test.js
// ============
// Copyright ©2023 Jeremy Kelly
// www.anthemion.org

import * as Misc from "./Misc.js";

// uCkThrow_Params
// ---------------

class tSuper {
	constructor(aVal) { this.Val = aVal; }
}

class tSub extends tSuper {
	constructor(aVal, aExtra) {
		super(aVal);
		this.Extra = aExtra;
	}
}

test("Util uCkThrow_Params: Expect Number", () => {
	function uUseNum(aNum) {
		Misc.uCkThrow_Params({ aNum }, Number, "uUseNum");
	}

	uUseNum(0);
	uUseNum(NaN);
	uUseNum(Infinity);

	expect(() => uUseNum(undefined)).toThrow(
		"uUseNum: aNum is not set"
	);
	expect(() => uUseNum(null)).toThrow(
		"uUseNum: aNum is not set"
	);
	expect(() => uUseNum("X")).toThrow(
		"uUseNum: aNum is String, should be Number"
	);
	expect(() => uUseNum([ 1 ])).toThrow(
		"uUseNum: aNum is Array, should be Number"
	);
	expect(() => uUseNum({ X: 1 })).toThrow(
		"uUseNum: aNum is Object, should be Number"
	);
	expect(() => uUseNum(new tSuper(1))).toThrow(
		"uUseNum: aNum is tSuper, should be Number"
	);
});

test("Util uCkThrow_Params: Expect two numbers", () => {
	function uUseNums(aNum0, aNum1) {
		Misc.uCkThrow_Params({ aNum0, aNum1 }, Number, "uUseNums");
	}

	uUseNums(0, 1);

	expect(() => uUseNums(1)).toThrow(
		"uUseNums: aNum1 is not set"
	);
	expect(() => uUseNums(null, 1)).toThrow(
		"uUseNums: aNum0 is not set"
	);
	expect(() => uUseNums(1, "X")).toThrow(
		"uUseNums: aNum1 is String, should be Number"
	);
});

test("Util uCkThrow_Params: Expect Number, no caller name", () => {
	function uUseNum(aNum) {
		Misc.uCkThrow_Params({ aNum }, Number);
	}

	uUseNum(0);

	expect(() => uUseNum(undefined)).toThrow(
		"aNum is not set"
	);
	expect(() => uUseNum("X")).toThrow(
		"aNum is String, should be Number"
	);
});

test("Util uCkThrow_Params: Expect String", () => {
	function uUseStr(aStr) {
		Misc.uCkThrow_Params({ aStr }, String, "uUseStr");
	}

	uUseStr("");
	uUseStr("X");

	expect(() => uUseStr(undefined)).toThrow(
		"uUseStr: aStr is not set"
	);
	expect(() => uUseStr(null)).toThrow(
		"uUseStr: aStr is not set"
	);
	expect(() => uUseStr(1)).toThrow(
		"uUseStr: aStr is Number, should be String"
	);
	expect(() => uUseStr([ 1 ])).toThrow(
		"uUseStr: aStr is Array, should be String"
	);
	expect(() => uUseStr({ X: 1 })).toThrow(
		"uUseStr: aStr is Object, should be String"
	);
	expect(() => uUseStr(new tSuper(1))).toThrow(
		"uUseStr: aStr is tSuper, should be String"
	);
});

test("Util uCkThrow_Params: Expect Array", () => {
	function uUseArr(aArr) {
		Misc.uCkThrow_Params({ aArr }, Array, "uUseArr");
	}

	uUseArr([]);
	uUseArr([ 1 ]);

	expect(() => uUseArr(undefined)).toThrow(
		"uUseArr: aArr is not set"
	);
	expect(() => uUseArr(null)).toThrow(
		"uUseArr: aArr is not set"
	);
	expect(() => uUseArr(1)).toThrow(
		"uUseArr: aArr is Number, should be Array"
	);
	expect(() => uUseArr("X")).toThrow(
		"uUseArr: aArr is String, should be Array"
	);
	expect(() => uUseArr({ X: 1 })).toThrow(
		"uUseArr: aArr is Object, should be Array"
	);
	expect(() => uUseArr(new tSuper(1))).toThrow(
		"uUseArr: aArr is tSuper, should be Array"
	);
});

test("Util uCkThrow_Params: Expect object", () => {
	function uUseObj(aObj) {
		Misc.uCkThrow_Params({ aObj }, Object, "uUseObj");
	}

	uUseObj({});
	uUseObj({ X: 1 });
	uUseObj([ 1 ]);
	uUseObj(new tSuper(1));

	expect(() => uUseObj(undefined)).toThrow(
		"uUseObj: aObj is not set"
	);
	expect(() => uUseObj(null)).toThrow(
		"uUseObj: aObj is not set"
	);
	expect(() => uUseObj(1)).toThrow(
		"uUseObj: aObj is Number, should be Object"
	);
	expect(() => uUseObj("X")).toThrow(
		"uUseObj: aObj is String, should be Object"
	);
});

test("Util uCkThrow_Params: Expect class instance", () => {
	function uUseSuper(aInst) {
		Misc.uCkThrow_Params({ aInst }, tSuper, "uUseSuper");
	}
	function uUseSub(aInst) {
		Misc.uCkThrow_Params({ aInst }, tSub, "uUseSub");
	}

	uUseSuper(new tSuper(1));
	uUseSuper(new tSub(1, "X"));
	uUseSub(new tSub(1, "X"));

	expect(() => uUseSuper(undefined)).toThrow(
		"uUseSuper: aInst is not set"
	);
	expect(() => uUseSuper(null)).toThrow(
		"uUseSuper: aInst is not set"
	);
	expect(() => uUseSuper(1)).toThrow(
		"uUseSuper: aInst is Number, should be tSuper"
	);
	expect(() => uUseSuper("X")).toThrow(
		"uUseSuper: aInst is String, should be tSuper"
	);
	expect(() => uUseSuper([ 1 ])).toThrow(
		"uUseSuper: aInst is Array, should be tSuper"
	);
	expect(() => uUseSuper({ X: 1 })).toThrow(
		"uUseSuper: aInst is Object, should be tSuper"
	);
});
