import type { Bitmap } from "../core/Bitmap";
import { Graphics as Graphics_ } from "../core/Graphics";
import { JsonEx as JsonEx_ } from "../core/JsonEx";
import { Tilemap as Tilemap_ } from "../core/Tilemap";
import { TouchInput as TouchInput_ } from "../core/TouchInput";
import { Utils as Utils_ } from "../core/Utils";
import { AudioManager as AudioManager_ } from "../managers/AudioManager";
import { BattleManager as BattleManager_ } from "../managers/BattleManager";
import { DataManager as DataManager_ } from "../managers/DataManager";
import {
	$gameSystem as $gameSystem_,
	$gameSwitches as $gameSwitches_,
	$gameMessage as $gameMessage_,
	$gamePlayer as $gamePlayer_,
	$dataCommonEvents as $dataCommonEvents_,
	$gameVariables as $gameVariables_,
	$dataTilesets as $dataTilesets_,
	$gameMap as $gameMap_,
	$gameTemp as $gameTemp_,
	$dataEnemies as $dataEnemies_,
	$gameActors as $gameActors_,
	$dataAnimations as $dataAnimations_,
	$gameParty as $gameParty_,
	$gameTroop as $gameTroop_,
	$gameTimer as $gameTimer_,
	$gameSelfSwitches as $gameSelfSwitches_,
	$dataClasses as $dataClasses_,
	$dataWeapons as $dataWeapons_,
	$dataArmors as $dataArmors_,
	$dataItems as $dataItems_,
	$gameScreen as $gameScreen_,
	$dataTroops as $dataTroops_,
	$dataActors as $dataActors_,
	$dataSkills as $dataSkills_,
	$dataStates as $dataStates_,
	$dataSystem as $dataSystem_,
	$dataMapInfos as $dataMapInfos_,
	$dataMap as $dataMap_
} from "../managers/globals";
import { ImageManager as ImageManager_ } from "../managers/ImageManager";
import { SceneManager as SceneManager_ } from "../managers/SceneManager";
import { SoundManager as SoundManager_ } from "../managers/SoundManager";
import { TextManager as TextManager_ } from "../managers/TextManager";
import { Scene_Battle } from "../scenes/SceneBattle";
import { Scene_Gameover } from "../scenes/SceneGameOver";
import { Scene_Menu } from "../scenes/SceneMenu";
import { Scene_Shop } from "../scenes/SceneShop";
import { Scene_Title } from "../scenes/SceneTitle";
import { Window_MenuCommand } from "../windows/WindowMenuCommand";
import { Game_Character } from "./GameCharacter";

// これらの変数(GameObject)はツクールのスクリプトで利用される可能性があるため、exportせずクラスの外で変数定義
/* eslint-disable @typescript-eslint/no-unused-vars */
let $gameVariables: typeof $gameVariables_;
let $gameSystem: typeof $gameSystem_;
let $gameSwitches: typeof $gameSwitches_;
let $gameMessage: typeof $gameMessage_;
let $gamePlayer: typeof $gamePlayer_;
let $dataCommonEvents: typeof $dataCommonEvents_;
let $dataTilesets: typeof $dataTilesets_;
let $gameMap: typeof $gameMap_;
let $gameTemp: typeof $gameTemp_;
let $dataEnemies: typeof $dataEnemies_;
let $gameActors: typeof $gameActors_;
let $dataAnimations: typeof $dataAnimations_;
let $gameParty: typeof $gameParty_;
let $gameTroop: typeof $gameTroop_;
let $gameTimer: typeof $gameTimer_;
let $gameSelfSwitches: typeof $gameSelfSwitches_;
let $dataClasses: typeof $dataClasses_;
let $dataWeapons: typeof $dataWeapons_;
let $dataArmors: typeof $dataArmors_;
let $dataItems: typeof $dataItems_;
let $gameScreen: typeof $gameScreen_;
let $dataTroops: typeof $dataTroops_;
let $dataActors: typeof $dataActors_;
let $dataSkills: typeof $dataSkills_;
let $dataStates: typeof $dataStates_;
let $dataSystem: typeof $dataSystem_;
let $dataMapInfos: typeof $dataMapInfos_;
let $dataMap: typeof $dataMap_;
// これらの変数はツクールのスクリプトでグローバルなクラス名として利用される想定なので、変数の命名規則からは例外的に外すものとする
/* eslint-disable  @typescript-eslint/naming-convention */
let Graphics: typeof Graphics_;
let JsonEx: typeof JsonEx_;
let Tilemap: typeof Tilemap_;
let TouchInput: typeof TouchInput_;
let Utils: typeof Utils_;
let AudioManager: typeof AudioManager_;
let BattleManager: typeof BattleManager_;
let DataManager: typeof DataManager_;
let ImageManager: typeof ImageManager_;
let SceneManager: typeof SceneManager_;
let SoundManager: typeof SoundManager_;
let TextManager: typeof TextManager_;
/* eslint-enable @typescript-eslint/naming-convention */
/* eslint-enable @typescript-eslint/no-unused-vars */

// 未定義の全GameObjectに値を代入
function setGameObjects() {
	$gameVariables = $gameVariables_;
	$gameSystem = $gameSystem_;
	$gameSwitches = $gameSwitches_;
	$gameMessage = $gameMessage_;
	$gamePlayer = $gamePlayer_;
	$dataCommonEvents = $dataCommonEvents_;
	$dataTilesets = $dataTilesets_;
	$gameMap = $gameMap_;
	$gameTemp = $gameTemp_;
	$dataEnemies = $dataEnemies_;
	$gameActors = $gameActors_;
	$dataAnimations = $dataAnimations_;
	$gameParty = $gameParty_;
	$gameTroop = $gameTroop_;
	$gameTimer = $gameTimer_;
	$gameSelfSwitches = $gameSelfSwitches_;
	$dataClasses = $dataClasses_;
	$dataWeapons = $dataWeapons_;
	$dataArmors = $dataArmors_;
	$dataItems = $dataItems_;
	$gameScreen = $gameScreen_;
	$dataTroops = $dataTroops_;
	$dataActors = $dataActors_;
	$dataSkills = $dataSkills_;
	$dataStates = $dataStates_;
	$dataSystem = $dataSystem_;
	$dataMapInfos = $dataMapInfos_;
	$dataMap = $dataMap_;
	Graphics = Graphics_;
	JsonEx = JsonEx_;
	Tilemap = Tilemap_;
	TouchInput = TouchInput_;
	Utils = Utils_;
	AudioManager = AudioManager_;
	BattleManager = BattleManager_;
	DataManager = DataManager_;
	ImageManager = ImageManager_;
	SceneManager = SceneManager_;
	SoundManager = SoundManager_;
	TextManager = TextManager_;
}

