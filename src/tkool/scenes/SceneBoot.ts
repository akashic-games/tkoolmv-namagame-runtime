import { Graphics } from "../core/Graphics";
import { DataManager } from "../managers/DataManager";
import { $dataSystem } from "../managers/globals";
import { ImageManager } from "../managers/ImageManager";
import { SceneManager } from "../managers/SceneManager";
import { SoundManager } from "../managers/SoundManager";
import { Scene_Base } from "./SceneBase";
import { Scene_Title } from "./SceneTitle";

export class Scene_Boot extends Scene_Base {
	private _startDate: number;

	static loadSystemImages() {
		ImageManager.reserveSystem("IconSet");
		ImageManager.reserveSystem("Balloon");
		ImageManager.reserveSystem("Shadow1");
		ImageManager.reserveSystem("Shadow2");
		ImageManager.reserveSystem("Damage");
		ImageManager.reserveSystem("States");
		ImageManager.reserveSystem("Weapons1");
		ImageManager.reserveSystem("Weapons2");
		ImageManager.reserveSystem("Weapons3");
		ImageManager.reserveSystem("ButtonSet");
	}

	constructor() {
		super();
		if (Object.getPrototypeOf(this) === Scene_Boot.prototype) {
			this.initialize();
		}
	}

	initialize() {
		this._startDate = Date.now();
		super.initialize();
	}

	create() {
		Scene_Base.prototype.create.call(this);
		DataManager.loadDatabase();
		// ConfigManager.load();
		this.loadSystemWindowImage();

		// DataManagerからここへ移動。
		// ファイルロードに関することはすべてcreate()で完結させたい。
		Scene_Boot.loadSystemImages();
	}

	loadSystemWindowImage() {
		ImageManager.reserveSystem("Window");
	}

	isReady() {
		if (Scene_Base.prototype.isReady.call(this)) {
			return DataManager.isDatabaseLoaded() && this.isGameFontLoaded();
		} else {
			return false;
		}
	}

	isGameFontLoaded() {
		if (Graphics.isFontLoaded("GameFont")) {
			return true;
		} else if (!Graphics.canUseCssFontLoading()) {
			const elapsed = Date.now() - this._startDate;
			if (elapsed >= 60000) {
				throw new Error("Failed to load GameFont");
			}
		}
	}

	start() {
		Scene_Base.prototype.start.call(this);
		SoundManager.preloadImportantSounds();
		if (DataManager.isBattleTest() && false) {
			// DataManager.setupBattleTest();
			// SceneManager.goto(Scene_Battle);
		} else if (DataManager.isEventTest() && false) {
			// DataManager.setupEventTest();
			// SceneManager.goto(Scene_Map);
		} else {
			this.checkPlayerLocation();
			DataManager.setupNewGame();
			SceneManager.goto(Scene_Title);
			// Window_TitleCommand.initCommandPosition();
		}
		this.updateDocumentTitle();
	}

	updateDocumentTitle() {
		// document.title = $dataSystem.gameTitle;
	}

	checkPlayerLocation() {
		if ($dataSystem.startMapId === 0) {
			throw new Error('Player"s starting position is not set');
		}
	}
}
