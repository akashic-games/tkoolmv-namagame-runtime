import { Bitmap } from "../core/Bitmap";
import { Graphics } from "../core/Graphics";
import { TouchInput } from "../core/TouchInput";
import { Utils } from "../core/Utils";
import type { Scene_Base } from "../scenes/SceneBase";
import { AudioManager } from "./AudioManager";
import { DataManager } from "./DataManager";
import * as GL from "./globals";
import { ImageManager } from "./ImageManager";
import { PluginManager } from "./PluginManager";

declare const console: any;

/**
 * ダウンロード済みのアセットを利用可能にする。
 *
 * @param targetScene アセットをロードしているシーン
 */
function assignAsset(targetScene: g.Scene) {
	// ダウンロード完了したデータを利用可能にする。
	// TODO v3 のアセットアクセッサ (g.game.scene().asset) を使うようにして、この代入をなくす。
	DataManager._requestedDataNames = DataManager._requestedDataNames.filter(pair => {
		// NOTE: ! グローバル変数に変数名でアクセスしている。
		// グローバル変数ではなくハッシュテーブル的なものにすべて収まっている形にしたほうが品が良いかも。
		// window[pair.name] = JSON.parse((pushedScene.assets[Utils.flatten(pair.src)] as g.TextAsset).data);
		// DataManager.onLoad(window[pair.name]);
		const anAsset = targetScene.assets[Utils.flatten(pair.src)];
		if (anAsset) {
			// TODO: グローバル変数に直接代入するのではなく、setter経由で値を渡すように
			(GL as any)[pair.name] = JSON.parse((anAsset as g.TextAsset).data);
			DataManager.onLoad((GL as any)[pair.name]);
		}
		return !anAsset;
	});
}

function createLoadingLocalScene(): g.Scene {
	const scene = new g.Scene({
		game: g.game,
		local: true,
		name: "loadingLocalScene",
		seethrough: true
	});
	scene.onLoad.add(() => {
		scene.onUpdate.add(() => {
			if (ImageManager.isReady()) {
				g.game.popScene();
			}
		});
	});
	return scene;
}

interface CustomLoadingSceneParameterObject extends g.SceneParameterObject {
	targetScene: g.Scene;
}

export class CustomLoadingScene extends g.Scene {
	private targetScene: g.Scene;
	private assetIds: Array<string | g.DynamicAssetConfiguration>;
	private bg: g.Sprite;

	constructor(param: CustomLoadingSceneParameterObject) {
		param.local = true;
		const assetIds = param.assetIds;
		param.assetIds = null;
		super(param);
		this.assetIds = assetIds;
		this.targetScene = param.targetScene;
		this.onLoad.handle(this, this._onLoaded);
	}

	_onLoaded(): boolean {
		this.append(g.SpriteFactory.createSpriteFromScene(this, this.targetScene));

		// すべて読み込みが終わるとcallbackが呼び出される模様。
		this.targetScene.requestAssets(this.assetIds, () => {
			this.assignAsset();
			g.game.popScene();
		});

		return true;
	}

	private assignAsset() {
		assignAsset(this.targetScene);
	}
}

// MEMO: このクラスは本当に必要か？
class SceneAssetHolder extends g.AssetHolder<g.SceneRequestAssetHandler> {
	_scene: g.Scene;
	callback: (asset: g.Asset, assetManager: g.AssetManager, holder: g.AssetHolder<g.SceneRequestAssetHandler>) => number;

	constructor(
		scene: g.Scene,
		callback?: (asset: g.Asset, assetManager: g.AssetManager, holder: g.AssetHolder<g.SceneRequestAssetHandler>) => number
	) {
		super({
			assetManager: scene._sceneAssetHolder._assetManager,
			assetIds: scene._sceneAssetHolder._assetIds,
			handlerSet: scene._sceneAssetHolder._handlerSet,
			userData: scene._sceneAssetHolder.userData
		});
		this._scene = scene;
		this.callback = callback;
	}