// スクリプト(eval)で利用するグローバル変数の初期化を可能にする
if (!DataManager_._onReset.contains(setGameObjects)) {
	DataManager_._onReset.add(setGameObjects);
}

export class Game_Interpreter {
	private _depth: number;
	private _branch: any;
	private _params: any[];
	private _indent: number;
	private _frameCount: number;
	private _freezeChecker: number;
	private _mapId: number;
	private _eventId: number;
	private _list: any[];
	private _index: number;
	private _waitCount: number;
	private _waitMode: string;
	private _comments: string | any[];
	private _character: any;
	private _childInterpreter: Game_Interpreter;
	private _imageReservationId: number;

	static requestImages(list: any[], commonList?: any[]) {
		if (!list) return;

		list.forEach(command => {
			const params = command.parameters;
			switch (command.code) {
				// Show Text
				case 101:
					ImageManager_.requestFace(params[0]);
					break;

				// Common Event
				case 117:
					const commonEvent = $dataCommonEvents_[params[0]];
					if (commonEvent) {
						if (!commonList) {
							commonList = [];
						}
						if (!Utils_.contains(commonList, params[0])) {
							commonList.push(params[0]);
							Game_Interpreter.requestImages(commonEvent.list, commonList);
						}
					}
					break;

				// Change Party Member
				case 129:
					const actor = $gameActors_.actor(params[0]);
					if (actor && params[1] === 0) {
						const name = actor.characterName();
						ImageManager_.requestCharacter(name);
					}
					break;

				// Set Movement Route
				case 205:
					if (params[1]) {
						params[1].list.forEach((command: any) => {
							const params = command.parameters;
							if (command.code === Game_Character.ROUTE_CHANGE_IMAGE) {
								ImageManager_.requestCharacter(params[0]);
							}
						});
					}
					break;

				// Show Animation, Show Battle Animation
				case 212:
				case 337:
					if (params[1]) {
						const animation = $dataAnimations_[params[1]];
						const name1 = animation.animation1Name;
						const name2 = animation.animation2Name;
						const hue1 = animation.animation1Hue;
						const hue2 = animation.animation2Hue;
						ImageManager_.requestAnimation(name1, hue1);
						ImageManager_.requestAnimation(name2, hue2);
					}
					break;

				// Change Player Followers
				case 216:
					if (params[0] === 0) {
						$gamePlayer_.followers().forEach(follower => {
							const name = follower.characterName();
							ImageManager_.requestCharacter(name);
						});
					}
					break;

				// Show Picture
				case 231:
					ImageManager_.requestPicture(params[1]);
					break;

				// Change Tileset
				case 282:
					const tileset = $dataTilesets_[params[0]];
					tileset.tilesetNames.forEach((tilesetName: string) => {
						ImageManager_.requestTileset(tilesetName);
					});
					break;

				// Change Battle Back
				case 283:
					if ($gameParty_.inBattle()) {
						ImageManager_.requestBattleback1(params[0]);
						ImageManager_.requestBattleback2(params[1]);
					}
					break;

				// Change Parallax
				case 284:
					if (!$gameParty_.inBattle()) {
						ImageManager_.requestParallax(params[0]);
					}
					break;

				// Change Actor Images
				case 322:
					ImageManager_.requestCharacter(params[1]);
					ImageManager_.requestFace(params[3]);
					ImageManager_.requestSvActor(params[5]);
					break;

				// Change Vehicle Image
				case 323:
					const vehicle = $gameMap_.vehicle(params[0]);
					if (vehicle) {
						ImageManager_.requestCharacter(params[1]);
					}
					break;

				// Enemy Transform
				case 336:
					const enemy = $dataEnemies_[params[1]];
					const name = enemy.battlerName;
					const hue = enemy.battlerHue;
					if ($gameSystem_.isSideView()) {
						ImageManager_.requestSvEnemy(name, hue);
					} else {
						ImageManager_.requestEnemy(name, hue);
					}
					break;
			}
		});
	}

	constructor(depth?: number) {
		this.initialize(depth);
	}

	initialize(depth: number) {
		this._depth = depth || 0;
		this.checkOverflow();
		this.clear();
		this._branch = {};
		this._params = [];
		this._indent = 0;
		this._frameCount = 0;
		this._freezeChecker = 0;
	}

	checkOverflow() {
		if (this._depth >= 100) {
			throw new Error("Common event calls exceeded the limit");
		}
	}

	clear() {
		this._mapId = 0;
		this._eventId = 0;
		this._list = null;
		this._index = 0;
		this._waitCount = 0;
		this._waitMode = "";
		this._comments = "";
		this._character = null;
		this._childInterpreter = null;
	}

	setup(list: any[], eventId?: number) {
		this.clear();
		this._mapId = $gameMap_.mapId();
		this._eventId = eventId || 0;
		this._list = list;
		Game_Interpreter.requestImages(list);
	}

	eventId() {
		return this._eventId;
	}

	isOnCurrentMap() {
		return this._mapId === $gameMap_.mapId();
	}

	setupReservedCommonEvent() {
		if ($gameTemp_.isCommonEventReserved()) {
			this.setup($gameTemp_.reservedCommonEvent().list);
			$gameTemp_.clearCommonEvent();
			return true;
		} else {
			return false;
		}
	}

	isRunning() {
		return !!this._list;
	}

	update() {
		while (this.isRunning()) {
			if (this.updateChild() || this.updateWait()) {
				break;
			}
			if (SceneManager_.isSceneChanging()) {
				break;
			}
			if (!this.executeCommand()) {
				break;
			}
			if (this.checkFreeze()) {
				break;
			}
		}
	}

	updateChild() {
		if (this._childInterpreter) {
			this._childInterpreter.update();
			if (this._childInterpreter.isRunning()) {
				return true;
			} else {
				this._childInterpreter = null;
			}
		}
		return false;
	}

	updateWait() {
		return this.updateWaitCount() || this.updateWaitMode();
	}

	updateWaitCount() {
		if (this._waitCount > 0) {
			this._waitCount--;
			return true;
		}
		return false;
	}

	updateWaitMode() {
		let waiting = false;
		switch (this._waitMode) {
			case "message":
				waiting = $gameMessage_.isBusy();
				break;
			case "transfer":
				waiting = $gamePlayer_.isTransferring();
				break;
			case "scroll":
				waiting = $gameMap_.isScrolling();
				break;
			case "route":
				waiting = this._character.isMoveRouteForcing();
				break;
			case "animation":
				waiting = this._character.isAnimationPlaying();
				break;
			case "balloon":
				waiting = this._character.isBalloonPlaying();
				break;
			case "gather":
				waiting = $gamePlayer_.areFollowersGathering();
				break;
			case "action":
				waiting = BattleManager_.isActionForced();
				break;
			case "video":
				waiting = Graphics_.isVideoPlaying();
				break;
			case "image":
				waiting = !ImageManager_.isReady();
				break;
		}
		if (!waiting) {
			this._waitMode = "";
		}
		return waiting;
	}

