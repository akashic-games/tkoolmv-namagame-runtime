import { Sprite } from "../core/Sprite";
import { $gameParty } from "../managers/globals";
import { SceneManager } from "../managers/SceneManager";
import type { Game_Actor } from "../objects/GameActor";
import { Window_Help } from "../windows/WindowHelp";
import { Scene_Base } from "./SceneBase";

export class Scene_MenuBase extends Scene_Base {
	private _actor: Game_Actor;
	private _backgroundSprite: Sprite;
	protected _helpWindow: Window_Help;

	constructor() {
		super();
		if (Object.getPrototypeOf(this) === Scene_MenuBase.prototype) {
			this.initialize();
		}
	}

	initialize() {
		super.initialize();
	}

	create() {
		super.create();
		this.createBackground();
		this.updateActor();
		this.createWindowLayer();
	}

	actor() {
		return this._actor;
	}

	updateActor() {
		this._actor = $gameParty.menuActor();
	}

	createBackground() {
		this._backgroundSprite = new Sprite();
		this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
		this.addChild(this._backgroundSprite);
	}

	setBackgroundOpacity(opacity: number) {
		this._backgroundSprite.opacity = opacity;
	}

	createHelpWindow() {
		this._helpWindow = new Window_Help();
		this.addWindow(this._helpWindow);
	}
	nextActor() {
		$gameParty.makeMenuActorNext();
		this.updateActor();
		this.onActorChange();
	}
	previousActor() {
		$gameParty.makeMenuActorPrevious();
		this.updateActor();
		this.onActorChange();
	}

	onActorChange() {
		//
	}
}
