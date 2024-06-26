import type { Bitmap } from "../core/Bitmap";
import { Graphics } from "../core/Graphics";
import { ScreenSprite } from "../core/ScreenSprite";
import { Sprite } from "../core/Sprite";
import type { Stage } from "../core/Stage";
import { Utils } from "../core/Utils";
import { AudioManager } from "../managers/AudioManager";
import { ImageManager } from "../managers/ImageManager";
import type { Container } from "../PIXI";

export class Sprite_Animation extends Sprite {
	static _checker1: any = {};
	static _checker2: any = {};

	_reduceArtifacts: boolean;
	private _target: any;
	private _animation: any;
	private _mirror: boolean;
	private _delay: number;
	private _rate: number;
	private _duration: number;
	private _flashColor: number[];
	private _flashDuration: number;
	private _screenFlashDuration: number;
	private _hidingDuration: number;
	private _bitmap1: Bitmap;
	private _bitmap2: Bitmap;
	private _cellSprites: Sprite[];
	private _screenFlashSprite: ScreenSprite;
	private _duplicated: boolean;

	constructor(...args: any[]) {
		super(...args);
		// if (Object.getPrototypeOf(this) === Sprite_Animation.prototype) {
		// 	this.initialize();
		// }
	}

	initialize() {
		super.initialize();
		this._reduceArtifacts = true;
		this.initMembers();
	}

	initMembers() {
		this._target = null;
		this._animation = null;
		this._mirror = false;
		this._delay = 0;
		this._rate = 4;
		this._duration = 0;
		this._flashColor = [0, 0, 0, 0];
		this._flashDuration = 0;
		this._screenFlashDuration = 0;
		this._hidingDuration = 0;
		this._bitmap1 = null;
		this._bitmap2 = null;
		this._cellSprites = [];
		this._screenFlashSprite = null;
		this._duplicated = false;
		this.z = 8;
	}

	setup(target: any, animation: any, mirror: boolean, delay: number) {
		this._target = target;
		this._animation = animation;
		this._mirror = mirror;
		this._delay = delay;
		if (this._animation) {
			this.remove();
			this.setupRate();
			this.setupDuration();
			this.loadBitmaps();
			this.createSprites();
		}
	}

	remove() {
		if (this.parent && (this.parent as Container | Stage).removeChild(this)) {
			this._target.setBlendColor([0, 0, 0, 0]);
			this._target.show();
		}
	}

	setupRate() {
		this._rate = 4;
	}

	setupDuration() {
		this._duration = this._animation.frames.length * this._rate + 1;
	}

	update() {
		super.update();
		this.updateMain();
		this.updateFlash();
		this.updateScreenFlash();
		this.updateHiding();
		Sprite_Animation._checker1 = {};
		Sprite_Animation._checker2 = {};
	}

	updateFlash() {
		if (this._flashDuration > 0) {
			const d = this._flashDuration--;
			this._flashColor[3] *= (d - 1) / d;
			this._target.setBlendColor(this._flashColor);
		}
	}

	updateScreenFlash() {
		if (this._screenFlashDuration > 0) {
			const d = this._screenFlashDuration--;
			if (this._screenFlashSprite) {
				this._screenFlashSprite.x = -this.absoluteX();
				this._screenFlashSprite.y = -this.absoluteY();
				this._screenFlashSprite.opacity *= (d - 1) / d;
				this._screenFlashSprite.visible = this._screenFlashDuration > 0;
			}
		}
	}

	absoluteX() {
		let x = 0;
		let object: any = this;
		while (object) {
			x += object.x;
			object = object.parent;
		}
		return x;
	}

	absoluteY() {
		let y = 0;
		let object: any = this;
		while (object) {
			y += object.y;
			object = object.parent;
		}
		return y;
	}

	updateHiding() {
		if (this._hidingDuration > 0) {
			this._hidingDuration--;
			if (this._hidingDuration === 0) {
				this._target.show();
			}
		}
	}

	isPlaying() {
		return this._duration > 0;
	}

	loadBitmaps() {
		const name1 = this._animation.animation1Name;
		const name2 = this._animation.animation2Name;
		const hue1 = this._animation.animation1Hue;
		const hue2 = this._animation.animation2Hue;
		this._bitmap1 = ImageManager.loadAnimation(name1, hue1);
		this._bitmap2 = ImageManager.loadAnimation(name2, hue2);
	}

	isReady() {
		return this._bitmap1 && this._bitmap1.isReady() && this._bitmap2 && this._bitmap2.isReady();
	}

