import {
	Window_Base,
	Scene_Title,
	Game_Variables,
	Game_Timer,
	Game_Interpreter,
	Scene_Map,
	Window_MenuCommand,
	PluginManager,
	AudioManager,
	$gameVariables,
	$gameTimer
} from "../index";

// =============================================================================
// AkashicRankingMode.js
// =============================================================================

/* :
 * @plugindesc plugin for creating ranking-type nicolive games.
 * @author DWANGO Co., Ltd.
 *
 * @param scoreVariableNumber
 * @desc Variable number to use as SCORE.
 * @default 1
 *
 * @param totalTimeLimit
 * @desc Total game time limit. min:20, max:200.
 * @default 75
 *
 * @param titleTime
 * @desc Time to display title screen.
 * @default 5
 *
 * @param graceTime
 * @desc Waiting time after game ends.
 * @default 10
 *
 * @param prohibitMenu
 * @desc Whether to prohibit menu display during timer display. 1:yes 0:no.
 * @default 1
 *
 * @param showScore
 * @desc Whether to show current score. 1:yes 0:no.
 * @default 1
 *
 * @param scoreWidth
 * @desc Width of score display window.
 * @default 200
 *
 * @param scoreHeight
 * @desc Height of score display window.
 * @default 70
 *
 * @param scoreX
 * @desc X-coordinate of score display window.
 * @default 0
 *
 * @param scoreY
 * @desc Y-coordinate of score display window.
 * @default 0
 *
 * @param scoreUnit
 * @desc Unit of score.
 * @default pt
 *
 * @param musicVolume
 * @desc Overall volume of BGM and BGS. min: 0, max: 100.
 * @default 100
 *
 * @param soundVolume
 * @desc Overall volume of SE and ME. min: 0, max: 100.
 * @default 100
 *
 * @param forceNamagameTimer
 * @desc Whether to rewrite timer time limit. 1:yes 0:no.
 * @default 1
 *
 * Plugin Command
 *
 *  NAMAGAME_START_TIMER : Using the timer in the nicolive games environment.
 *
 * This plugin is essential when creating ranking-type nicolive games.
 */

/* :ja
 * @plugindesc ランキング形式のニコ生ゲームを作るためのプラグイン
 * @author 株式会社ドワンゴ
 *
 * @param scoreVariableNumber
 * @desc スコアとして使用する変数番号
 * @default 1
 *
 * @param totalTimeLimit
 * @desc ゲームの総制限時間。最小値:20、最大値:200
 * @default 75
 *
 * @param titleTime
 * @desc タイトル画面を表示する時間
 * @default 5
 *
 * @param graceTime
 * @desc ゲーム終了後待機時間
 * @default 10
 *
 * @param prohibitMenu
 * @desc タイマー表示中にメニュー表示を禁止するかどうか。1:禁止する、0:禁止しない
 * @default 1
 *
 * @param showScore
 * @desc 現在のスコアを表示するかどうか。1:表示する、0:表示しない
 * @default 1
 *
 * @param scoreWidth
 * @desc スコア表示ウィンドウの横幅
 * @default 200
 *
 * @param scoreHeight
 * @desc スコア表示ウィンドウの縦幅
 * @default 70
 *
 * @param scoreX
 * @desc スコア表示ウィンドウのx座標
 * @default 0
 *
 * @param scoreY
 * @desc スコア表示ウィンドウのy座標
 * @default 0
 *
 * @param scoreUnit
 * @desc スコアの単位
 * @default pt
 *
 * @param musicVolume
 * @desc BGM・BGSの全体音量。最小値:0、最大値:100
 * @default 100
 *
 * @param soundVolume
 * @desc SE・MEの全体音量。最小値:0、最大値:100
 * @default 100
 *
 * @param forceNamagameTimer
 * @desc タイマーの制限時間書き換えを行うかどうか。1:はい、0:いいえ
 * @default 1
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （引数の間は半角スペースで区切る）
 *
 *  NAMAGAME_START_TIMER : ニコ生ゲーム環境のタイマーを利用する。
 *
 * ランキング形式のニコ生ゲームを作る時にこのプラグインが必須です。
 */
