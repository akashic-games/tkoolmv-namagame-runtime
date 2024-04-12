export class Point {
	x: number;
	y: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	set(x?: number, y?: number) {
		this.x = x || 0;
		this.y = y || (y !== 0 ? this.x : 0);
	}
}