	_onAssetLoad(asset: g.Asset): void {
		const hs = this._handlerSet;
		if (this.destroyed() || hs.owner.destroyed()) return;

		this._scene.assets[asset.id] = asset;
		this._scene.onAssetLoad.fire(asset);
		this._scene.onAssetLoadComplete.fire(asset);

		hs.handleLoad.call(hs.owner, asset);
		this._assets.push(asset);

		if (this.callback) {
			this.waitingAssetsCount += this.callback(asset, this._assetManager, this);
		}
		--this.waitingAssetsCount;
		if (this.waitingAssetsCount > 0) return;
		if (this.waitingAssetsCount < 0)
			throw g.ExceptionFactory.createAssertionError("SceneAssetHolder#_onAssetLoad: broken waitingAssetsCount");

		hs.handleFinish.call(hs.owner, this, true);
	}
}

// ! シーンのコンストラクタを型定義する方法がわからない

// interface SceneConstructor {
// 	new(param: SceneBaseParameterObject): Scene_Base;
// }

// type SceneConstructor = (param: SceneBaseParameterObject) => Scene_Base;

// とりあえず
export type SceneConstructor = any;

export class SceneManager {
	static _scene: Scene_Base = null;
	static _nextScene: Scene_Base = null;
	static _stack: SceneConstructor[] = [];
	static _stopped: boolean = false;
	static _sceneStarted: boolean = false;
	static _exiting: boolean = false;
	static _previousClass: SceneConstructor = null;
	static _backgroundBitmap: Bitmap = null;
	static _screenWidth: number = g.game.width;
	static _screenHeight: number = g.game.height;
	static _boxWidth: number = g.game.width;
	static _boxHeight: number = g.game.height;
	static _deltaTime: number = 1.0 / 60.0;
	static _accumulator: number = 0.0;
	static _currentTime: number = Date.now(); // see below
	// if (!Utils.isMobileSafari()) SceneManager._currentTime = SceneManager._getTimeInMsWithoutMobileSafari();

	static _getTimeInMsWithoutMobileSafari() {
		// return performance.now();
		return Date.now();
	}

	static run(sceneClass: SceneConstructor) {
		try {
			this.initialize();
			this.goto(sceneClass);
			this.requestUpdate();
		} catch (e) {
			this.catchException(e);
		}
	}

	static initialize() {
		this.initGraphics();
		this.checkFileAccess();
		this.initAudio();
		this.initInput();
		this.initNwjs();
		this.checkPluginErrors();
		this.setupErrorHandlers();
	}

	static initGraphics() {
		const type = this.preferableRendererType();
		Graphics.initialize(this._screenWidth, this._screenHeight, type);
		Graphics.boxWidth = this._boxWidth;
		Graphics.boxHeight = this._boxHeight;
		Graphics.setLoadingImage("img/system/Loading.png");
		// if (Utils.isOptionValid("showfps")) {
		// 	Graphics.showFps();
		// }
		// if (type === "webgl") {
		// 	this.checkWebGL();
		// }
	}

	static preferableRendererType(): string {
		// if (Utils.isOptionValid("canvas")) {
		// 	return "canvas";
		// } else if (Utils.isOptionValid("webgl")) {
		// 	return "webgl";
		// } else {
		// 	return "auto";
		// }

		return "auto";
	}

	static shouldUseCanvasRenderer(): boolean {
		// return Utils.isMobileDevice();
		return true;
	}

	static checkWebGL() {
		// if (!Graphics.hasWebGL()) {
		// 	throw new Error("Your browser does not support WebGL.");
		// }
	}

	static checkFileAccess() {
		// if (!Utils.canReadGameFiles()) {
		// 	throw new Error("Your browser does not allow to read local files.");
		// }
	}

	static initAudio() {
		// const noAudio = Utils.isOptionValid("noaudio");
		// if (!WebAudio.initialize(noAudio) && !noAudio) {
		// 	throw new Error("Your browser does not support Web Audio API.");
		// }
	}

	static initInput() {
		// Input.initialize();
		TouchInput.initialize();
	}

	static initNwjs() {
		// if (Utils.isNwjs()) {
		// 	const gui = require("nw.gui");
		// 	const win = gui.Window.get();
		// 	if (process.platform === "darwin" && !win.menu) {
		// 		const menubar = new gui.Menu({ type: "menubar" });
		// 		const option = { hideEdit: true, hideWindow: true };
		// 		menubar.createMacBuiltin("Game", option);
		// 		win.menu = menubar;
		// 	}
		// }
	}