	setWaitMode(waitMode: string) {
		this._waitMode = waitMode;
	}

	wait(duration: number) {
		this._waitCount = duration;
	}

	fadeSpeed() {
		return 24;
	}

	executeCommand() {
		const command = this.currentCommand();
		if (command) {
			this._params = command.parameters;
			this._indent = command.indent;
			const methodName = "command" + command.code;
			if (typeof (this as any)[methodName] === "function") {
				if (!(this as any)[methodName]()) {
					return false;
				}
			}
			this._index++;
		} else {
			this.terminate();
		}
		return true;
	}

	checkFreeze() {
		if (this._frameCount !== Graphics_.frameCount) {
			this._frameCount = Graphics_.frameCount;
			this._freezeChecker = 0;
		}
		if (this._freezeChecker++ >= 100000) {
			return true;
		} else {
			return false;
		}
	}

	terminate() {
		this._list = null;
		this._comments = "";
	}

	skipBranch() {
		while (this._list[this._index + 1].indent > this._indent) {
			this._index++;
		}
	}

	currentCommand() {
		return this._list[this._index];
	}

	nextEventCode() {
		const command = this._list[this._index + 1];
		if (command) {
			return command.code;
		} else {
			return 0;
		}
	}

	iterateActorId(param: any, callback: (actor: any) => void) {
		if (param === 0) {
			$gameParty_.members().forEach(callback);
		} else {
			const actor = $gameActors_.actor(param);
			if (actor) {
				callback(actor);
			}
		}
	}

	iterateActorEx(param1: number, param2: number, callback: (actor: any) => void) {
		if (param1 === 0) {
			this.iterateActorId(param2, callback);
		} else {
			this.iterateActorId($gameVariables_.value(param2), callback);
		}
	}

	iterateActorIndex(param: number, callback: (actor: any) => void) {
		if (param < 0) {
			$gameParty_.members().forEach(callback);
		} else {
			const actor = $gameParty_.members()[param];
			if (actor) {
				callback(actor);
			}
		}
	}

	iterateEnemyIndex(param: number, callback: (actor: any) => void) {
		if (param < 0) {
			$gameTroop_.members().forEach(callback);
		} else {
			const enemy = $gameTroop_.members()[param];
			if (enemy) {
				callback(enemy);
			}
		}
	}

	iterateBattler(param1: number, param2: number, callback: (actor: any) => void) {
		if ($gameParty_.inBattle()) {
			if (param1 === 0) {
				this.iterateEnemyIndex(param2, callback);
			} else {
				this.iterateActorId(param2, callback);
			}
		}
	}

	character(param: number) {
		if ($gameParty_.inBattle()) {
			return null;
		} else if (param < 0) {
			return $gamePlayer_;
		} else if (this.isOnCurrentMap()) {
			return $gameMap_.event(param > 0 ? param : this._eventId);
		} else {
			return null;
		}
	}

	operateValue(operation: number, operandType: number, operand: number) {
		const value = operandType === 0 ? operand : $gameVariables_.value(operand);
		return operation === 0 ? value : -value;
	}

	changeHp(target: any, value: number, allowDeath: boolean) {
		if (target.isAlive()) {
			if (!allowDeath && target.hp <= -value) {
				value = 1 - target.hp;
			}
			target.gainHp(value);
			if (target.isDead()) {
				target.performCollapse();
			}
		}
	}

	// Show Text
	command101() {
		if (!$gameMessage_.isBusy()) {
			$gameMessage_.setFaceImage(this._params[0], this._params[1]);
			$gameMessage_.setBackground(this._params[2]);
			$gameMessage_.setPositionType(this._params[3]);
			while (this.nextEventCode() === 401) {
				// Text data
				this._index++;
				$gameMessage_.add(this.currentCommand().parameters[0]);
			}
			switch (this.nextEventCode()) {
				case 102: // Show Choices
					this._index++;
					this.setupChoices(this.currentCommand().parameters);
					break;
				case 103: // Input Number
					this._index++;
					this.setupNumInput(this.currentCommand().parameters);
					break;
				case 104: // Select Item
					this._index++;
					this.setupItemChoice(this.currentCommand().parameters);
					break;
			}
			this._index++;
			this.setWaitMode("message");
		}
		return false;
	}

	// Show Choices
	command102() {
		if (!$gameMessage_.isBusy()) {
			this.setupChoices(this._params);
			this._index++;
			this.setWaitMode("message");
		}
		return false;
	}

	setupChoices(params: any[]) {
		const choices = [...params[0]];
		let cancelType = params[1];
		const defaultType = params.length > 2 ? params[2] : 0;
		const positionType = params.length > 3 ? params[3] : 2;
		const background = params.length > 4 ? params[4] : 0;
		if (cancelType >= choices.length) {
			cancelType = -2;
		}
		$gameMessage_.setChoices(choices, defaultType, cancelType);
		$gameMessage_.setChoiceBackground(background);
		$gameMessage_.setChoicePositionType(positionType);
		$gameMessage_.setChoiceCallback((n: any) => {
			this._branch[this._indent] = n;
		});
	}

	// When [**]
	command402() {
		if (this._branch[this._indent] !== this._params[0]) {
			this.skipBranch();
		}
		return true;
	}

	// When Cancel
	command403() {
		if (this._branch[this._indent] >= 0) {
			this.skipBranch();
		}
		return true;
	}

	// Input Number
	command103() {
		if (!$gameMessage_.isBusy()) {
			this.setupNumInput(this._params);
			this._index++;
			this.setWaitMode("message");
		}
		return false;
	}

	setupNumInput(params: any[]) {
		$gameMessage_.setNumberInput(params[0], params[1]);
	}

	// Select Item
	command104() {
		if (!$gameMessage_.isBusy()) {
			this.setupItemChoice(this._params);
			this._index++;
			this.setWaitMode("message");
		}
		return false;
	}

	setupItemChoice(params: any[]) {
		$gameMessage_.setItemChoice(params[0], params[1] || 2);
	}

	// Show Scrolling Text
	command105() {
		if (!$gameMessage_.isBusy()) {
			$gameMessage_.setScroll(this._params[0], this._params[1]);
			while (this.nextEventCode() === 405) {
				this._index++;
				$gameMessage_.add(this.currentCommand().parameters[0]);
			}
			this._index++;
			this.setWaitMode("message");
		}
		return false;
	}

	// Comment
	command108() {
		this._comments = [this._params[0]];
		while (this.nextEventCode() === 408) {
			this._index++;
			this._comments.push(this.currentCommand().parameters[0]);
		}
		return true;
	}

