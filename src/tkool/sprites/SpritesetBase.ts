import { Graphics } from "../core/Graphics";
import { ScreenSprite } from "../core/ScreenSprite";
import { Sprite } from "../core/Sprite";
import { ToneSprite } from "../core/ToneSprite";
import { Utils } from "../core/Utils";
import { $gameScreen } from "../managers/globals";
import type { Filter } from "../PIXI/filters";
import { Sprite_Picture } from "./SpritePicture";
import { Sprite_Timer } from "./SpriteTimer";

export class Spriteset_Base extends Sprite {
	protected _baseSprite: Sprite;

	private _toneFilter: Filter; // WebGLでのみ使われる模様
	private _tone: number[];
	private _blackScreen: ScreenSprite;
	private _toneSprite: ToneSprite;
	private _pictureContainer: Sprite;
	private _timerSprite: Sprite_Timer;
	private _flashSprite: ScreenSprite;
	private _fadeSprite: ScreenSprite;

	constructor(...args: any[]) {
		super(...args);
	}

	initialize() {
		super.initialize();
		this.setFrame(0, 0, Graphics.width, Graphics.height);
		this._tone = [0, 0, 0, 0];
		this.opaque = true;
		this.createLowerLayer();
		this.createToneChanger();
		this.createUpperLayer();
		this.update();
	}

	createLowerLayer() {
		this.createBaseSprite();
	}

	createUpperLayer() {
		this.createPictures();
		this.createTimer();
		this.createScreenSprites();
	}

	update() {
		super.update();
		this.updateScreenSprites();
		this.updateToneChanger();
		this.updatePosition();
	}

	createBaseSprite() {
		this._baseSprite = new Sprite();
		this._baseSprite.setFrame(0, 0, this.width, this.height);
		this._blackScreen = new ScreenSprite();
		this._blackScreen.opacity = 255;
		this.addChild(this._baseSprite);
		this._baseSprite.addChild(this._blackScreen);
	}

	createToneChanger() {
		if (Graphics.isWebGL()) {
			this.createWebGLToneChanger();
		} else {
			this.createCanvasToneChanger();
		}
	}

	createWebGLToneChanger() {
		// const margin = 48;
		// const width = Graphics.width + margin * 2;
		// const height = Graphics.height + margin * 2;
		// this._toneFilter = new ToneFilter();
		// this._baseSprite.filters = [this._toneFilter];
		// this._baseSprite.filterArea = new Rectangle(-margin, -margin, width, height);
	}

	createCanvasToneChanger() {
		this._toneSprite = new ToneSprite();
		this.addChild(this._toneSprite);
	}

	createPictures() {
		const width = Graphics.boxWidth;
		const height = Graphics.boxHeight;
		const x = (Graphics.width - width) / 2;
		const y = (Graphics.height - height) / 2;
		this._pictureContainer = new Sprite();
		this._pictureContainer.setFrame(x, y, width, height);
		for (let i = 1; i <= $gameScreen.maxPictures(); i++) {
			this._pictureContainer.addChild(new Sprite_Picture(i));
		}
		this.addChild(this._pictureContainer);
	}

	createTimer() {
		this._timerSprite = new Sprite_Timer();
		this.addChild(this._timerSprite);
	}

	createScreenSprites() {
		this._flashSprite = new ScreenSprite();
		this._fadeSprite = new ScreenSprite();
		this.addChild(this._flashSprite);
		this.addChild(this._fadeSprite);
	}

	updateScreenSprites() {
		const color = $gameScreen.flashColor();
		this._flashSprite.setColor(color[0], color[1], color[2]);
		this._flashSprite.opacity = color[3];
		this._fadeSprite.opacity = 255 - $gameScreen.brightness();
	}

	updateToneChanger() {
		const tone = $gameScreen.tone();
		if (!Utils.equals(this._tone, tone)) {
			this._tone = Utils.cloneArray(tone);
			if (Graphics.isWebGL()) {
				this.updateWebGLToneChanger();
			} else {
				this.updateCanvasToneChanger();
			}
		}
	}

	updateWebGLToneChanger() {
		// const tone = this._tone;
		// this._toneFilter.reset();
		// this._toneFilter.adjustTone(tone[0], tone[1], tone[2]);
		// this._toneFilter.adjustSaturation(-tone[3]);
	}

	updateCanvasToneChanger() {
		const tone = this._tone;
		this._toneSprite.setTone(tone[0], tone[1], tone[2], tone[3]);
	}

	updatePosition() {
		const screen = $gameScreen;
		const scale = screen.zoomScale();
		this.scale.x = scale;
		this.scale.y = scale;
		this.x = Math.round(-screen.zoomX() * (scale - 1));
		this.y = Math.round(-screen.zoomY() * (scale - 1));
		this.x += Math.round(screen.shake());
	}
}