	static checkPluginErrors() {
		PluginManager.checkErrors();
	}

	static setupErrorHandlers() {
		// (window as any).addEventListener("error", this.onError.bind(this));
		// (document as any).addEventListener("keydown", this.onKeyDown.bind(this));
	}

	static requestUpdate() {
		// if (!this._stopped) {
		// 	requestAnimationFrame(this.update.bind(this));
		// }
	}

	static update() {
		try {
			if (!ImageManager.isReady()) {
				g.game.pushScene(createLoadingLocalScene());
				return;
			}
			this.tickStart();
			// if (Utils.isMobileSafari()) {
			// 	this.updateInputData();
			// }
			this.updateManagers();
			this.updateMain();
			this.tickEnd();
		} catch (e) {
			this.catchException(e);
		}
	}

	static terminate() {
		// window.close();
	}

	static onError(e: any) {
		console.error(e.message);
		console.error(e.filename, e.lineno);
		try {
			this.stop();
			// Graphics.printError("Error", e.message);
			AudioManager.stopAll();
		} catch (e2) {
			//
		}
	}

	static onKeyDown(_event: any) {
		// if (!event.ctrlKey && !event.altKey) {
		// 	switch (event.keyCode) {
		// 		case 116:   // F5
		// 			if (Utils.isNwjs()) {
		// 				location.reload();
		// 			}
		// 			break;
		// 		case 119:   // F8
		// 			if (Utils.isNwjs() && Utils.isOptionValid("test")) {
		// 				require("nw.gui").Window.get().showDevTools();
		// 			}
		// 			break;
		// 	}
		// }
	}

	static catchException(e: any) {
		console.error("ScneManager#catchException(): " + e);
		if (e instanceof Error) {
			// Graphics.printError(e.name, e.message);
			console.error(e.stack);
		} else {
			// Graphics.printError("UnknownError", e);
		}
		AudioManager.stopAll();
		this.stop();
	}

	static tickStart() {
		Graphics.tickStart();
	}

	static tickEnd() {
		Graphics.tickEnd();
	}

	static updateInputData() {
		// Input.update();
		TouchInput.update();
	}

	static updateMain() {
		if (/* Utils.isMobileSafari()*/ false) {
			// this.changeScene();
			// this.updateScene();
		} else {
			// const newTime = this._getTimeInMsWithoutMobileSafari();
			// let fTime = (newTime - this._currentTime) / 1000;
			// if (fTime > 0.25) fTime = 0.25;
			// this._currentTime = newTime;
			// this._accumulator += fTime;
			// while (this._accumulator >= this._deltaTime) {
			// 	this.updateInputData();
			// 	this.changeScene();
			// 	this.updateScene();
			// 	this._accumulator -= this._deltaTime;
			// }
			this.updateInputData();
			this.changeScene();
			this.updateScene();
		}
		this.renderScene();
		// this.requestUpdate();
	}

	static updateManagers() {
		ImageManager.update();
	}

	static changeScene() {
		if (this.isSceneChanging() && !this.isCurrentSceneBusy()) {
			if (this._scene) {
				this._scene.terminate();
				this._scene.detachReservation();
				this._previousClass = this._scene.constructor;
			}
			this._scene = this._nextScene;
			if (this._scene) {
				this._scene.attachReservation();
				this._scene.create();
				this._nextScene = null;
				this._sceneStarted = false;
				this.onSceneCreate();

				this._changeSceneCore();

				TouchInput._setupEventHandlers(this._scene.scene);
			}
			if (this._exiting) {
				this.terminate();
			}
		}
	}

