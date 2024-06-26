import { TouchInput } from "../core/TouchInput";
import { AudioManager } from "../managers/AudioManager";
import { BattleManager } from "../managers/BattleManager";
import { DataManager } from "../managers/DataManager";
import { $gamePlayer, $gameMap, $gameScreen, $gameTimer, $gameTemp, $gameMessage, $gameSystem } from "../managers/globals";
import { ImageManager } from "../managers/ImageManager";
import { SceneManager } from "../managers/SceneManager";
import { SoundManager } from "../managers/SoundManager";
import { Spriteset_Map } from "../sprites/SpritesetMap";
import { Window_MapName } from "../windows/WindowMapName";
import { Window_MenuCommand } from "../windows/WindowMenuCommand";
import { Window_Message } from "../windows/WindowMessage";
import { Window_ScrollText } from "../windows/WindowScrollText";
import { Scene_Base } from "./SceneBase";
import { Scene_Battle } from "./SceneBattle";
import { Scene_Gameover } from "./SceneGameOver";
import { Scene_Menu } from "./SceneMenu";
import { Scene_Title } from "./SceneTitle";

// TODO: 以下のでっち上げをなんとかする。
// declare const Scene_Load: any;
// eslint-disable-next-line @typescript-eslint/naming-convention
declare const Scene_Debug: any;

export class Scene_Map extends Scene_Base {
	menuCalling: boolean;

	private _waitCount: number;
	private _encounterEffectDuration: number;
	private _mapLoaded: boolean;
	private _touchCount: number;
	private _transfer: boolean;
	private _mapNameWindow: Window_MapName;
	private _messageWindow: Window_Message;
	private _spriteset: Spriteset_Map;
	private _scrollTextWindow: Window_ScrollText;

	constructor() {
		super();
		if (Object.getPrototypeOf(this) === Scene_Map.prototype) {
			this.initialize();
		}
	}

	initialize() {
		super.initialize();
		this._waitCount = 0;
		this._encounterEffectDuration = 0;
		this._mapLoaded = false;
		this._touchCount = 0;
	}

	create() {
		super.create();
		this._transfer = $gamePlayer.isTransferring();
		const mapId = this._transfer ? $gamePlayer.newMapId() : $gameMap.mapId();
		DataManager.loadMapData(mapId);
	}

	isReady() {
		if (!this._mapLoaded && DataManager.isMapLoaded()) {
			// NOTE: `assetLoadHandler()` で呼び出す
			// this.onMapLoaded();
			// this._mapLoaded = true;
		}

		return this._mapLoaded && super.isReady();
	}

	onMapLoaded() {
		if (this._transfer) {
			$gamePlayer.performTransfer();
		}
		this.createDisplayObjects();
	}

	assetLoadHandler(_asset: g.Asset, _assetManager: g.AssetManager, _holder: g.AssetHolder<g.SceneRequestAssetHandler>): number {
		if (this._mapLoaded) {
			return 0;
		}

		if (DataManager.isMapLoaded()) {
			this.onMapLoaded(); // 画像のロードリクエストが走っているはず
			this._mapLoaded = true;
		}
		return 0;
	}

	start() {
		super.start();
		SceneManager.clearStack();
		if (this._transfer) {
			this.fadeInForTransfer();
			this._mapNameWindow.open();
			$gameMap.autoplay();
		} else if (this.needsFadeIn()) {
			this.startFadeIn(this.fadeSpeed(), false);
		}
		this.menuCalling = false;
	}

	update() {
		this.updateDestination();
		this.updateMainMultiply();
		if (this.isSceneChangeOk()) {
			this.updateScene();
		} else if (SceneManager.isNextScene(Scene_Battle)) {
			this.updateEncounterEffect();
		}
		this.updateWaitCount();
		super.update();
	}

	updateMainMultiply() {
		this.updateMain();
		if (this.isFastForward()) {
			this.updateMain();
		}
	}

	updateMain() {
		const active = this.isActive();
		$gameMap.update(active);
		$gamePlayer.update(active);
		$gameTimer.update(active);
		$gameScreen.update();
	}