	// Conditional Branch
	command111() {
		let result = false;
		switch (this._params[0]) {
			case 0: // Switch
				result = $gameSwitches_.value(this._params[1]) === (this._params[2] === 0);
				break;
			case 1: // Variable
				const value1 = $gameVariables_.value(this._params[1]);
				let value2;
				if (this._params[2] === 0) {
					value2 = this._params[3];
				} else {
					value2 = $gameVariables_.value(this._params[3]);
				}
				switch (this._params[4]) {
					case 0: // Equal to
						result = value1 === value2;
						break;
					case 1: // Greater than or Equal to
						result = value1 >= value2;
						break;
					case 2: // Less than or Equal to
						result = value1 <= value2;
						break;
					case 3: // Greater than
						result = value1 > value2;
						break;
					case 4: // Less than
						result = value1 < value2;
						break;
					case 5: // Not Equal to
						result = value1 !== value2;
						break;
				}
				break;
			case 2: // Self Switch
				if (this._eventId > 0) {
					const key = [this._mapId, this._eventId, this._params[1]];
					result = $gameSelfSwitches_.value(key) === (this._params[2] === 0);
				}
				break;
			case 3: // Timer
				if ($gameTimer_.isWorking()) {
					if (this._params[2] === 0) {
						result = $gameTimer_.seconds() >= this._params[1];
					} else {
						result = $gameTimer_.seconds() <= this._params[1];
					}
				}
				break;
			case 4: // Actor
				const actor = $gameActors_.actor(this._params[1]);
				if (actor) {
					const n = this._params[3];
					switch (this._params[2]) {
						case 0: // In the Party
							result = Utils_.contains($gameParty_.members(), actor);
							break;
						case 1: // Name
							result = actor.name() === n;
							break;
						case 2: // Class
							result = actor.isClass($dataClasses_[n]);
							break;
						case 3: // Skill
							result = actor.hasSkill(n);
							break;
						case 4: // Weapon
							result = actor.hasWeapon($dataWeapons_[n]);
							break;
						case 5: // Armor
							result = actor.hasArmor($dataArmors_[n]);
							break;
						case 6: // State
							result = actor.isStateAffected(n);
							break;
					}
				}
				break;
			case 5: // Enemy
				const enemy = $gameTroop_.members()[this._params[1]];
				if (enemy) {
					switch (this._params[2]) {
						case 0: // Appeared
							result = enemy.isAlive();
							break;
						case 1: // State
							result = enemy.isStateAffected(this._params[3]);
							break;
					}
				}
				break;
			case 6: // Character
				const character = this.character(this._params[1]);
				if (character) {
					result = character.direction() === this._params[2];
				}
				break;
			case 7: // Gold
				switch (this._params[2]) {
					case 0: // Greater than or equal to
						result = $gameParty_.gold() >= this._params[1];
						break;
					case 1: // Less than or equal to
						result = $gameParty_.gold() <= this._params[1];
						break;
					case 2: // Less than
						result = $gameParty_.gold() < this._params[1];
						break;
				}
				break;
			case 8: // Item
				result = $gameParty_.hasItem($dataItems_[this._params[1]]);
				break;
			case 9: // Weapon
				result = $gameParty_.hasItem($dataWeapons_[this._params[1]], this._params[2]);
				break;
			case 10: // Armor
				result = $gameParty_.hasItem($dataArmors_[this._params[1]], this._params[2]);
				break;
			case 11: // Button
				// result = Input.isPressed(this._params[1]);
				result = false; // TODO: impl
				break;
			case 12: // Script
				// eslint-disable-next-line no-eval
				result = !!eval(this._params[1]);
				break;
			case 13: // Vehicle
				result = $gamePlayer_.vehicle() === $gameMap_.vehicle(this._params[1]);
				break;
		}
		this._branch[this._indent] = result;
		if (this._branch[this._indent] === false) {
			this.skipBranch();
		}
		return true;
	}

	// Else
	command411() {
		if (this._branch[this._indent] !== false) {
			this.skipBranch();
		}
		return true;
	}

	// Loop
	command112() {
		return true;
	}

	// Repeat Above
	command413() {
		do {
			this._index--;
		} while (this.currentCommand().indent !== this._indent);
		return true;
	}

	// Break Loop
	command113() {
		let depth = 0;
		while (this._index < this._list.length - 1) {
			this._index++;
			const command = this.currentCommand();

			if (command.code === 112) depth++;

			if (command.code === 413) {
				if (depth > 0) depth--;
				else break;
			}
		}
		return true;
	}

	// Exit Event Processing
	command115() {
		this._index = this._list.length;
		return true;
	}

	// Common Event
	command117() {
		const commonEvent = $dataCommonEvents_[this._params[0]];
		if (commonEvent) {
			const eventId = this.isOnCurrentMap() ? this._eventId : 0;
			this.setupChild(commonEvent.list, eventId);
		}
		return true;
	}

	setupChild(list: any[], eventId?: number) {
		this._childInterpreter = new Game_Interpreter(this._depth + 1);
		this._childInterpreter.setup(list, eventId);
	}

	// Label
	command118() {
		return true;
	}

	// Jump to Label
	command119() {
		const labelName = this._params[0];
		for (let i = 0; i < this._list.length; i++) {
			const command = this._list[i];
			if (command.code === 118 && command.parameters[0] === labelName) {
				this.jumpTo(i);
				return;
			}
		}
		return true;
	}

	jumpTo(index: number) {
		const lastIndex = this._index;
		const startIndex = Math.min(index, lastIndex);
		const endIndex = Math.max(index, lastIndex);
		let indent = this._indent;
		for (let i = startIndex; i <= endIndex; i++) {
			const newIndent = this._list[i].indent;
			if (newIndent !== indent) {
				this._branch[indent] = null;
				indent = newIndent;
			}
		}
		this._index = index;
	}

	// Control Switches
	command121() {
		for (let i = this._params[0]; i <= this._params[1]; i++) {
			$gameSwitches_.setValue(i, this._params[2] === 0);
		}
		return true;
	}

	// Control Variables
	command122() {
		let value = 0;
		switch (
			this._params[3] // Operand
		) {
			case 0: // Constant
				value = this._params[4];
				break;
			case 1: // Variable
				value = $gameVariables_.value(this._params[4]);
				break;
			case 2: // Random
				value = this._params[5] - this._params[4] + 1;
				for (let i = this._params[0]; i <= this._params[1]; i++) {
					this.operateVariable(i, this._params[2], this._params[4] + Utils_.randomInt(value));
				}
				return true;
			// break; // Unreachable code detected.
			case 3: // Game Data
				value = this.gameDataOperand(this._params[4], this._params[5], this._params[6]);
				break;
			case 4: // Script
				// eslint-disable-next-line no-eval
				value = eval(this._params[4]);
				break;
		}
		for (let i = this._params[0]; i <= this._params[1]; i++) {
			this.operateVariable(i, this._params[2], value);
		}
		return true;
	}

