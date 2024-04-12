import * as PIXI from "../PIXI";
import { Utils } from "./Utils";

export class ToneFilter extends PIXI.filters.ColorMatrixFilter {
	constructor() {
		super();
	}

	adjustHue(value: number) {
		this.hue(value, true);
	}

	adjustSaturation(value: number) {
		value = Utils.clamp(value || 0, -255, 255) / 255;
		this.saturate(value, true);
	}

	adjustTone(r: number, g: number, b: number) {
		r = Utils.clamp(r || 0, -255, 255) / 255;
		g = Utils.clamp(g || 0, -255, 255) / 255;
		b = Utils.clamp(b || 0, -255, 255) / 255;

		if (r !== 0 || g !== 0 || b !== 0) {
			const matrix = [1, 0, 0, r, 0, 0, 1, 0, g, 0, 0, 0, 1, b, 0, 0, 0, 0, 1, 0];
			this._loadMatrix(matrix, true);
		}
	}
}
