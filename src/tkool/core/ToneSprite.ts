import { Container } from "../PIXI";
import { Graphics } from "./Graphics";
import { Utils } from "./Utils";

// export interface ToneSpriteParameterObject extends ContainerParameterObject {

// }

export class ToneSprite extends Container {
	_red: number;
	_green: number;
	_blue: number;
	_gray: number;

	constructor() {
		super();
		// this.initialize();
	}

	initialize() {
		super.initialize();
		this.clear();
	}

	clear() {
		this._red = 0;
		this._green = 0;
		this._blue = 0;
		this._gray = 0;
	}

	setTone(r: number, g: number, b: number, gray: number) {
		this._red = Utils.clamp(Math.round(r || 0), -255, 255);
		this._green = Utils.clamp(Math.round(g || 0), -255, 255);
		this._blue = Utils.clamp(Math.round(b || 0), -255, 255);
		this._gray = Utils.clamp(Math.round(gray || 0), 0, 255);
	}

	// ToneSprite.prototype._renderCanvas = function(renderer) {
	renderSelf(renderer: g.Renderer, _camera?: g.Camera): boolean {
		if (this.visible) {
			// const context = renderer.context;
			// const t = this.worldTransform;
			// const r = renderer.resolution;
			// const width = Graphics.width;
			// const height = Graphics.height;
			// context.save();
			const width = Graphics.width;
			const height = Graphics.height;
			renderer.save();

			// context.setTransform(t.a, t.b, t.c, t.d, t.tx * r, t.ty * r);
			// transformはAkashicによって設定済みのものそのままで良いと想定

			// if (Graphics.canUseSaturationBlend() && this._gray > 0) {
			// 	context.globalCompositeOperation = "saturation";
			// 	context.globalAlpha = this._gray / 255;
			// 	context.fillStyle = "#ffffff";
			// 	context.fillRect(0, 0, width, height);
			// }
			if (Graphics.canUseSaturationBlend() && this._gray > 0) {
				renderer.setCompositeOperation("saturation");
				renderer.setOpacity(this._gray / 255);
				renderer.fillRect(0, 0, width, height, "white");
			}

			// context.globalAlpha = 1;
			renderer.setOpacity(1);
			const r1 = Math.max(0, this._red);
			const g1 = Math.max(0, this._green);
			const b1 = Math.max(0, this._blue);
			// if (r1 || g1 || b1) {
			// 	context.globalCompositeOperation = "lighter";
			// 	context.fillStyle = Utils.rgbToCssColor(r1, g1, b1);
			// 	context.fillRect(0, 0, width, height);
			// }
			if (r1 || g1 || b1) {
				renderer.setCompositeOperation("lighter");
				renderer.fillRect(0, 0, width, height, Utils.rgbToCssColor(r1, g1, b1));
			}

			if (Graphics.canUseDifferenceBlend()) {
				const r2 = Math.max(0, -this._red);
				const g2 = Math.max(0, -this._green);
				const b2 = Math.max(0, -this._blue);
				if (r2 || g2 || b2) {
					// context.globalCompositeOperation = "difference";
					// context.fillStyle = "#ffffff";
					// context.fillRect(0, 0, width, height);
					// context.globalCompositeOperation = "lighter";
					// context.fillStyle = Utils.rgbToCssColor(r2, g2, b2);
					// context.fillRect(0, 0, width, height);
					// context.globalCompositeOperation = "difference";
					// context.fillStyle = "#ffffff";
					// context.fillRect(0, 0, width, height);

					renderer.setCompositeOperation("difference");
					renderer.fillRect(0, 0, width, height, "white");
					renderer.setCompositeOperation("lighter");
					renderer.fillRect(0, 0, width, height, Utils.rgbToCssColor(r2, g2, b2));
					renderer.setCompositeOperation("difference");
					renderer.fillRect(0, 0, width, height, "white");
				}
			}
			// context.restore();
			renderer.restore();
		}

		return true;
	}

	// _renderWebGL(renderer) {
	// 	// Not supported
	// }
}