	gameDataOperand(type: number, param1: number, param2: number) {
		switch (type) {
			case 0: // Item
				return $gameParty_.numItems($dataItems_[param1]);
			case 1: // Weapon
				return $gameParty_.numItems($dataWeapons_[param1]);
			case 2: // Armor
				return $gameParty_.numItems($dataArmors_[param1]);
			case 3: // Actor
				let actor = $gameActors_.actor(param1);
				if (actor) {
					switch (param2) {
						case 0: // Level
							return actor.level;
						case 1: // EXP
							return actor.currentExp();
						case 2: // HP
							return actor.hp;
						case 3: // MP
							return actor.mp;
						default: // Parameter
							if (param2 >= 4 && param2 <= 11) {
								return actor.param(param2 - 4);
							}
					}
				}
				break;
			case 4: // Enemy
				const enemy = $gameTroop_.members()[param1];
				if (enemy) {
					switch (param2) {
						case 0: // HP
							return enemy.hp;
						case 1: // MP
							return enemy.mp;
						default: // Parameter
							if (param2 >= 2 && param2 <= 9) {
								return enemy.param(param2 - 2);
							}
					}
				}
				break;
			case 5: // Character
				const character = this.character(param1);
				if (character) {
					switch (param2) {
						case 0: // Map X
							return character.x;
						case 1: // Map Y
							return character.y;
						case 2: // Direction
							return character.direction();
						case 3: // Screen X
							return character.screenX();
						case 4: // Screen Y
							return character.screenY();
					}
				}
				break;
			case 6: // Party
				actor = $gameParty_.members()[param1];
				return actor ? actor.actorId() : 0;
			case 7: // Other
				switch (param1) {
					case 0: // Map ID
						return $gameMap_.mapId();
					case 1: // Party Members
						return $gameParty_.size();
					case 2: // Gold
						return $gameParty_.gold();
					case 3: // Steps
						return $gameParty_.steps();
					case 4: // Play Time
						return $gameSystem_.playtime();
					case 5: // Timer
						return $gameTimer_.seconds();
					case 6: // Save Count
						return $gameSystem_.saveCount();
					case 7: // Battle Count
						return $gameSystem_.battleCount();
					case 8: // Win Count
						return $gameSystem_.winCount();
					case 9: // Escape Count
						return $gameSystem_.escapeCount();
				}
				break;
		}
		return 0;
	}

	operateVariable(variableId: number, operationType: number, value: number) {
		try {
			let oldValue = $gameVariables_.value(variableId);
			switch (operationType) {
				case 0: // Set
					$gameVariables_.setValue(variableId, (oldValue = value));
					break;
				case 1: // Add
					$gameVariables_.setValue(variableId, oldValue + value);
					break;
				case 2: // Sub
					$gameVariables_.setValue(variableId, oldValue - value);
					break;
				case 3: // Mul
					$gameVariables_.setValue(variableId, oldValue * value);
					break;
				case 4: // Div
					$gameVariables_.setValue(variableId, oldValue / value);
					break;
				case 5: // Mod
					$gameVariables_.setValue(variableId, oldValue % value);
					break;
			}
		} catch (e) {
			$gameVariables_.setValue(variableId, 0);
		}
	}

	// Control Self Switch
	command123() {
		if (this._eventId > 0) {
			const key = [this._mapId, this._eventId, this._params[0]];
			$gameSelfSwitches_.setValue(key, this._params[1] === 0);
		}
		return true;
	}

	// Control Timer
	command124() {
		if (this._params[0] === 0) {
			// Start
			$gameTimer_.start(this._params[1] * 60);
		} else {
			// Stop
			$gameTimer_.stop();
		}
		return true;
	}

	// Change Gold
	command125() {
		const value = this.operateValue(this._params[0], this._params[1], this._params[2]);
		$gameParty_.gainGold(value);
		return true;
	}

	// Change Items
	command126() {
		const value = this.operateValue(this._params[1], this._params[2], this._params[3]);
		$gameParty_.gainItem($dataItems_[this._params[0]], value);
		return true;
	}

	// Change Weapons
	command127() {
		const value = this.operateValue(this._params[1], this._params[2], this._params[3]);
		$gameParty_.gainItem($dataWeapons_[this._params[0]], value, this._params[4]);
		return true;
	}

	// Change Armors
	command128() {
		const value = this.operateValue(this._params[1], this._params[2], this._params[3]);
		$gameParty_.gainItem($dataArmors_[this._params[0]], value, this._params[4]);
		return true;
	}

	// Change Party Member
	command129() {
		const actor = $gameActors_.actor(this._params[0]);
		if (actor) {
			if (this._params[1] === 0) {
				// Add
				if (this._params[2]) {
					// Initialize
					$gameActors_.actor(this._params[0]).setup(this._params[0]);
				}
				$gameParty_.addActor(this._params[0]);
			} else {
				// Remove
				$gameParty_.removeActor(this._params[0]);
			}
		}
		return true;
	}

	// Change Battle BGM
	command132() {
		$gameSystem_.setBattleBgm(this._params[0]);
		return true;
	}

	// Change Victory ME
	command133() {
		$gameSystem_.setVictoryMe(this._params[0]);
		return true;
	}

	// Change Save Access
	command134() {
		if (this._params[0] === 0) {
			$gameSystem_.disableSave();
		} else {
			$gameSystem_.enableSave();
		}
		return true;
	}

	// Change Menu Access
	command135() {
		if (this._params[0] === 0) {
			$gameSystem_.disableMenu();
		} else {
			$gameSystem_.enableMenu();
		}
		return true;
	}

	// Change Encounter Disable
	command136() {
		if (this._params[0] === 0) {
			$gameSystem_.disableEncounter();
		} else {
			$gameSystem_.enableEncounter();
		}
		$gamePlayer_.makeEncounterCount();
		return true;
	}

	// Change Formation Access
	command137() {
		if (this._params[0] === 0) {
			$gameSystem_.disableFormation();
		} else {
			$gameSystem_.enableFormation();
		}
		return true;
	}

	// Change Window Color
	command138() {
		$gameSystem_.setWindowTone(this._params[0]);
		return true;
	}

	// Change Defeat ME
	command139() {
		$gameSystem_.setDefeatMe(this._params[0]);
		return true;
	}

	// Change Vehicle BGM
	command140() {
		const vehicle = $gameMap_.vehicle(this._params[0]);
		if (vehicle) {
			vehicle.setBgm(this._params[1]);
		}
		return true;
	}

