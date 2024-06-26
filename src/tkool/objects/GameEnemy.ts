import { Utils } from "../core/Utils";
import {
	$gameTroop,
	$gameParty,
	$dataEnemies,
	$dataItems,
	$dataWeapons,
	$dataArmors,
	$dataSkills,
	$gameSwitches
} from "../managers/globals";
import { SoundManager } from "../managers/SoundManager";
import { Game_Battler } from "./GameBattler";
import type { Game_Unit } from "./GameUnit";

export class Game_Enemy extends Game_Battler {
	private _enemyId: number;
	private _letter: string;
	private _plural: boolean;
	private _screenX: number;
	private _screenY: number;

	constructor(enemyId: number, x: number, y: number) {
		super();
		if (Object.getPrototypeOf(this) === Game_Enemy.prototype) {
			this.initialize(enemyId, x, y);
		}
	}

	initialize(enemyId: number, x: number, y: number) {
		super.initialize();
		Game_Battler.prototype.initialize.call(this);
		this.setup(enemyId, x, y);
	}

	initMembers() {
		super.initMembers();
		this._enemyId = 0;
		this._letter = "";
		this._plural = false;
		this._screenX = 0;
		this._screenY = 0;
	}

	setup(enemyId: number, x: number, y: number) {
		this._enemyId = enemyId;
		this._screenX = x;
		this._screenY = y;
		this.recoverAll();
	}

	isEnemy() {
		return true;
	}

	friendsUnit() {
		return $gameTroop;
	}

	opponentsUnit(): Game_Unit {
		return $gameParty;
	}

	index() {
		return $gameTroop.members().indexOf(this);
	}

	isBattleMember() {
		return this.index() >= 0;
	}

	enemyId() {
		return this._enemyId;
	}

	enemy() {
		return $dataEnemies[this._enemyId];
	}

	traitObjects() {
		return Game_Battler.prototype.traitObjects.call(this).concat(this.enemy());
	}

	paramBase(paramId: number) {
		return this.enemy().params[paramId];
	}

	exp() {
		return this.enemy().exp;
	}

	gold() {
		return this.enemy().gold;
	}

	makeDropItems() {
		return this.enemy().dropItems.reduce((r: any, di: any) => {
			if (di.kind > 0 && g.game.vars.random.generate() * di.denominator < this.dropItemRate()) {
				return r.concat(this.itemObject(di.kind, di.dataId));
			} else {
				return r;
			}
		}, []);
	}

	dropItemRate() {
		return $gameParty.hasDropItemDouble() ? 2 : 1;
	}

	itemObject(kind: number, dataId: number) {
		if (kind === 1) {
			return $dataItems[dataId];
		} else if (kind === 2) {
			return $dataWeapons[dataId];
		} else if (kind === 3) {
			return $dataArmors[dataId];
		} else {
			return null;
		}
	}

	isSpriteVisible() {
		return true;
	}

	screenX() {
		return this._screenX;
	}

	screenY() {
		return this._screenY;
	}

	battlerName() {
		return this.enemy().battlerName;
	}

	battlerHue() {
		return this.enemy().battlerHue;
	}

	originalName() {
		return this.enemy().name;
	}

	name() {
		return this.originalName() + (this._plural ? this._letter : "");
	}

	isLetterEmpty() {
		return this._letter === "";
	}

	setLetter(letter: string) {
		this._letter = letter;
	}

	setPlural(plural: boolean) {
		this._plural = plural;
	}

	performActionStart(action: any) {
		super.performActionStart(action);
		this.requestEffect("whiten");
	}

	performAction(action: any) {
		super.performAction(action);
	}

	performActionEnd() {
		super.performActionEnd();
	}

	performDamage() {
		super.performDamage();
		SoundManager.playEnemyDamage();
		this.requestEffect("blink");
	}

	performCollapse() {
		Game_Battler.prototype.performCollapse.call(this);
		switch (this.collapseType()) {
			case 0:
				this.requestEffect("collapse");
				SoundManager.playEnemyCollapse();
				break;
			case 1:
				this.requestEffect("bossCollapse");
				SoundManager.playBossCollapse1();
				break;
			case 2:
				this.requestEffect("instantCollapse");
				break;
		}
	}

	transform(enemyId: number) {
		const name = this.originalName();
		this._enemyId = enemyId;
		if (this.originalName() !== name) {
			this._letter = "";
			this._plural = false;
		}
		this.refresh();
		if (this.numActions() > 0) {
			this.makeActions();
		}
	}

	meetsCondition(action: any) {
		const param1 = action.conditionParam1;
		const param2 = action.conditionParam2;
		switch (action.conditionType) {
			case 1:
				return this.meetsTurnCondition(param1, param2);
			case 2:
				return this.meetsHpCondition(param1, param2);
			case 3:
				return this.meetsMpCondition(param1, param2);
			case 4:
				return this.meetsStateCondition(param1);
			case 5:
				return this.meetsPartyLevelCondition(param1);
			case 6:
				return this.meetsSwitchCondition(param1);
			default:
				return true;
		}
	}

	meetsTurnCondition(param1: number, param2: number) {
		const n = $gameTroop.turnCount();
		if (param2 === 0) {
			return n === param1;
		} else {
			return n > 0 && n >= param1 && n % param2 === param1 % param2;
		}
	}

	meetsHpCondition(param1: number, param2: number) {
		return this.hpRate() >= param1 && this.hpRate() <= param2;
	}

	meetsMpCondition(param1: number, param2: number) {
		return this.mpRate() >= param1 && this.mpRate() <= param2;
	}

	meetsStateCondition(param: number) {
		return this.isStateAffected(param);
	}

	meetsPartyLevelCondition(param: number) {
		return $gameParty.highestLevel() >= param;
	}

	meetsSwitchCondition(param: number) {
		return $gameSwitches.value(param);
	}

	isActionValid(action: any) {
		return this.meetsCondition(action) && this.canUse($dataSkills[action.skillId]);
	}

	selectAction(actionList: any[], ratingZero: number) {
		const sum = actionList.reduce((r: number, a: any) => {
			return r + a.rating - ratingZero;
		}, 0);
		if (sum > 0) {
			let value = Utils.randomInt(sum);
			for (let i = 0; i < actionList.length; i++) {
				const action = actionList[i];
				value -= action.rating - ratingZero;
				if (value < 0) {
					return action;
				}
			}
		} else {
			return null;
		}
	}

	selectAllActions(actionList: any[]) {
		const ratingMax = Math.max.apply(
			null,
			actionList.map(a => {
				return a.rating;
			})
		);
		const ratingZero = ratingMax - 3;
		actionList = actionList.filter(a => {
			return a.rating > ratingZero;
		});
		for (let i = 0; i < this.numActions(); i++) {
			this.action(i).setEnemyAction(this.selectAction(actionList, ratingZero));
		}
	}

	makeActions() {
		Game_Battler.prototype.makeActions.call(this);
		if (this.numActions() > 0) {
			const actionList = this.enemy().actions.filter((a: any) => {
				return this.isActionValid(a);
			});
			if (actionList.length > 0) {
				this.selectAllActions(actionList);
			}
		}
		this.setActionState("waiting");
	}
}
