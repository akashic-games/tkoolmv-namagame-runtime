import { ImageManager } from "../managers/ImageManager";
import type { Game_Battler } from "../objects/GameBattler";
import { Sprite_Base } from "./SpriteBase";

export class Sprite_StateOverlay extends Sprite_Base {
	private _battler: Game_Battler;
	private _overlayIndex: number;
	private _animationCount: number;
	private _pattern: number;

	constructor() {
		super();
	}

	initialize() {
		super.initialize();
		this.initMembers();
		this.loadBitmap();
	}

	initMembers() {
		this._battler = null;
		this._overlayIndex = 0;
		this._animationCount = 0;
		this._pattern = 0;
		this.anchor.x = 0.5;
		this.anchor.y = 1;
	}

	loadBitmap() {
		this.bitmap = ImageManager.loadSystem("States");
		this.setFrame(0, 0, 0, 0);
	}

	setup(battler: Game_Battler) {
		this._battler = battler;
	}

	update() {
		Sprite_Base.prototype.update.call(this);
		this._animationCount++;
		if (this._animationCount >= this.animationWait()) {
			this.updatePattern();
			this.updateFrame();
			this._animationCount = 0;
		}
	}

	animationWait() {
		return 8;
	}

	updatePattern() {
		this._pattern++;
		this._pattern %= 8;
		if (this._battler) {
			this._overlayIndex = this._battler.stateOverlayIndex();
		}
	}

	updateFrame() {
		if (this._overlayIndex > 0) {
			const w = 96;
			const h = 96;
			const sx = this._pattern * w;
			const sy = (this._overlayIndex - 1) * h;
			this.setFrame(sx, sy, w, h);
		} else {
			this.setFrame(0, 0, 0, 0);
		}
	}
}