	// Transfer Player
	command201() {
		if (!$gameParty_.inBattle() && !$gameMessage_.isBusy()) {
			let mapId;
			let x;
			let y;
			if (this._params[0] === 0) {
				// Direct designation
				mapId = this._params[1];
				x = this._params[2];
				y = this._params[3];
			} else {
				// Designation with variables
				mapId = $gameVariables_.value(this._params[1]);
				x = $gameVariables_.value(this._params[2]);
				y = $gameVariables_.value(this._params[3]);
			}
			$gamePlayer_.reserveTransfer(mapId, x, y, this._params[4], this._params[5]);
			this.setWaitMode("transfer");
			this._index++;
		}
		return false;
	}

	// Set Vehicle Location
	command202() {
		let mapId;
		let x;
		let y;
		if (this._params[1] === 0) {
			// Direct designation
			mapId = this._params[2];
			x = this._params[3];
			y = this._params[4];
		} else {
			// Designation with variables
			mapId = $gameVariables_.value(this._params[2]);
			x = $gameVariables_.value(this._params[3]);
			y = $gameVariables_.value(this._params[4]);
		}
		const vehicle = $gameMap_.vehicle(this._params[0]);
		if (vehicle) {
			vehicle.setLocation(mapId, x, y);
		}
		return true;
	}

	// Set Event Location
	command203() {
		const character = this.character(this._params[0]);
		if (character) {
			if (this._params[1] === 0) {
				// Direct designation
				character.locate(this._params[2], this._params[3]);
			} else if (this._params[1] === 1) {
				// Designation with variables
				const x = $gameVariables_.value(this._params[2]);
				const y = $gameVariables_.value(this._params[3]);
				character.locate(x, y);
			} else {
				// Exchange with another event
				const character2 = this.character(this._params[2]);
				if (character2) {
					character.swap(character2);
				}
			}
			if (this._params[4] > 0) {
				character.setDirection(this._params[4]);
			}
		}
		return true;
	}

	// Scroll Map
	command204() {
		if (!$gameParty_.inBattle()) {
			if ($gameMap_.isScrolling()) {
				this.setWaitMode("scroll");
				return false;
			}
			$gameMap_.startScroll(this._params[0], this._params[1], this._params[2]);
		}
		return true;
	}

	// Set Movement Route
	command205() {
		$gameMap_.refreshIfNeeded();
		this._character = this.character(this._params[0]);
		if (this._character) {
			this._character.forceMoveRoute(this._params[1]);
			if (this._params[1].wait) {
				this.setWaitMode("route");
			}
		}
		return true;
	}

	// Getting On and Off Vehicles
	command206() {
		$gamePlayer_.getOnOffVehicle();
		return true;
	}

	// Change Transparency
	command211() {
		$gamePlayer_.setTransparent(this._params[0] === 0);
		return true;
	}

	// Show Animation
	command212() {
		this._character = this.character(this._params[0]);
		if (this._character) {
			this._character.requestAnimation(this._params[1]);
			if (this._params[2]) {
				this.setWaitMode("animation");
			}
		}
		return true;
	}

	// Show Balloon Icon
	command213() {
		this._character = this.character(this._params[0]);
		if (this._character) {
			this._character.requestBalloon(this._params[1]);
			if (this._params[2]) {
				this.setWaitMode("balloon");
			}
		}
		return true;
	}

	// Erase Event
	command214() {
		if (this.isOnCurrentMap() && this._eventId > 0) {
			$gameMap_.eraseEvent(this._eventId);
		}
		return true;
	}

	// Change Player Followers
	command216() {
		if (this._params[0] === 0) {
			$gamePlayer_.showFollowers();
		} else {
			$gamePlayer_.hideFollowers();
		}
		$gamePlayer_.refresh();
		return true;
	}

	// Gather Followers
	command217() {
		if (!$gameParty_.inBattle()) {
			$gamePlayer_.gatherFollowers();
			this.setWaitMode("gather");
		}
		return true;
	}

	// Fadeout Screen
	command221() {
		if (!$gameMessage_.isBusy()) {
			$gameScreen_.startFadeOut(this.fadeSpeed());
			this.wait(this.fadeSpeed());
			this._index++;
		}
		return false;
	}

	// Fadein Screen
	command222() {
		if (!$gameMessage_.isBusy()) {
			$gameScreen_.startFadeIn(this.fadeSpeed());
			this.wait(this.fadeSpeed());
			this._index++;
		}
		return false;
	}

	// Tint Screen
	command223() {
		$gameScreen_.startTint(this._params[0], this._params[1]);
		if (this._params[2]) {
			this.wait(this._params[1]);
		}
		return true;
	}

	// Flash Screen
	command224() {
		$gameScreen_.startFlash(this._params[0], this._params[1]);
		if (this._params[2]) {
			this.wait(this._params[1]);
		}
		return true;
	}

	// Shake Screen
	command225() {
		$gameScreen_.startShake(this._params[0], this._params[1], this._params[2]);
		if (this._params[3]) {
			this.wait(this._params[2]);
		}
		return true;
	}

	// Wait
	command230() {
		this.wait(this._params[0]);
		return true;
	}

	// Show Picture
	command231() {
		let x;
		let y;
		if (this._params[3] === 0) {
			// Direct designation
			x = this._params[4];
			y = this._params[5];
		} else {
			// Designation with variables
			x = $gameVariables_.value(this._params[4]);
			y = $gameVariables_.value(this._params[5]);
		}
		$gameScreen_.showPicture(
			this._params[0],
			this._params[1],
			this._params[2],
			x,
			y,
			this._params[6],
			this._params[7],
			this._params[8],
			this._params[9]
		);
		return true;
	}

	// Move Picture
	command232() {
		let x;
		let y;
		if (this._params[3] === 0) {
			// Direct designation
			x = this._params[4];
			y = this._params[5];
		} else {
			// Designation with variables
			x = $gameVariables_.value(this._params[4]);
			y = $gameVariables_.value(this._params[5]);
		}
		$gameScreen_.movePicture(
			this._params[0],
			this._params[2],
			x,
			y,
			this._params[6],
			this._params[7],
			this._params[8],
			this._params[9],
			this._params[10]
		);
		if (this._params[11]) {
			this.wait(this._params[10]);
		}
		return true;
	}

	// Rotate Picture
	command233() {
		$gameScreen_.rotatePicture(this._params[0], this._params[1]);
		return true;
	}

	// Tint Picture
	command234() {
		$gameScreen_.tintPicture(this._params[0], this._params[1], this._params[2]);
		if (this._params[3]) {
			this.wait(this._params[2]);
		}
		return true;
	}

	// Erase Picture
	command235() {
		$gameScreen_.erasePicture(this._params[0]);
		return true;
	}

	// Set Weather Effect
	command236() {
		if (!$gameParty_.inBattle()) {
			$gameScreen_.changeWeather(this._params[0], this._params[1], this._params[2]);
			if (this._params[3]) {
				this.wait(this._params[2]);
			}
		}
		return true;
	}

