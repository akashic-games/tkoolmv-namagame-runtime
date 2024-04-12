import { Rectangle } from "./Rectangle";

export class Texture {
	baseTexture: { width: number; height: number };
	frame: Rectangle;

	constructor() {
		this.frame = new Rectangle(0, 0, 1, 1);
		this.baseTexture = { width: 0, height: 0 };
	}
}
