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
import { Game_CharacterBase } from "./GameCharacterBase";

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

function randomInt(max: number) {
	return Math.floor(max * g.game.vars.random.generate());
}

export class Game_Character extends Game_CharacterBase {
	static ROUTE_END: number = 0;
	static ROUTE_MOVE_DOWN: number = 1;
	static ROUTE_MOVE_LEFT: number = 2;
	static ROUTE_MOVE_RIGHT: number = 3;
	static ROUTE_MOVE_UP: number = 4;
	static ROUTE_MOVE_LOWER_L: number = 5;
	static ROUTE_MOVE_LOWER_R: number = 6;
	static ROUTE_MOVE_UPPER_L: number = 7;
	static ROUTE_MOVE_UPPER_R: number = 8;
	static ROUTE_MOVE_RANDOM: number = 9;
	static ROUTE_MOVE_TOWARD: number = 10;
	static ROUTE_MOVE_AWAY: number = 11;
	static ROUTE_MOVE_FORWARD: number = 12;
	static ROUTE_MOVE_BACKWARD: number = 13;
	static ROUTE_JUMP: number = 14;
	static ROUTE_WAIT: number = 15;
	static ROUTE_TURN_DOWN: number = 16;
	static ROUTE_TURN_LEFT: number = 17;
	static ROUTE_TURN_RIGHT: number = 18;
	static ROUTE_TURN_UP: number = 19;
	static ROUTE_TURN_90D_R: number = 20;
	static ROUTE_TURN_90D_L: number = 21;
	static ROUTE_TURN_180D: number = 22;
	static ROUTE_TURN_90D_R_L: number = 23;
	static ROUTE_TURN_RANDOM: number = 24;
	static ROUTE_TURN_TOWARD: number = 25;
	static ROUTE_TURN_AWAY: number = 26;
	static ROUTE_SWITCH_ON: number = 27;
	static ROUTE_SWITCH_OFF: number = 28;
	static ROUTE_CHANGE_SPEED: number = 29;
	static ROUTE_CHANGE_FREQ: number = 30;
	static ROUTE_WALK_ANIME_ON: number = 31;
	static ROUTE_WALK_ANIME_OFF: number = 32;
	static ROUTE_STEP_ANIME_ON: number = 33;
	static ROUTE_STEP_ANIME_OFF: number = 34;
	static ROUTE_DIR_FIX_ON: number = 35;
	static ROUTE_DIR_FIX_OFF: number = 36;
	static ROUTE_THROUGH_ON: number = 37;
	static ROUTE_THROUGH_OFF: number = 38;
	static ROUTE_TRANSPARENT_ON: number = 39;
	static ROUTE_TRANSPARENT_OFF: number = 40;
	static ROUTE_CHANGE_IMAGE: number = 41;
	static ROUTE_CHANGE_OPACITY: number = 42;
	static ROUTE_CHANGE_BLEND_MODE: number = 43;
	static ROUTE_PLAY_SE: number = 44;
	static ROUTE_SCRIPT: number = 45;

	private _moveRouteForcing: boolean;
	private _moveRoute: any;
	private _moveRouteIndex: number;
	private _originalMoveRoute: number;
	private _originalMoveRouteIndex: number;
	private _waitCount: number;

	constructor() {
		super();
		if (Object.getPrototypeOf(this) === Game_Character.prototype) {
			this.initialize();
		}
	}

	initialize(..._args: any[]) {
		super.initialize();
	}

	initMembers() {
		super.initMembers();
		this._moveRouteForcing = false;
		this._moveRoute = null;
		this._moveRouteIndex = 0;
		this._originalMoveRoute = null;
		this._originalMoveRouteIndex = 0;
		this._waitCount = 0;
	}

	memorizeMoveRoute() {
		this._originalMoveRoute = this._moveRoute;
		this._originalMoveRouteIndex = this._moveRouteIndex;
	}

	restoreMoveRoute() {
		this._moveRoute = this._originalMoveRoute;
		this._moveRouteIndex = this._originalMoveRouteIndex;
		this._originalMoveRoute = null;
	}

	isMoveRouteForcing() {
		return this._moveRouteForcing;
	}

	setMoveRoute(moveRoute: any) {
		this._moveRoute = moveRoute;
		this._moveRouteIndex = 0;
		this._moveRouteForcing = false;
	}

	forceMoveRoute(moveRoute: any) {
		if (!this._originalMoveRoute) {
			this.memorizeMoveRoute();
		}
		this._moveRoute = moveRoute;
		this._moveRouteIndex = 0;
		this._moveRouteForcing = true;
		this._waitCount = 0;
	}