	// Play BGM
	command241() {
		AudioManager_.playBgm(this._params[0]);
		return true;
	}

	// Fadeout BGM
	command242() {
		AudioManager_.fadeOutBgm(this._params[0]);
		return true;
	}

	// Save BGM
	command243() {
		$gameSystem_.saveBgm();
		return true;
	}

	// Resume BGM
	command244() {
		$gameSystem_.replayBgm();
		return true;
	}

	// Play BGS
	command245() {
		AudioManager_.playBgs(this._params[0]);
		return true;
	}

	// Fadeout BGS
	command246() {
		AudioManager_.fadeOutBgs(this._params[0]);
		return true;
	}

	// Play ME
	command249() {
		AudioManager_.playMe(this._params[0]);
		return true;
	}

	// Play SE
	command250() {
		AudioManager_.playSe(this._params[0]);
		return true;
	}

	// Stop SE
	command251() {
		AudioManager_.stopSe();
		return true;
	}

	// Play Movie
	command261() {
		if (!$gameMessage_.isBusy()) {
			const name = this._params[0];
			if (name.length > 0) {
				const ext = this.videoFileExt();
				Graphics_.playVideo("movies/" + name + ext);
				this.setWaitMode("video");
			}
			this._index++;
		}
		return false;
	}

	videoFileExt() {
		if (Graphics_.canPlayVideoType("video/webm") && !Utils_.isMobileDevice()) {
			return ".webm";
		} else {
			return ".mp4";
		}
	}

	// Change Map Name Display
	command281() {
		if (this._params[0] === 0) {
			$gameMap_.enableNameDisplay();
		} else {
			$gameMap_.disableNameDisplay();
		}
		return true;
	}

	// Change Tileset
	command282() {
		const tileset = $dataTilesets_[this._params[0]];
		if (!this._imageReservationId) {
			this._imageReservationId = Utils_.generateRuntimeId();
		}

		const allReady = tileset.tilesetNames
			.map((tilesetName: string) => {
				return ImageManager_.reserveTileset(tilesetName, 0, this._imageReservationId);
			})
			.every((bitmap: Bitmap) => bitmap.isReady());

		if (allReady) {
			$gameMap_.changeTileset(this._params[0]);
			ImageManager_.releaseReservation(this._imageReservationId);
			this._imageReservationId = null;

			return true;
		} else {
			return false;
		}
	}

	// Change Battle Back
	command283() {
		$gameMap_.changeBattleback(this._params[0], this._params[1]);
		return true;
	}

	// Change Parallax
	command284() {
		$gameMap_.changeParallax(this._params[0], this._params[1], this._params[2], this._params[3], this._params[4]);
		return true;
	}

	// Get Location Info
	command285() {
		let x;
		let y;
		let value;
		if (this._params[2] === 0) {
			// Direct designation
			x = this._params[3];
			y = this._params[4];
		} else {
			// Designation with variables
			x = $gameVariables_.value(this._params[3]);
			y = $gameVariables_.value(this._params[4]);
		}
		switch (this._params[1]) {
			case 0: // Terrain Tag
				value = $gameMap_.terrainTag(x, y);
				break;
			case 1: // Event ID
				value = $gameMap_.eventIdXy(x, y);
				break;
			case 2: // Tile ID (Layer 1)
			case 3: // Tile ID (Layer 2)
			case 4: // Tile ID (Layer 3)
			case 5: // Tile ID (Layer 4)
				value = $gameMap_.tileId(x, y, this._params[1] - 2);
				break;
			default: // Region ID
				value = $gameMap_.regionId(x, y);
				break;
		}
		$gameVariables_.setValue(this._params[0], value);
		return true;
	}

	// Battle Processing
	command301() {
		if (!$gameParty_.inBattle()) {
			let troopId;
			if (this._params[0] === 0) {
				// Direct designation
				troopId = this._params[1];
			} else if (this._params[0] === 1) {
				// Designation with a variable
				troopId = $gameVariables_.value(this._params[1]);
			} else {
				// Same as Random Encounter
				troopId = $gamePlayer_.makeEncounterTroopId();
			}
			if ($dataTroops_[troopId]) {
				BattleManager_.setup(troopId, this._params[2], this._params[3]);
				BattleManager_.setEventCallback((n: any) => {
					this._branch[this._indent] = n;
				});
				$gamePlayer_.makeEncounterCount();
				SceneManager_.push(Scene_Battle);
			}
		}
		return true;
	}

	// If Win
	command601() {
		if (this._branch[this._indent] !== 0) {
			this.skipBranch();
		}
		return true;
	}

	// If Escape
	command602() {
		if (this._branch[this._indent] !== 1) {
			this.skipBranch();
		}
		return true;
	}

	// If Lose
	command603() {
		if (this._branch[this._indent] !== 2) {
			this.skipBranch();
		}
		return true;
	}

	// Shop Processing
	command302() {
		if (!$gameParty_.inBattle()) {
			const goods = [this._params];
			while (this.nextEventCode() === 605) {
				this._index++;
				goods.push(this.currentCommand().parameters);
			}
			SceneManager_.push(Scene_Shop);
			SceneManager_.prepareNextScene(goods, this._params[4]);
		}
		return true;
	}

	// Name Input Processing
	command303() {
		// 名前入力も今の所サポートしていないのでコメントアウト
		// if (!$gameParty.inBattle()) {
		// 	if ($dataActors[this._params[0]]) {
		// 		SceneManager_.push(Scene_Name);
		// 		SceneManager_.prepareNextScene(this._params[0], this._params[1]);
		// 	}
		// }
		return true;
	}

	// Change HP
	command311() {
		const value = this.operateValue(this._params[2], this._params[3], this._params[4]);
		this.iterateActorEx(this._params[0], this._params[1], (actor: any) => {
			this.changeHp(actor, value, this._params[5]);
		});
		return true;
	}

	// Change MP
	command312() {
		const value = this.operateValue(this._params[2], this._params[3], this._params[4]);
		this.iterateActorEx(this._params[0], this._params[1], (actor: any) => {
			actor.gainMp(value);
		});
		return true;
	}

	// Change TP
	command326() {
		const value = this.operateValue(this._params[2], this._params[3], this._params[4]);
		this.iterateActorEx(this._params[0], this._params[1], (actor: any) => {
			actor.gainTp(value);
		});
		return true;
	}

	// Change State
	command313() {
		this.iterateActorEx(this._params[0], this._params[1], (actor: any) => {
			const alreadyDead = actor.isDead();
			if (this._params[2] === 0) {
				actor.addState(this._params[3]);
			} else {
				actor.removeState(this._params[3]);
			}
			if (actor.isDead() && !alreadyDead) {
				actor.performCollapse();
			}
			actor.clearResult();
		});
		return true;
	}