	// シーン切り替えでAkashicを利用する部分
	static _changeSceneCore() {
		// Base_Scene#create() でリクエストされたデータの一覧を
		// g.Scene#_sceneAssetHolder に無理やりねじ込む
		DataManager._requestedDataNames.forEach(pair => {
			const src = Utils.flatten(pair.src);
			this._scene.scene._sceneAssetHolder._assetIds.push(src);
		});

		this._scene.scene._sceneAssetHolder.waitingAssetsCount = this._scene.scene._sceneAssetHolder._assetIds.length;

		// ロード完了時、各種アセットを Bitmap や DataManager に格納する。
		const mvScene = this._scene;
		const akashicScene = this._scene.scene;
		akashicScene.onLoad.addOnce(() => {
			// SceneManager に利用可能になったことを伝える
			mvScene.thisSceneLoaded = true;

			const updateSceneManager = () => {
				SceneManager.update();
				akashicScene.modified();
			};

			akashicScene.onUpdate.add(updateSceneManager);

			// 一度実行しないと未初期化のシーンが１フレームレンダリングされてしまう。
			updateSceneManager();
		});
		g.game.pushScene(akashicScene);
	}

	static updateScene() {
		if (this._scene && this._scene.thisSceneLoaded) {
			if (!this._sceneStarted && this._scene.isReady()) {
				this._scene.start();
				this._sceneStarted = true;
				this.onSceneStart();
			}

			if (this.isCurrentSceneStarted()) {
				this._scene.update();
			}

			const assetIds: any[] = [];
			DataManager._requestedDataNames.forEach(pair => {
				const src = Utils.flatten(pair.src);
				assetIds.push(src);
			});

			if (assetIds.length) {
				const loadingScene = new CustomLoadingScene({
					game: g.game,
					targetScene: this._scene.scene,
					assetIds: assetIds
				});
				g.game.pushScene(loadingScene);
			}
		}
	}

	static renderScene() {
		if (this.isCurrentSceneStarted()) {
			Graphics.render(this._scene);
		} else if (this._scene) {
			this.onSceneLoading();
		}
	}

	static onSceneCreate() {
		Graphics.startLoading();
	}

	static onSceneStart() {
		Graphics.endLoading();
	}

	static onSceneLoading() {
		Graphics.updateLoading();
	}

	static isSceneChanging() {
		return this._exiting || !!this._nextScene;
	}

	static isCurrentSceneBusy() {
		return this._scene && this._scene.isBusy();
	}

	static isCurrentSceneStarted() {
		return this._scene && this._sceneStarted;
	}

	static isNextScene(sceneClass: SceneConstructor) {
		return this._nextScene && this._nextScene.constructor === sceneClass;
	}

	static isPreviousScene(sceneClass: SceneConstructor) {
		return this._previousClass === sceneClass;
	}

	static goto(sceneClass: SceneConstructor) {
		if (sceneClass) {
			this._nextScene = new sceneClass();

			const nextScene = this._nextScene;

			nextScene.scene._sceneAssetHolder = new SceneAssetHolder(nextScene.scene, (asset, assetManager, holder) => {
				assignAsset(nextScene.scene);

				// 追加ダウンロードがあるかシーンに問い合わせる。
				// ダウンロードしたデータに基づいた判断が必要な場合、このように扱う。
				return nextScene.assetLoadHandler(asset, assetManager, holder);
			});
		}
		if (this._scene) {
			this._scene.stop();
		}
	}

	static push(sceneClass: SceneConstructor) {
		this._stack.push(this._scene.constructor);
		this.goto(sceneClass);
	}

	static pop() {
		if (this._stack.length > 0) {
			this.goto(this._stack.pop());
		} else {
			this.exit();
		}
	}

	static exit() {
		this.goto(null);
		this._exiting = true;
	}

	static clearStack() {
		this._stack = [];
	}

	static stop() {
		this._stopped = true;
	}

	static prepareNextScene(..._args: any[]) {
		// `prepare()` を実装したシーンがpushされたあとに呼ばれる模様
		(this._nextScene as any).prepare.apply(this._nextScene, arguments);
	}

	static snap(): Bitmap {
		return Bitmap.snap(this._scene.scene);
	}

	static snapForBackground() {
		this._backgroundBitmap = this.snap();
		this._backgroundBitmap.blur();
	}

	static backgroundBitmap() {
		return this._backgroundBitmap;
	}

	static resume() {
		this._stopped = false;
		this.requestUpdate();
		// if (!Utils.isMobileSafari()) {
		// 	this._currentTime = this._getTimeInMsWithoutMobileSafari();
		// 	this._accumulator = 0;
		// }
	}
}