	isFastForward() {
		return $gameMap.isEventRunning() && !SceneManager.isSceneChanging() && /* Input.isLongPressed('ok') ||*/ TouchInput.isLongPressed();
	}

	stop() {
		super.stop();
		$gamePlayer.straighten();
		this._mapNameWindow.close();
		if (this.needsSlowFadeOut()) {
			this.startFadeOut(this.slowFadeSpeed(), false);
		} else if (SceneManager.isNextScene(Scene_Map)) {
			this.fadeOutForTransfer();
		} else if (SceneManager.isNextScene(Scene_Battle)) {
			this.launchBattle();
		}
	}

	isBusy() {
		return (
			(this._messageWindow && this._messageWindow.isClosing()) ||
			this._waitCount > 0 ||
			this._encounterEffectDuration > 0 ||
			super.isBusy()
		);
	}

	terminate() {
		super.terminate();
		if (!SceneManager.isNextScene(Scene_Battle)) {
			this._spriteset.update();
			this._mapNameWindow.hide();
			SceneManager.snapForBackground();
		} else {
			ImageManager.clearRequest();
		}

		if (SceneManager.isNextScene(Scene_Map)) {
			ImageManager.clearRequest();
		}

		$gameScreen.clearZoom();

		this.removeChild(this._fadeSprite);
		this.removeChild(this._mapNameWindow);
		this.removeChild(this._windowLayer);
		this.removeChild(this._spriteset);
	}

	needsFadeIn() {
		return SceneManager.isPreviousScene(Scene_Battle);
		// || SceneManager.isPreviousScene(Scene_Load)); // Scene_Load(ロード機能)は非サポートのため、コメントアウト
	}

	needsSlowFadeOut() {
		return SceneManager.isNextScene(Scene_Title) || SceneManager.isNextScene(Scene_Gameover);
	}

	updateWaitCount() {
		if (this._waitCount > 0) {
			this._waitCount--;
			return true;
		}
		return false;
	}

	updateDestination() {
		if (this.isMapTouchOk()) {
			this.processMapTouch();
		} else {
			$gameTemp.clearDestination();
			this._touchCount = 0;
		}
	}

	isMapTouchOk() {
		return this.isActive() && $gamePlayer.canMove();
	}

	processMapTouch() {
		if (TouchInput.isTriggered() || this._touchCount > 0) {
			if (TouchInput.isPressed()) {
				if (this._touchCount === 0 || this._touchCount >= 15) {
					const x = $gameMap.canvasToMapX(TouchInput.x);
					const y = $gameMap.canvasToMapY(TouchInput.y);
					$gameTemp.setDestination(x, y);
				}
				this._touchCount++;
			} else {
				this._touchCount = 0;
			}
		}
	}

	isSceneChangeOk() {
		return this.isActive() && !$gameMessage.isBusy();
	}

	updateScene() {
		this.checkGameover();
		if (!SceneManager.isSceneChanging()) {
			this.updateTransferPlayer();
		}
		if (!SceneManager.isSceneChanging()) {
			this.updateEncounter();
		}
		if (!SceneManager.isSceneChanging()) {
			this.updateCallMenu();
		}
		if (!SceneManager.isSceneChanging()) {
			this.updateCallDebug();
		}
	}

	createDisplayObjects() {
		this.createSpriteset();
		this.createMapNameWindow();
		this.createWindowLayer();
		this.createAllWindows();
	}

	createSpriteset() {
		this._spriteset = new Spriteset_Map(); // ファイルの要求がある
		this.addChild(this._spriteset);
	}

	createAllWindows() {
		this.createMessageWindow();
		this.createScrollTextWindow();
	}

	createMapNameWindow() {
		this._mapNameWindow = new Window_MapName();
		this.addChild(this._mapNameWindow);
	}

	createMessageWindow() {
		this._messageWindow = new Window_Message();
		this.addWindow(this._messageWindow);
		this._messageWindow.subWindows().forEach(window => {
			this.addWindow(window);
		});
	}