	// Recover All
	command314() {
		this.iterateActorEx(this._params[0], this._params[1], (actor: any) => {
			actor.recoverAll();
		});
		return true;
	}

	// Change EXP
	command315() {
		const value = this.operateValue(this._params[2], this._params[3], this._params[4]);
		this.iterateActorEx(this._params[0], this._params[1], (actor: any) => {
			actor.changeExp(actor.currentExp() + value, this._params[5]);
		});
		return true;
	}

	// Change Level
	command316() {
		const value = this.operateValue(this._params[2], this._params[3], this._params[4]);
		this.iterateActorEx(this._params[0], this._params[1], (actor: any) => {
			actor.changeLevel(actor.level + value, this._params[5]);
		});
		return true;
	}

	// Change Parameter
	command317() {
		const value = this.operateValue(this._params[3], this._params[4], this._params[5]);
		this.iterateActorEx(this._params[0], this._params[1], (actor: any) => {
			actor.addParam(this._params[2], value);
		});
		return true;
	}

	// Change Skill
	command318() {
		this.iterateActorEx(this._params[0], this._params[1], (actor: any) => {
			if (this._params[2] === 0) {
				actor.learnSkill(this._params[3]);
			} else {
				actor.forgetSkill(this._params[3]);
			}
		});
		return true;
	}

	// Change Equipment
	command319() {
		const actor = $gameActors_.actor(this._params[0]);
		if (actor) {
			actor.changeEquipById(this._params[1], this._params[2]);
		}
		return true;
	}

	// Change Name
	command320() {
		const actor = $gameActors_.actor(this._params[0]);
		if (actor) {
			actor.setName(this._params[1]);
		}
		return true;
	}

	// Change Class
	command321() {
		const actor = $gameActors_.actor(this._params[0]);
		if (actor && $dataClasses_[this._params[1]]) {
			actor.changeClass(this._params[1], this._params[2]);
		}
		return true;
	}

	// Change Actor Images
	command322() {
		const actor = $gameActors_.actor(this._params[0]);
		if (actor) {
			actor.setCharacterImage(this._params[1], this._params[2]);
			actor.setFaceImage(this._params[3], this._params[4]);
			actor.setBattlerImage(this._params[5]);
		}
		$gamePlayer_.refresh();
		return true;
	}

	// Change Vehicle Image
	command323() {
		const vehicle = $gameMap_.vehicle(this._params[0]);
		if (vehicle) {
			vehicle.setImage(this._params[1], this._params[2]);
		}
		return true;
	}

	// Change Nickname
	command324() {
		const actor = $gameActors_.actor(this._params[0]);
		if (actor) {
			actor.setNickname(this._params[1]);
		}
		return true;
	}

	// Change Profile
	command325() {
		const actor = $gameActors_.actor(this._params[0]);
		if (actor) {
			actor.setProfile(this._params[1]);
		}
		return true;
	}

	// Change Enemy HP
	command331() {
		const value = this.operateValue(this._params[1], this._params[2], this._params[3]);
		this.iterateEnemyIndex(this._params[0], enemy => {
			this.changeHp(enemy, value, this._params[4]);
		});
		return true;
	}

	// Change Enemy MP
	command332() {
		const value = this.operateValue(this._params[1], this._params[2], this._params[3]);
		this.iterateEnemyIndex(this._params[0], (enemy: any) => {
			enemy.gainMp(value);
		});
		return true;
	}

	// Change Enemy TP
	command342() {
		const value = this.operateValue(this._params[1], this._params[2], this._params[3]);
		this.iterateEnemyIndex(this._params[0], (enemy: any) => {
			enemy.gainTp(value);
		});
		return true;
	}

	// Change Enemy State
	command333() {
		this.iterateEnemyIndex(this._params[0], enemy => {
			const alreadyDead = enemy.isDead();
			if (this._params[1] === 0) {
				enemy.addState(this._params[2]);
			} else {
				enemy.removeState(this._params[2]);
			}
			if (enemy.isDead() && !alreadyDead) {
				enemy.performCollapse();
			}
			enemy.clearResult();
		});
		return true;
	}

	// Enemy Recover All
	command334() {
		this.iterateEnemyIndex(this._params[0], enemy => {
			enemy.recoverAll();
		});
		return true;
	}

	// Enemy Appear
	command335() {
		this.iterateEnemyIndex(this._params[0], enemy => {
			enemy.appear();
			$gameTroop_.makeUniqueNames();
		});
		return true;
	}

	// Enemy Transform
	command336() {
		this.iterateEnemyIndex(this._params[0], enemy => {
			enemy.transform(this._params[1]);
			$gameTroop_.makeUniqueNames();
		});
		return true;
	}

	// Show Battle Animation
	command337() {
		if (this._params[2] === true) {
			this.iterateEnemyIndex(-1, enemy => {
				if (enemy.isAlive()) {
					enemy.startAnimation(this._params[1], false, 0);
				}
			});
		} else {
			this.iterateEnemyIndex(this._params[0], enemy => {
				if (enemy.isAlive()) {
					enemy.startAnimation(this._params[1], false, 0);
				}
			});
		}
		return true;
	}

	// Force Action
	command339() {
		this.iterateBattler(this._params[0], this._params[1], battler => {
			if (!battler.isDeathStateAffected()) {
				battler.forceAction(this._params[2], this._params[3]);
				BattleManager_.forceAction(battler);
				this.setWaitMode("action");
			}
		});
		return true;
	}

	// Abort Battle
	command340() {
		BattleManager_.abort();
		return true;
	}

	// Open Menu Screen
	command351() {
		if (!$gameParty_.inBattle()) {
			SceneManager_.push(Scene_Menu);
			Window_MenuCommand.initCommandPosition();
		}
		return true;
	}

	// Open Save Screen
	command352() {
		// セーブ機能は今の所サポートしていないのでコメントアウト
		// if (!$gameParty.inBattle()) {
		// 	SceneManager_.push(Scene_Save);
		// }
		return true;
	}

	// Game Over
	command353() {
		SceneManager_.goto(Scene_Gameover);
		return true;
	}

	// Return to Title Screen
	command354() {
		SceneManager_.goto(Scene_Title);
		return true;
	}

	// Script
	command355() {
		let script = this.currentCommand().parameters[0] + "\n";
		while (this.nextEventCode() === 655) {
			this._index++;
			script += this.currentCommand().parameters[0] + "\n";
		}

		// eslint-disable-next-line no-eval
		eval(script);
		return true;
	}

	// Plugin Command
	command356() {
		const args = this._params[0].split(" ");
		const command = args.shift();
		this.pluginCommand(command, args);
		return true;
	}

	pluginCommand(_command: any, _args: any) {
		// to be overridden by plugins
	}
}
