export class Rectangle {
	static emptyRectangle: Rectangle = new Rectangle();

	x: number;
	y: number;
	width: number;
	height: number;
	type: number;

	constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.type = 1; // SHAPES.RECT; // TODO: ちゃんと
	}

	get left() {
		return this.x;
	}

	get right() {
		return this.x + this.width;
	}

	get top() {
		return this.y;
	}

	get bottom() {
		return this.y + this.height;
	}

	static get EMPTY() {
		return new Rectangle(0, 0, 0, 0);
	}

	clone() {
		return new Rectangle(this.x, this.y, this.width, this.height);
	}

	copy(rectangle: Rectangle) {
		this.x = rectangle.x;
		this.y = rectangle.y;
		this.width = rectangle.width;
		this.height = rectangle.height;
		return this;
	}

	contains(x: number, y: number) {
		if (this.width <= 0 || this.height <= 0) {
			return false;
		}
		if (x >= this.x && x < this.x + this.width) {
			if (y >= this.y && y < this.y + this.height) {
				return true;
			}
		}
		return false;
	}

	pad(paddingX: number, paddingY: number) {
		paddingX = paddingX || 0;
		paddingY = paddingY || (paddingY !== 0 ? paddingX : 0);
		this.x -= paddingX;
		this.y -= paddingY;
		this.width += paddingX * 2;
		this.height += paddingY * 2;
	}

	fit(rectangle: Rectangle) {
		if (this.x < rectangle.x) {
			this.width += this.x;
			if (this.width < 0) {
				this.width = 0;
			}
			this.x = rectangle.x;
		}
		if (this.y < rectangle.y) {
			this.height += this.y;
			if (this.height < 0) {
				this.height = 0;
			}
			this.y = rectangle.y;
		}
		if (this.x + this.width > rectangle.x + rectangle.width) {
			this.width = rectangle.width - this.x;
			if (this.width < 0) {
				this.width = 0;
			}
		}
		if (this.y + this.height > rectangle.y + rectangle.height) {
			this.height = rectangle.height - this.y;
			if (this.height < 0) {
				this.height = 0;
			}
		}
	}

	enlarge(rectangle: Rectangle) {
		const x1 = Math.min(this.x, rectangle.x);
		const x2 = Math.max(this.x + this.width, rectangle.x + rectangle.width);
		const y1 = Math.min(this.y, rectangle.y);
		const y2 = Math.max(this.y + this.height, rectangle.y + rectangle.height);
		this.x = x1;
		this.width = x2 - x1;
		this.y = y1;
		this.height = y2 - y1;
	}
}