	createScrollTextWindow() {
		this._scrollTextWindow = new Window_ScrollText();
		this.addWindow(this._scrollTextWindow);
	}

	updateTransferPlayer() {
		if ($gamePlayer.isTransferring()) {
			SceneManager.goto(Scene_Map);
		}
	}

	updateEncounter() {
		if ($gamePlayer.executeEncounter()) {
			SceneManager.push(Scene_Battle);
		}
	}

	updateCallMenu() {
		if (this.isMenuEnabled()) {
			if (this.isMenuCalled()) {
				this.menuCalling = true;
			}
			if (this.menuCalling && !$gamePlayer.isMoving()) {
				this.callMenu();
			}
		} else {
			this.menuCalling = false;
		}
	}

	isMenuEnabled() {
		return $gameSystem.isMenuEnabled() && !$gameMap.isEventRunning();
	}

	isMenuCalled() {
		return /* Input.isTriggered('menu') ||*/ TouchInput.isCancelled();
	}

	callMenu() {
		// メニュー表示機能
		SoundManager.playOk();
		SceneManager.push(Scene_Menu);
		Window_MenuCommand.initCommandPosition();
		$gameTemp.clearDestination();
		this._mapNameWindow.hide();
		this._waitCount = 2;
	}

	updateCallDebug() {
		if (this.isDebugCalled()) {
			SceneManager.push(Scene_Debug);
		}
	}

	isDebugCalled() {
		return /* Input.isTriggered('debug') &&*/ $gameTemp.isPlaytest();
	}

	fadeInForTransfer() {
		const fadeType = $gamePlayer.fadeType();
		switch (fadeType) {
			case 0:
			case 1:
				this.startFadeIn(this.fadeSpeed(), fadeType === 1);
				break;
		}
	}

	fadeOutForTransfer() {
		const fadeType = $gamePlayer.fadeType();
		switch (fadeType) {
			case 0:
			case 1:
				this.startFadeOut(this.fadeSpeed(), fadeType === 1);
				break;
		}
	}

	launchBattle() {
		BattleManager.saveBgmAndBgs();
		this.stopAudioOnBattleStart();
		SoundManager.playBattleStart();
		this.startEncounterEffect();
		this._mapNameWindow.hide();
	}

	stopAudioOnBattleStart() {
		if (!AudioManager.isCurrentBgm($gameSystem.battleBgm())) {
			AudioManager.stopBgm();
		}
		AudioManager.stopBgs();
		AudioManager.stopMe();
		AudioManager.stopSe();
	}

	startEncounterEffect() {
		this._spriteset.hideCharacters();
		this._encounterEffectDuration = this.encounterEffectSpeed();
	}

	updateEncounterEffect() {
		if (this._encounterEffectDuration > 0) {
			this._encounterEffectDuration--;
			const speed = this.encounterEffectSpeed();
			const n = speed - this._encounterEffectDuration;
			const p = n / speed;
			const q = ((p - 1) * 20 * p + 5) * p + 1;
			const zoomX = $gamePlayer.screenX();
			const zoomY = $gamePlayer.screenY() - 24;
			if (n === 2) {
				$gameScreen.setZoom(zoomX, zoomY, 1);
				this.snapForBattleBackground();
				this.startFlashForEncounter(speed / 2);
			}
			$gameScreen.setZoom(zoomX, zoomY, q);
			if (n === Math.floor(speed / 6)) {
				this.startFlashForEncounter(speed / 2);
			}
			if (n === Math.floor(speed / 2)) {
				BattleManager.playBattleBgm();
				this.startFadeOut(this.fadeSpeed());
			}
		}
	}

	snapForBattleBackground() {
		this._windowLayer.visible = false;
		SceneManager.snapForBackground();
		this._windowLayer.visible = true;
	}

	startFlashForEncounter(duration: number) {
		const color = [255, 255, 255, 255];
		$gameScreen.startFlash(color, duration);
	}

	encounterEffectSpeed() {
		return 60;
	}
}
