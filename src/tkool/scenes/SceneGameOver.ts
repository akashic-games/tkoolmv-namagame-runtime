import { Sprite } from "../core/Sprite";
import { TouchInput } from "../core/TouchInput";
import { AudioManager } from "../managers/AudioManager";
import { $dataSystem } from "../managers/globals";
import { ImageManager } from "../managers/ImageManager";
import { SceneManager } from "../managers/SceneManager";
import { Scene_Base } from "./SceneBase";
import { Scene_Title } from "./SceneTitle";

export class Scene_Gameover extends Scene_Base {
	private _backSprite: Sprite;

	constructor() {
		super();

		if (Object.getPrototypeOf(this) === Scene_Gameover.prototype) {
			this.initialize();
		}
	}

	initialize() {
		super.initialize();
	}

	create() {
		super.create();
		this.playGameoverMusic();
		this.createBackground();
	}

	start() {
		super.start();
		this.startFadeIn(this.slowFadeSpeed(), false);
	}

	update() {
		if (this.isActive() && !this.isBusy() && this.isTriggered()) {
			this.gotoTitle();
		}
		super.update();
	}

	stop() {
		Scene_Base.prototype.stop.call(this);
		this.fadeOutAll();
	}

	terminate() {
		Scene_Base.prototype.terminate.call(this);
		AudioManager.stopAll();
	}

	playGameoverMusic() {
		AudioManager.stopBgm();
		AudioManager.stopBgs();
		AudioManager.playMe($dataSystem.gameoverMe);
	}

	createBackground() {
		this._backSprite = new Sprite();
		this._backSprite.bitmap = ImageManager.loadSystem("GameOver");
		this.addChild(this._backSprite);
	}

	isTriggered() {
		return /* Input.isTriggered("ok") ||*/ TouchInput.isTriggered();
	}

	gotoTitle() {
		SceneManager.goto(Scene_Title);
	}
}