((): void => {
	// パラメータ取得
	const parameters = PluginManager.parameters("AkashicRankingMode");
	const scoreVariableNumber = Number(parameters.scoreVariableNumber || 1);
	const totalTimeLimit =
		typeof g !== "undefined" && g.game.vars.totalTimeLimit ? g.game.vars.totalTimeLimit : Number(parameters.totalTimeLimit || 75);
	const titleTime = Number(parameters.titleTime || 5);
	const graceTime = Number(parameters.graceTime || 10);
	const prohibitMenu = Number(parameters.prohibitMenu || 1) !== 0;
	const showScore = Number(parameters.showScore || 1) !== 0;
	const scoreWidth = Number(parameters.scoreWidth || 200);
	const scoreHeight = Number(parameters.scoreHeight || 70);
	const scoreX = Number(parameters.scoreX || 0);
	const scoreY = Number(parameters.scoreY || 0);
	const scoreUnit = parameters.scoreUnit || "pt";
	const MAX_VOLUME = 100;
	const MIN_VOLUME = 0;
	const musicVolume = clamp(Number(parameters.musicVolume || MAX_VOLUME), MIN_VOLUME, MAX_VOLUME);
	const soundVolume = clamp(Number(parameters.soundVolume || MAX_VOLUME), MIN_VOLUME, MAX_VOLUME);
	const forceNamagameTimer = Number(parameters.forceNamagameTimer || 1) !== 0;

	function clamp(value: number, min: number, max: number): number {
		return Math.max(min, Math.min(max, value));
	}

	// ゲームスコア用のウィンドウを用意
	// 参考: Window_Gold クラス
	class Window_GameScore extends Window_Base {
		initialize(x: number, y: number) {
			super.initialize(x, y, scoreWidth, scoreHeight);
			this.refresh();
		}

		refresh() {
			const x = this.textPadding();
			const width = this.contents.width - this.textPadding() * 2;
			this.contents.clear();
			this.drawCurrencyValue($gameVariables.value(scoreVariableNumber), scoreUnit, x, 0, width);
		}

		open() {
			this.refresh();
			super.open();
		}
	}

	// スコア初期化
	if (typeof g !== "undefined") {
		g.game.vars.gameState = {
			score: 0
		};
	}

	// タイトル画面を自動的に飛ばす処理
	let _timerId: any | null = null;
	const _sceneTitleStart = Scene_Title.prototype.start;
	Scene_Title.prototype.start = function () {
		_sceneTitleStart.call(this);
		const scene = typeof g === "undefined" ? window : g.game.scene();
		_timerId = scene.setTimeout(() => {
			scene.clearTimeout(_timerId);
			_timerId = null;
			this.commandNewGame();
		}, titleTime * 1000);
	};

	// タイトルメニューを非表示にするための対応
	Scene_Title.prototype.isBusy = function () {
		return _timerId != null;
	};

	// スコアを反映させる処理
	const _gameVariablesSetValue = Game_Variables.prototype.setValue;
	Game_Variables.prototype.setValue = function (variableId: any, value: any) {
		_gameVariablesSetValue.call(this, variableId, value);
		if (variableId === scoreVariableNumber && typeof g !== "undefined") {
			g.game.vars.gameState.score = value;
		}
	};

	// ニコ生ゲーム用のタイマーのフレーム数を算出
	function calcTimerFrames(): number {
		let fps: number;
		if (typeof g === "undefined") {
			// RPGツクールでのfpsのデフォルト値は60
			fps = 60;
		} else {
			fps = g.game.fps;
		}
		const timeLimit = totalTimeLimit - titleTime - graceTime;
		return timeLimit * fps;
	}

	// タイマーの制限時間の書き換え
	if (forceNamagameTimer) {
		Game_Timer.prototype.start = function (_count: number) {
			this._frames = calcTimerFrames();
			this._working = true;
		};
	}

	// メニュー画面から「ゲーム終了」の項目を削除する
	Window_MenuCommand.prototype.addGameEndCommand = function () {
		// 「ゲーム終了」の項目をメニューにはいらないようにするため、このメソッドでは何も行わない
	};
	// prohibitMenuがONの場合、タイマー利用時はメニュー画面を利用禁止にする
	if (prohibitMenu) {
		const _sceneMapCallMenu = Scene_Map.prototype.callMenu;
		Scene_Map.prototype.callMenu = function () {
			if ($gameTimer && $gameTimer.isWorking()) {
				return;
			}
			_sceneMapCallMenu.call(this);
		};
		const _gameInterpretercommand351 = Game_Interpreter.prototype.command351;
		Game_Interpreter.prototype.command351 = function () {
			if ($gameTimer && $gameTimer.isWorking()) {
				return true;
			}
			return _gameInterpretercommand351.call(this);
		};
	}

	const _sceneMapCreateDisplayObjects = Scene_Map.prototype.createDisplayObjects;
	Scene_Map.prototype.createDisplayObjects = function () {
		const original = _sceneMapCreateDisplayObjects.call(this);
		this.gameScoreWindow = new Window_GameScore(scoreX, scoreY);
		if (showScore) {
			this.gameScoreWindow.open();
			this.addWindow(this.gameScoreWindow);
		}
		return original;
	};

	const _sceneMapUpdate = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function () {
		const original = _sceneMapUpdate.call(this);
		this.gameScoreWindow.refresh();
		return original;
	};

	// 全体の音量調整
	AudioManager.bgmVolume = musicVolume;
	AudioManager.bgsVolume = musicVolume;
	AudioManager.meVolume = soundVolume;
	AudioManager.seVolume = soundVolume;

	// プラグインコマンドを追加定義。
	const _gameInterpreterPluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function (command: any, _args: any): void {
		_gameInterpreterPluginCommand.apply(this, arguments);
		switch (command) {
			// ニコ生ゲーム環境のタイマーを利用する
			case "NAMAGAME_START_TIMER":
				const frames = calcTimerFrames();
				$gameTimer.start(frames);
				break;
			default:
				break;
		}
	};
})();
