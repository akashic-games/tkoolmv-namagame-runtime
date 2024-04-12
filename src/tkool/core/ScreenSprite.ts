import { Container } from "../PIXI";
import { Graphics } from "./Graphics";
import { Utils } from "./Utils";

export class ScreenSprite extends Container {
	private _red: number;
	private _green: number;
	private _blue: number;
	private _colorText: string;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	private __blendMode: any;

	constructor(blackOrWhite?: "black" | "white") {
		super(blackOrWhite);
	}

	initialize(blackOrWhite?: "black" | "white") {
		super.initialize();
		// PIXI.Container.call(this);
		// this._graphics = new PIXI.Graphics();
		// this.addChild(this._graphics);
		// ↑これは？
		// > Geometry to use, if omitted will create a new GraphicsGeometry instance
		// あとに出てくる描画処理で利用されている。

		this.opacity = 0;

		this._red = -1;
		this._green = -1;
		this._blue = -1;
		if (blackOrWhite === "black") {
			this.setBlack();
		} else {
			this.setWhite();
		}

		this.modified();
	}

	get alpha() {
		return this.opacity;
	}

	set alpha(value: number) {
		this.opacity = value;
		this.modified();
	}

	// ScreenSprite.YEPWarned = false;
	// ScreenSprite.warnYep = function () {
	// 	if (!ScreenSprite.YEPWarned) {
	// 		console.log("Deprecation warning. Please update YEP_CoreEngine. ScreenSprite is not a sprite, it has graphics inside.");
	// 		ScreenSprite.YEPWarned = true;
	// 	}
	// };

	// Object.defineProperty(ScreenSprite.prototype, 'anchor', {
	// 	get: function () {
	// 		ScreenSprite.warnYep();
	// 		this.scale.x = 1;
	// 		this.scale.y = 1;
	// 		return { x: 0, y: 0 };
	// 	},
	// 	set: function (value) {
	// 		this.alpha = value.clamp(0, 255) / 255;
	// 	},
	// 	configurable: true
	// });

	setBlack() {
		this.setColor(0, 0, 0);
	}

	setWhite() {
		this.setColor(255, 255, 255);
	}

	setColor(r: number, g: number, b: number) {
		if (this._red !== r || this._green !== g || this._blue !== b) {
			r = Math.min(255, Math.max(Math.round(r || 0), 0));
			g = Math.min(255, Math.max(Math.round(g || 0), 0));
			b = Math.min(255, Math.max(Math.round(b || 0), 0));
			this._red = r;
			this._green = g;
			this._blue = b;

			this._colorText = Utils.rgbToCssColor(r, g, b);

			// var graphics = this._graphics;
			// graphics.clear();
			// var intColor = (r << 16) | (g << 8) | b;
			// graphics.beginFill(intColor, 1);
			// //whole screen with zoom. BWAHAHAHAHA
			// graphics.drawRect(-Graphics.width * 5, -Graphics.height * 5, Graphics.width * 10, Graphics.height * 10);

			this.width = Graphics.width;
			this.height = Graphics.height;
			this.modified();
		}
	}

	renderSelf(renderer: g.Renderer, _camera?: g.Camera): boolean {
		renderer.fillRect(0, 0, this.width, this.height, this._colorText);

		return true;
	}
}
