import { Sprite } from "../core/Sprite";
import { Utils } from "../core/Utils";
import { Sprite_Animation } from "./SpriteAnimation";

export class Sprite_Base extends Sprite {
	protected _animationSprites: Sprite_Animation[];
	protected _effectTarget: Sprite;

	private _hiding: boolean;

	constructor(...args: any[]) {
		super(...args);
	}

	initialize(..._args: any[]): void {
		super.initialize();
		this._animationSprites = [];
		this._effectTarget = this;
		this._hiding = false;
	}

	update() {
		super.update();
		this.updateVisibility();
		this.updateAnimationSprites();
	}

	hide() {
		this._hiding = true;
		this.updateVisibility();
	}

	show() {
		this._hiding = false;
		this.updateVisibility();
	}

	updateVisibility() {
		this.visible = !this._hiding;
	}

	updateAnimationSprites() {
		if (this._animationSprites.length > 0) {
			// const sprites = this._animationSprites.clone();
			const sprites = Utils.cloneArray(this._animationSprites);
			this._animationSprites = [];
			for (let i = 0; i < sprites.length; i++) {
				const sprite = sprites[i];
				if (sprite.isPlaying()) {
					this._animationSprites.push(sprite);
				} else {
					sprite.remove();
				}
			}
		}
	}

	startAnimation(animation: any, mirror: boolean, delay: number) {
		const sprite = new Sprite_Animation();
		sprite.setup(this._effectTarget, animation, mirror, delay);
		this.parent.addChild(sprite);
		this._animationSprites.push(sprite);
	}

	isAnimationPlaying() {
		return this._animationSprites.length > 0;
	}
}