	updateStop() {
		super.updateStop();
		if (this._moveRouteForcing) {
			this.updateRoutineMove();
		}
	}

	updateRoutineMove() {
		if (this._waitCount > 0) {
			this._waitCount--;
		} else {
			this.setMovementSuccess(true);
			const command = this._moveRoute.list[this._moveRouteIndex];
			if (command) {
				this.processMoveCommand(command);
				this.advanceMoveRouteIndex();
			}
		}
	}

	processMoveCommand(command: any) {
		const gc = Game_Character;
		const params = command.parameters;
		switch (command.code) {
			case gc.ROUTE_END:
				this.processRouteEnd();
				break;
			case gc.ROUTE_MOVE_DOWN:
				this.moveStraight(2);
				break;
			case gc.ROUTE_MOVE_LEFT:
				this.moveStraight(4);
				break;
			case gc.ROUTE_MOVE_RIGHT:
				this.moveStraight(6);
				break;
			case gc.ROUTE_MOVE_UP:
				this.moveStraight(8);
				break;
			case gc.ROUTE_MOVE_LOWER_L:
				this.moveDiagonally(4, 2);
				break;
			case gc.ROUTE_MOVE_LOWER_R:
				this.moveDiagonally(6, 2);
				break;
			case gc.ROUTE_MOVE_UPPER_L:
				this.moveDiagonally(4, 8);
				break;
			case gc.ROUTE_MOVE_UPPER_R:
				this.moveDiagonally(6, 8);
				break;
			case gc.ROUTE_MOVE_RANDOM:
				this.moveRandom();
				break;
			case gc.ROUTE_MOVE_TOWARD:
				this.moveTowardPlayer();
				break;
			case gc.ROUTE_MOVE_AWAY:
				this.moveAwayFromPlayer();
				break;
			case gc.ROUTE_MOVE_FORWARD:
				this.moveForward();
				break;
			case gc.ROUTE_MOVE_BACKWARD:
				this.moveBackward();
				break;
			case gc.ROUTE_JUMP:
				this.jump(params[0], params[1]);
				break;
			case gc.ROUTE_WAIT:
				this._waitCount = params[0] - 1;
				break;
			case gc.ROUTE_TURN_DOWN:
				this.setDirection(2);
				break;
			case gc.ROUTE_TURN_LEFT:
				this.setDirection(4);
				break;
			case gc.ROUTE_TURN_RIGHT:
				this.setDirection(6);
				break;
			case gc.ROUTE_TURN_UP:
				this.setDirection(8);
				break;
			case gc.ROUTE_TURN_90D_R:
				this.turnRight90();
				break;
			case gc.ROUTE_TURN_90D_L:
				this.turnLeft90();
				break;
			case gc.ROUTE_TURN_180D:
				this.turn180();
				break;
			case gc.ROUTE_TURN_90D_R_L:
				this.turnRightOrLeft90();
				break;
			case gc.ROUTE_TURN_RANDOM:
				this.turnRandom();
				break;
			case gc.ROUTE_TURN_TOWARD:
				this.turnTowardPlayer();
				break;
			case gc.ROUTE_TURN_AWAY:
				this.turnAwayFromPlayer();
				break;
			case gc.ROUTE_SWITCH_ON:
				$gameSwitches_.setValue(params[0], true);
				break;
			case gc.ROUTE_SWITCH_OFF:
				$gameSwitches_.setValue(params[0], false);
				break;
			case gc.ROUTE_CHANGE_SPEED:
				this.setMoveSpeed(params[0]);
				break;
			case gc.ROUTE_CHANGE_FREQ:
				this.setMoveFrequency(params[0]);
				break;
			case gc.ROUTE_WALK_ANIME_ON:
				this.setWalkAnime(true);
				break;
			case gc.ROUTE_WALK_ANIME_OFF:
				this.setWalkAnime(false);
				break;
			case gc.ROUTE_STEP_ANIME_ON:
				this.setStepAnime(true);
				break;
			case gc.ROUTE_STEP_ANIME_OFF:
				this.setStepAnime(false);
				break;
			case gc.ROUTE_DIR_FIX_ON:
				this.setDirectionFix(true);
				break;
			case gc.ROUTE_DIR_FIX_OFF:
				this.setDirectionFix(false);
				break;
			case gc.ROUTE_THROUGH_ON:
				this.setThrough(true);
				break;
			case gc.ROUTE_THROUGH_OFF:
				this.setThrough(false);
				break;
			case gc.ROUTE_TRANSPARENT_ON:
				this.setTransparent(true);
				break;
			case gc.ROUTE_TRANSPARENT_OFF:
				this.setTransparent(false);
				break;
			case gc.ROUTE_CHANGE_IMAGE:
				this.setImage(params[0], params[1]);
				break;
			case gc.ROUTE_CHANGE_OPACITY:
				this.setOpacity(params[0]);
				break;
			case gc.ROUTE_CHANGE_BLEND_MODE:
				this.setBlendMode(params[0]);
				break;
			case gc.ROUTE_PLAY_SE:
				AudioManager_.playSe(params[0]);
				break;
			case gc.ROUTE_SCRIPT:
				// eslint-disable-next-line no-eval
				eval(params[0]); // TODO: evalしている!!
				break;
		}
	}