	createSprites() {
		if (!Sprite_Animation._checker2[this._animation]) {
			this.createCellSprites();
			if (this._animation.position === 3) {
				Sprite_Animation._checker2[this._animation] = true;
			}
			this.createScreenFlashSprite();
		}
		if (Sprite_Animation._checker1[this._animation]) {
			this._duplicated = true;
		} else {
			this._duplicated = false;
			if (this._animation.position === 3) {
				Sprite_Animation._checker1[this._animation] = true;
			}
		}
	}

	createCellSprites() {
		this._cellSprites = [];
		for (let i = 0; i < 16; i++) {
			const sprite = new Sprite();
			sprite.anchor.x = 0.5;
			sprite.anchor.y = 0.5;
			this._cellSprites.push(sprite);
			this.addChild(sprite);
		}
	}

	createScreenFlashSprite() {
		this._screenFlashSprite = new ScreenSprite();
		this.addChild(this._screenFlashSprite);
	}

	updateMain() {
		if (this.isPlaying() && this.isReady()) {
			if (this._delay > 0) {
				this._delay--;
			} else {
				this._duration--;
				this.updatePosition();
				if (this._duration % this._rate === 0) {
					this.updateFrame();
				}
			}
		}
	}

	updatePosition() {
		if (this._animation.position === 3) {
			// tsc@v2.6.2 だと通らないみたい
			this.x = "width" in this.parent ? this.parent.width / 2 : Graphics.width;
			this.y = "height" in this.parent ? this.parent.height / 2 : Graphics.height;
		} else {
			const parent = this._target.parent;
			const grandparent = parent ? parent.parent : null;
			this.x = this._target.x;
			this.y = this._target.y;
			if (this.parent === grandparent) {
				this.x += parent.x;
				this.y += parent.y;
			}
			if (this._animation.position === 0) {
				this.y -= this._target.height;
			} else if (this._animation.position === 1) {
				this.y -= this._target.height / 2;
			}
		}
	}

	updateFrame() {
		if (this._duration > 0) {
			const frameIndex = this.currentFrameIndex();
			this.updateAllCellSprites(this._animation.frames[frameIndex]);
			this._animation.timings.forEach((timing: any) => {
				if (timing.frame === frameIndex) {
					this.processTimingData(timing);
				}
			});
		}
	}

	currentFrameIndex() {
		return this._animation.frames.length - Math.floor((this._duration + this._rate - 1) / this._rate);
	}

	updateAllCellSprites(frame: any[]) {
		for (let i = 0; i < this._cellSprites.length; i++) {
			const sprite = this._cellSprites[i];
			if (i < frame.length) {
				this.updateCellSprite(sprite, frame[i]);
			} else {
				sprite.visible = false;
			}
		}
	}

	updateCellSprite(sprite: Sprite, cell: any[]) {
		const pattern = cell[0];
		if (pattern >= 0) {
			const sx = (pattern % 5) * 192;
			const sy = Math.floor((pattern % 100) / 5) * 192;
			const mirror = this._mirror;
			sprite.bitmap = pattern < 100 ? this._bitmap1 : this._bitmap2;
			sprite.setFrame(sx, sy, 192, 192);
			sprite.x = cell[1];
			sprite.y = cell[2];
			sprite.rotation = (cell[4] * Math.PI) / 180;
			// sprite.scale.x = cell[3] / 100;
			sprite.scale.x = cell[3] / 100;

			if (cell[5]) {
				// sprite.scale.x *= -1;
				sprite.scale.x *= -1;
			}
			if (mirror) {
				sprite.x *= -1;
				sprite.rotation *= -1;
				// sprite.scale.x *= -1;
				sprite.scale.x *= -1;
			}

			// sprite.scale.y = cell[3] / 100;
			sprite.scale.y = cell[3] / 100;
			sprite.opacity = cell[6];
			// sprite.blendMode = cell[7]; // TODO: impl
			sprite.visible = true;
		} else {
			sprite.visible = false;
		}
	}

	processTimingData(timing: any) {
		const duration = timing.flashDuration * this._rate;
		switch (timing.flashScope) {
			case 1:
				this.startFlash(timing.flashColor, duration);
				break;
			case 2:
				this.startScreenFlash(timing.flashColor, duration);
				break;
			case 3:
				this.startHiding(duration);
				break;
		}
		if (!this._duplicated && timing.se) {
			AudioManager.playSe(timing.se);
		}
	}

	startFlash(color: number[], duration: number) {
		// this._flashColor = color.clone();
		this._flashColor = Utils.cloneArray(color);
		this._flashDuration = duration;
	}

	startScreenFlash(color: number[], duration: number) {
		this._screenFlashDuration = duration;
		if (this._screenFlashSprite) {
			this._screenFlashSprite.setColor(color[0], color[1], color[2]);
			this._screenFlashSprite.opacity = color[3];
		}
	}

	startHiding(duration: number) {
		this._hidingDuration = duration;
		this._target.hide();
	}
}
