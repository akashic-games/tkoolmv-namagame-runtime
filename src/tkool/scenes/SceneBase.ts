import { Graphics } from "../core/Graphics";
import { ScreenSprite } from "../core/ScreenSprite";
import { Stage } from "../core/Stage";
import { Utils } from "../core/Utils";
import { WindowLayer } from "../core/WindowLayer";
import { AudioManager } from "../managers/AudioManager";
import { ImageManager } from "../managers/ImageManager";
import { SceneManager } from "../managers/SceneManager";

export class Scene_Base extends Stage {
	thisSceneLoaded: boolean;

	protected _windowLayer: WindowLayer;
	protected _fadeSprite: ScreenSprite;

	private _active: boolean;
	private _fadeSign: number;
	private _fadeDuration: number;
	private _imageReservationId: number;

	constructor() {
		super();
		this.thisSceneLoaded = false;
		if (Object.getPrototypeOf(this) === Scene_Base.prototype) {
			this.initialize();
		}
	}

	initialize() {
		super.initialize();
		this._active = false;
		this._fadeSign = 0;
		this._fadeDuration = 0;
		this._fadeSprite = null;
		this._imageReservationId = Utils.generateRuntimeId();
	}

	attachReservation() {
		ImageManager.setDefaultReservationId(this._imageReservationId);
	}

	detachReservation() {
		ImageManager.releaseReservation(this._imageReservationId);
	}

	create() {
		//
	}

	isActive() {
		return this._active;
	}

	isReady() {
		return ImageManager.isReady();
	}

	start() {
		this._active = true;
	}

	update() {
		this.updateFade();
		this.updateChildren();
	}

	stop() {
		this._active = false;
	}

	isBusy() {
		return this._fadeDuration > 0;
	}

	terminate() {
		//
	}

	createWindowLayer() {
		const width = Graphics.boxWidth;
		const height = Graphics.boxHeight;
		const x = (Graphics.width - width) / 2;
		const y = (Graphics.height - height) / 2;
		this._windowLayer = new WindowLayer();
		this._windowLayer.move(x, y, width, height);
		this.addChild(this._windowLayer);
	}

	addWindow(window: any) {
		this._windowLayer.addChild(window);
	}

	startFadeIn(duration: number, white: any) {
		this.createFadeSprite(white);
		this._fadeSign = 1;
		this._fadeDuration = duration || 30;
		this._fadeSprite.opacity = 255;
	}

	startFadeOut(duration: number, white?: any) {
		this.createFadeSprite(white);
		this._fadeSign = -1;
		this._fadeDuration = duration || 30;
		this._fadeSprite.opacity = 0;
	}

	createFadeSprite(white: boolean) {
		if (!this._fadeSprite) {
			this._fadeSprite = new ScreenSprite(white ? "white" : "black");
			this.addChild(this._fadeSprite);
		}
		if (white) {
			this._fadeSprite.setWhite();
		} else {
			this._fadeSprite.setBlack();
		}
	}

	updateFade() {
		if (this._fadeDuration > 0) {
			const d = this._fadeDuration;
			if (this._fadeSign > 0) {
				this._fadeSprite.opacity -= this._fadeSprite.opacity / d;
			} else {
				this._fadeSprite.opacity += (255 - this._fadeSprite.opacity) / d;
			}
			this._fadeDuration--;
		}
	}

	updateChildren() {
		// if (! this.children) {
		// 	return;
		// }
		// this.children.forEach((_child) => {
		// 	const child = _child as any;
		// 	if (child.__update) {
		// 		child.__update();
		// 	}
		// 	if (child.updateTransform) {
		// 		child.updateTransform();
		// 	}
		// });
		const children = this._root.children;
		if (!children) {
			return;
		}
		children.forEach(child => {
			if (child.update) {
				child.update();
			}
			if (child.updateTransform) {
				child.updateTransform();
			}
		});
	}

	popScene() {
		SceneManager.pop();
	}

	checkGameover() {
		// if ($gameParty.isAllDead()) {
		// 	SceneManager.goto(Scene_Gameover);
		// }
	}

	fadeOutAll() {
		const time = this.slowFadeSpeed() / 60;
		AudioManager.fadeOutBgm(time);
		AudioManager.fadeOutBgs(time);
		AudioManager.fadeOutMe(time);
		this.startFadeOut(this.slowFadeSpeed());
	}

	fadeSpeed() {
		return 24;
	}

	slowFadeSpeed() {
		return this.fadeSpeed() * 2;
	}

	assetLoadHandler(_asset: g.Asset, _assetManager: g.AssetManager, _holder: g.AssetHolder<g.SceneRequestAssetHandler>): number {
		return 0;
	}
}
