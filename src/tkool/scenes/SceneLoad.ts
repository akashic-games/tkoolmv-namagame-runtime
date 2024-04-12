import { DataManager } from "../managers/DataManager";
import { $dataSystem, $gameMap, $gamePlayer, $gameSystem } from "../managers/globals";
import { SceneManager } from "../managers/SceneManager";
import { SoundManager } from "../managers/SoundManager";
import { TextManager } from "../managers/TextManager";
import { Scene_File } from "./SceneFile";
import { Scene_Map } from "./SceneMap";

export class Scene_Load extends Scene_File {
	private _loadSuccess: boolean;

	constructor() {
		super();
		if (Object.getPrototypeOf(this) === Scene_Load.prototype) {
			this.initialize();
		}
	}

	initialize() {
		super.initialize();
		this._loadSuccess = false;
	}

	terminate() {
		super.terminate();
		if (this._loadSuccess) {
			$gameSystem.onAfterLoad();
		}
	}

	mode() {
		return "load";
	}

	helpWindowText() {
		return TextManager.loadMessage;
	}

	firstSavefileIndex() {
		return DataManager.latestSavefileId() - 1;
	}

	onSavefileOk() {
		super.onSavefileOk();
		if (DataManager.loadGame(this.savefileId())) {
			this.onLoadSuccess();
		} else {
			this.onLoadFailure();
		}
	}

	onLoadSuccess() {
		SoundManager.playLoad();
		this.fadeOutAll();
		this.reloadMapIfUpdated();
		SceneManager.goto(Scene_Map);
		this._loadSuccess = true;
	}

	onLoadFailure() {
		SoundManager.playBuzzer();
		this.activateListWindow();
	}

	reloadMapIfUpdated() {
		if ($gameSystem.versionId() !== $dataSystem.versionId) {
			$gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
			$gamePlayer.requestMapReload();
		}
	}
}