	deltaXFrom(x: number): number {
		return $gameMap_.deltaX(this.x, x);
	}

	deltaYFrom(y: number): number {
		return $gameMap_.deltaY(this.y, y);
	}

	moveRandom() {
		const d = 2 + randomInt(4) * 2;
		if (this.canPass(this.x, this.y, d)) {
			this.moveStraight(d);
		}
	}

	moveTowardCharacter(character: Game_CharacterBase) {
		const sx = this.deltaXFrom(character.x);
		const sy = this.deltaYFrom(character.y);
		if (Math.abs(sx) > Math.abs(sy)) {
			this.moveStraight(sx > 0 ? 4 : 6);
			if (!this.isMovementSucceeded() && sy !== 0) {
				this.moveStraight(sy > 0 ? 8 : 2);
			}
		} else if (sy !== 0) {
			this.moveStraight(sy > 0 ? 8 : 2);
			if (!this.isMovementSucceeded() && sx !== 0) {
				this.moveStraight(sx > 0 ? 4 : 6);
			}
		}
	}

	moveAwayFromCharacter(character: Game_CharacterBase) {
		const sx = this.deltaXFrom(character.x);
		const sy = this.deltaYFrom(character.y);
		if (Math.abs(sx) > Math.abs(sy)) {
			this.moveStraight(sx > 0 ? 6 : 4);
			if (!this.isMovementSucceeded() && sy !== 0) {
				this.moveStraight(sy > 0 ? 2 : 8);
			}
		} else if (sy !== 0) {
			this.moveStraight(sy > 0 ? 2 : 8);
			if (!this.isMovementSucceeded() && sx !== 0) {
				this.moveStraight(sx > 0 ? 6 : 4);
			}
		}
	}

	turnTowardCharacter(character: Game_CharacterBase) {
		const sx = this.deltaXFrom(character.x);
		const sy = this.deltaYFrom(character.y);
		if (Math.abs(sx) > Math.abs(sy)) {
			this.setDirection(sx > 0 ? 4 : 6);
		} else if (sy !== 0) {
			this.setDirection(sy > 0 ? 8 : 2);
		}
	}

	turnAwayFromCharacter(character: Game_CharacterBase) {
		const sx = this.deltaXFrom(character.x);
		const sy = this.deltaYFrom(character.y);
		if (Math.abs(sx) > Math.abs(sy)) {
			this.setDirection(sx > 0 ? 6 : 4);
		} else if (sy !== 0) {
			this.setDirection(sy > 0 ? 2 : 8);
		}
	}

	turnTowardPlayer() {
		this.turnTowardCharacter($gamePlayer_);
	}

	turnAwayFromPlayer() {
		this.turnAwayFromCharacter($gamePlayer_);
	}

	moveTowardPlayer() {
		this.moveTowardCharacter($gamePlayer_);
	}

	moveAwayFromPlayer() {
		this.moveAwayFromCharacter($gamePlayer_);
	}

	moveForward() {
		this.moveStraight(this.direction());
	}

	moveBackward() {
		const lastDirectionFix = this.isDirectionFixed();
		this.setDirectionFix(true);
		this.moveStraight(this.reverseDir(this.direction()));
		this.setDirectionFix(lastDirectionFix);
	}

	processRouteEnd() {
		if (this._moveRoute.repeat) {
			this._moveRouteIndex = -1;
		} else if (this._moveRouteForcing) {
			this._moveRouteForcing = false;
			this.restoreMoveRoute();
		}
	}

	advanceMoveRouteIndex() {
		const moveRoute = this._moveRoute;
		if (moveRoute && (this.isMovementSucceeded() || moveRoute.skippable)) {
			const numCommands = moveRoute.list.length - 1;
			this._moveRouteIndex++;
			if (moveRoute.repeat && this._moveRouteIndex >= numCommands) {
				this._moveRouteIndex = 0;
			}
		}
	}

