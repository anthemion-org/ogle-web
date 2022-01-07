// Rnd.js
// ------
// Copyright ©2022 Jeremy Kelly
// www.anthemion.org

// Returns an integer less than aCeil, and greater than or equal to zero.
export function uInt(aCeil) {
	return Math.floor(Math.random() * aCeil);
}
