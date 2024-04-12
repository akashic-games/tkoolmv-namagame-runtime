import * as PIXI from "../PIXI";

export class Rectangle extends PIXI.Rectangle {
	static emptyRectangle: Rectangle = new Rectangle(0, 0, 0, 0);
}