	turnRight90() {
		switch (this.direction()) {
			case 2:
				this.setDirection(4);
				break;
			case 4:
				this.setDirection(8);
				break;
			case 6:
				this.setDirection(2);
				break;
			case 8:
				this.setDirection(6);
				break;
		}
	}

	turnLeft90() {
		switch (this.direction()) {
			case 2:
				this.setDirection(6);
				break;
			case 4:
				this.setDirection(2);
				break;
			case 6:
				this.setDirection(8);
				break;
			case 8:
				this.setDirection(4);
				break;
		}
	}

	turn180() {
		this.setDirection(this.reverseDir(this.direction()));
	}

	turnRightOrLeft90() {
		switch (randomInt(2)) {
			case 0:
				this.turnRight90();
				break;
			case 1:
				this.turnLeft90();
				break;
		}
	}

	turnRandom() {
		this.setDirection(2 + randomInt(4) * 2);
	}

	swap(character: Game_CharacterBase) {
		const newX = character.x;
		const newY = character.y;
		character.locate(this.x, this.y);
		this.locate(newX, newY);
	}

	findDirectionTo(goalX: number, goalY: number): number {
		const searchLimit = this.searchLimit();
		const mapWidth = $gameMap_.width();
		const nodeList: any[] = [];
		const openList: any[] = [];
		const closedList: any = [];
		const start: { parent: any; x: number; y: number; g: number; f: number } = {} as any;
		let best = start;

		if (this.x === goalX && this.y === goalY) {
			return 0;
		}

		start.parent = null;
		start.x = this.x;
		start.y = this.y;
		start.g = 0;
		start.f = $gameMap_.distance(start.x, start.y, goalX, goalY);
		nodeList.push(start);
		openList.push(start.y * mapWidth + start.x);

		while (nodeList.length > 0) {
			let bestIndex = 0;
			for (let i = 0; i < nodeList.length; i++) {
				if (nodeList[i].f < nodeList[bestIndex].f) {
					bestIndex = i;
				}
			}

			const current = nodeList[bestIndex];
			const x1 = current.x;
			const y1 = current.y;
			const pos1 = y1 * mapWidth + x1;
			const g1 = current.g;

			nodeList.splice(bestIndex, 1);
			openList.splice(openList.indexOf(pos1), 1);
			closedList.push(pos1);

			if (current.x === goalX && current.y === goalY) {
				best = current;
				break;
			}

			if (g1 >= searchLimit) {
				continue;
			}

			for (let j = 0; j < 4; j++) {
				const direction = 2 + j * 2;
				const x2 = $gameMap_.roundXWithDirection(x1, direction);
				const y2 = $gameMap_.roundYWithDirection(y1, direction);
				const pos2 = y2 * mapWidth + x2;

				if (Utils_.contains(closedList, pos2)) {
					continue;
				}
				if (!this.canPass(x1, y1, direction)) {
					continue;
				}

				const g2 = g1 + 1;
				const index2 = openList.indexOf(pos2);

				if (index2 < 0 || g2 < nodeList[index2].g) {
					let neighbor: any;
					if (index2 >= 0) {
						neighbor = nodeList[index2];
					} else {
						neighbor = {};
						nodeList.push(neighbor);
						openList.push(pos2);
					}
					neighbor.parent = current;
					neighbor.x = x2;
					neighbor.y = y2;
					neighbor.g = g2;
					neighbor.f = g2 + $gameMap_.distance(x2, y2, goalX, goalY);
					if (!best || neighbor.f - neighbor.g < best.f - best.g) {
						best = neighbor;
					}
				}
			}
		}

		let node = best;
		while (node.parent && node.parent !== start) {
			node = node.parent;
		}

		const deltaX1 = $gameMap_.deltaX(node.x, start.x);
		const deltaY1 = $gameMap_.deltaY(node.y, start.y);
		if (deltaY1 > 0) {
			return 2;
		} else if (deltaX1 < 0) {
			return 4;
		} else if (deltaX1 > 0) {
			return 6;
		} else if (deltaY1 < 0) {
			return 8;
		}

		const deltaX2 = this.deltaXFrom(goalX);
		const deltaY2 = this.deltaYFrom(goalY);
		if (Math.abs(deltaX2) > Math.abs(deltaY2)) {
			return deltaX2 > 0 ? 4 : 6;
		} else if (deltaY2 !== 0) {
			return deltaY2 > 0 ? 8 : 2;
		}

		return 0;
	}

	searchLimit(): number {
		return 12;
	}
}
