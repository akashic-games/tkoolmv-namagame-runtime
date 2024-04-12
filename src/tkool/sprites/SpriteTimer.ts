import { Bitmap } from "../core/Bitmap";
import { Graphics } from "../core/Graphics";
import { Sprite } from "../core/Sprite";
import { Utils } from "../core/Utils";
import { $gameTimer } from "../managers/globals";

export class Sprite_Timer extends Sprite {
	_seconds: number;

	constructor() {
		super();
		// if (Object.getPrototypeOf(this) === Sprite_Timer.prototype) {
		// 	this.initialize(param.bitmap);
		// }
	}

	initialize() {
		super.initialize();
		this._seconds = 0;
		this.createBitmap();
		this.update();
	}

	createBitmap() {
		this.bitmap = new Bitmap(96, 48);
		this.bitmap.fontSize = 32;
	}

	update() {
		super.update();
		this.updateBitmap();
		this.updatePosition();
		this.updateVisibility();
	}

	updateBitmap() {
		if (this._seconds !== $gameTimer.seconds()) {
			this._seconds = $gameTimer.seconds();
			this.redraw();
		}
	}

	redraw() {
		const text = this.timerText();
		const width = this.bitmap.width;
		const height = this.bitmap.height;
		this.bitmap.clear();
		this.bitmap.drawText(text, 0, 0, width, height, "center");
	}

	timerText() {
		const min = Math.floor(this._seconds / 60) % 60;
		const sec = this._seconds % 60;
		return Utils.padZero(min, 2) + ":" + Utils.padZero(sec, 2);
	}

	updatePosition() {
		this.x = Graphics.width - this.bitmap.width;
		this.y = 0;
	}

	updateVisibility() {
		this.visible = $gameTimer.isWorking();
	}
}
