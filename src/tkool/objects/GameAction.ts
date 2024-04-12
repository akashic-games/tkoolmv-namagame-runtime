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
import type { Game_Battler } from "./GameBattler";
import { Game_Item } from "./GameItem";
import type { Game_Unit } from "./GameUnit";

declare const console: any;

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

export class Game_Action {
	static EFFECT_RECOVER_HP: number = 11;
	static EFFECT_RECOVER_MP: number = 12;
	static EFFECT_GAIN_TP: number = 13;
	static EFFECT_ADD_STATE: number = 21;
	static EFFECT_REMOVE_STATE: number = 22;
	static EFFECT_ADD_BUFF: number = 31;
	static EFFECT_ADD_DEBUFF: number = 32;
	static EFFECT_REMOVE_BUFF: number = 33;
	static EFFECT_REMOVE_DEBUFF: number = 34;
	static EFFECT_SPECIAL: number = 41;
	static EFFECT_GROW: number = 42;
	static EFFECT_LEARN_SKILL: number = 43;
	static EFFECT_COMMON_EVENT: number = 44;
	static SPECIAL_EFFECT_ESCAPE: number = 0;
	static HITTYPE_CERTAIN: number = 0;
	static HITTYPE_PHYSICAL: number = 1;
	static HITTYPE_MAGICAL: number = 2;

	_subjectActorId: number;
	_subjectEnemyIndex: number;
	_forcing: boolean;
	_item: Game_Item;
	_targetIndex: number;
	_reflectionTarget: any;

	constructor(subject: any, forcing?: boolean) {
		this.initialize(subject, forcing);
	}

	initialize(subject: any, forcing: boolean) {
		this._subjectActorId = 0;
		this._subjectEnemyIndex = -1;
		this._forcing = forcing || false;
		this.setSubject(subject);
		this.clear();
	}

	clear() {
		this._item = new Game_Item();
		this._targetIndex = -1;
	}

	setSubject(subject: any) {
		if (subject.isActor()) {
			this._subjectActorId = subject.actorId();
			this._subjectEnemyIndex = -1;
		} else {
			this._subjectEnemyIndex = subject.index();
			this._subjectActorId = 0;
		}
	}

	subject(): Game_Battler {
		if (this._subjectActorId > 0) {
			return $gameActors_.actor(this._subjectActorId);
		} else {
			return $gameTroop_.members()[this._subjectEnemyIndex];
		}
	}

	friendsUnit() {
		return this.subject().friendsUnit();
	}

	opponentsUnit(): Game_Unit {
		return this.subject().opponentsUnit();
	}

	setEnemyAction(action: any) {
		if (action) {
			this.setSkill(action.skillId);
		} else {
			this.clear();
		}
	}

	setAttack() {
		this.setSkill(this.subject().attackSkillId());
	}

	setGuard() {
		this.setSkill(this.subject().guardSkillId());
	}

	setSkill(skillId: number) {
		this._item.setObject($dataSkills_[skillId]);
	}

	setItem(itemId: number) {
		this._item.setObject($dataItems_[itemId]);
	}

	setItemObject(object: any) {
		this._item.setObject(object);
	}

	setTarget(targetIndex: number) {
		this._targetIndex = targetIndex;
	}

	item() {
		return this._item.object();
	}

	isSkill() {
		return this._item.isSkill();
	}

	isItem() {
		return this._item.isItem();
	}

	numRepeats() {
		let repeats = this.item().repeats;
		if (this.isAttack()) {
			repeats += this.subject().attackTimesAdd();
		}
		return Math.floor(repeats);
	}

	checkItemScope(list: any) {
		// return list.contains(this.item().scope);
		return Utils_.contains(list, this.item().scope);
	}

	isForOpponent() {
		return this.checkItemScope([1, 2, 3, 4, 5, 6]);
	}

	isForFriend() {
		return this.checkItemScope([7, 8, 9, 10, 11]);
	}

	isForDeadFriend() {
		return this.checkItemScope([9, 10]);
	}

	isForUser() {
		return this.checkItemScope([11]);
	}

	isForOne() {
		return this.checkItemScope([1, 3, 7, 9, 11]);
	}

	isForRandom() {
		return this.checkItemScope([3, 4, 5, 6]);
	}

	isForAll() {
		return this.checkItemScope([2, 8, 10]);
	}

	needsSelection() {
		return this.checkItemScope([1, 7, 9]);
	}

	numTargets() {
		return this.isForRandom() ? this.item().scope - 2 : 0;
	}

	checkDamageType(list: any) {
		// return list.contains(this.item().damage.type);
		return Utils_.contains(list, this.item().damage.type);
	}

	isHpEffect() {
		return this.checkDamageType([1, 3, 5]);
	}

	isMpEffect() {
		return this.checkDamageType([2, 4, 6]);
	}

	isDamage() {
		return this.checkDamageType([1, 2]);
	}

	isRecover() {
		return this.checkDamageType([3, 4]);
	}

	isDrain() {
		return this.checkDamageType([5, 6]);
	}

	isHpRecover() {
		return this.checkDamageType([3]);
	}

	isMpRecover() {
		return this.checkDamageType([4]);
	}

	isCertainHit() {
		return this.item().hitType === Game_Action.HITTYPE_CERTAIN;
	}

	isPhysical() {
		return this.item().hitType === Game_Action.HITTYPE_PHYSICAL;
	}

	isMagical() {
		return this.item().hitType === Game_Action.HITTYPE_MAGICAL;
	}

	isAttack() {
		return this.item() === $dataSkills_[this.subject().attackSkillId()];
	}

	isGuard() {
		return this.item() === $dataSkills_[this.subject().guardSkillId()];
	}

	isMagicSkill() {
		if (this.isSkill()) {
			return Utils_.contains($dataSystem_.magicSkills, this.item().stypeId);
		} else {
			return false;
		}
	}

	decideRandomTarget() {
		let target;
		if (this.isForDeadFriend()) {
			target = this.friendsUnit().randomDeadTarget();
		} else if (this.isForFriend()) {
			target = this.friendsUnit().randomTarget();
		} else {
			target = this.opponentsUnit().randomTarget();
		}
		if (target) {
			this._targetIndex = target.index();
		} else {
			this.clear();
		}
	}

	setConfusion() {
		this.setAttack();
	}

	prepare() {
		if (this.subject().isConfused() && !this._forcing) {
			this.setConfusion();
		}
	}

	isValid() {
		return (this._forcing && this.item()) || this.subject().canUse(this.item());
	}

	speed() {
		const agi = this.subject().agi;
		let speed = agi + Utils_.randomInt(Math.floor(5 + agi / 4));
		if (this.item()) {
			speed += this.item().speed;
		}
		if (this.isAttack()) {
			speed += this.subject().attackSpeed();
		}
		return speed;
	}

	makeTargets() {
		let targets: Game_Battler[] = [];
		if (!this._forcing && this.subject().isConfused()) {
			targets = [this.confusionTarget()];
		} else if (this.isForOpponent()) {
			targets = this.targetsForOpponents();
		} else if (this.isForFriend()) {
			targets = this.targetsForFriends();
		}
		return this.repeatTargets(targets);
	}

	repeatTargets(targets: Game_Battler[]) {
		const repeatedTargets = [];
		const repeats = this.numRepeats();
		for (let i = 0; i < targets.length; i++) {
			const target = targets[i];
			if (target) {
				for (let j = 0; j < repeats; j++) {
					repeatedTargets.push(target);
				}
			}
		}
		return repeatedTargets;
	}

	confusionTarget() {
		switch (this.subject().confusionLevel()) {
			case 1:
				return this.opponentsUnit().randomTarget();
			case 2:
				if (Utils_.randomInt(2) === 0) {
					return this.opponentsUnit().randomTarget();
				}
				return this.friendsUnit().randomTarget();
			default:
				return this.friendsUnit().randomTarget();
		}
	}

	targetsForOpponents() {
		let targets = [];
		const unit = this.opponentsUnit();
		if (this.isForRandom()) {
			for (let i = 0; i < this.numTargets(); i++) {
				targets.push(unit.randomTarget());
			}
		} else if (this.isForOne()) {
			if (this._targetIndex < 0) {
				targets.push(unit.randomTarget());
			} else {
				targets.push(unit.smoothTarget(this._targetIndex));
			}
		} else {
			targets = unit.aliveMembers();
		}
		return targets;
	}

	targetsForFriends(): Game_Battler[] {
		let targets = [];
		const unit = this.friendsUnit();
		if (this.isForUser()) {
			return [this.subject()];
		} else if (this.isForDeadFriend()) {
			if (this.isForOne()) {
				targets.push(unit.smoothDeadTarget(this._targetIndex));
			} else {
				targets = unit.deadMembers();
			}
		} else if (this.isForOne()) {
			if (this._targetIndex < 0) {
				targets.push(unit.randomTarget());
			} else {
				targets.push(unit.smoothTarget(this._targetIndex));
			}
		} else {
			targets = unit.aliveMembers();
		}
		return targets;
	}

	evaluate(): number {
		let value = 0;
		this.itemTargetCandidates().forEach((target: any) => {
			const targetValue = this.evaluateWithTarget(target);
			if (this.isForAll()) {
				value += targetValue;
			} else if (targetValue > value) {
				value = targetValue;
				this._targetIndex = target.index();
			}
		});
		value *= this.numRepeats();
		if (value > 0) {
			value += g.game.vars.random.generate();
		}
		return value;
	}

	itemTargetCandidates() {
		if (!this.isValid()) {
			return [];
		} else if (this.isForOpponent()) {
			return this.opponentsUnit().aliveMembers();
		} else if (this.isForUser()) {
			return [this.subject()];
		} else if (this.isForDeadFriend()) {
			return this.friendsUnit().deadMembers();
		} else {
			return this.friendsUnit().aliveMembers();
		}
	}

	evaluateWithTarget(target: any) {
		if (this.isHpEffect()) {
			const value = this.makeDamageValue(target, false);
			if (this.isForOpponent()) {
				return value / Math.max(target.hp, 1);
			} else {
				const recovery = Math.min(-value, target.mhp - target.hp);
				return recovery / target.mhp;
			}
		}
	}

	testApply(target: any) {
		return (
			this.isForDeadFriend() === target.isDead() &&
			($gameParty_.inBattle() ||
				this.isForOpponent() ||
				(this.isHpRecover() && target.hp < target.mhp) ||
				(this.isMpRecover() && target.mp < target.mmp) ||
				this.hasItemAnyValidEffects(target))
		);
	}

	hasItemAnyValidEffects(target: any) {
		return this.item().effects.some((effect: any) => {
			return this.testItemEffect(target, effect);
		});
	}

	testItemEffect(target: any, effect: any) {
		switch (effect.code) {
			case Game_Action.EFFECT_RECOVER_HP:
				return target.hp < target.mhp || effect.value1 < 0 || effect.value2 < 0;
			case Game_Action.EFFECT_RECOVER_MP:
				return target.mp < target.mmp || effect.value1 < 0 || effect.value2 < 0;
			case Game_Action.EFFECT_ADD_STATE:
				return !target.isStateAffected(effect.dataId);
			case Game_Action.EFFECT_REMOVE_STATE:
				return target.isStateAffected(effect.dataId);
			case Game_Action.EFFECT_ADD_BUFF:
				return !target.isMaxBuffAffected(effect.dataId);
			case Game_Action.EFFECT_ADD_DEBUFF:
				return !target.isMaxDebuffAffected(effect.dataId);
			case Game_Action.EFFECT_REMOVE_BUFF:
				return target.isBuffAffected(effect.dataId);
			case Game_Action.EFFECT_REMOVE_DEBUFF:
				return target.isDebuffAffected(effect.dataId);
			case Game_Action.EFFECT_LEARN_SKILL:
				return target.isActor() && !target.isLearnedSkill(effect.dataId);
			default:
				return true;
		}
	}

	itemCnt(target: any) {
		if (this.isPhysical() && target.canMove()) {
			return target.cnt;
		} else {
			return 0;
		}
	}

	itemMrf(target: any) {
		if (this.isMagical()) {
			return target.mrf;
		} else {
			return 0;
		}
	}

	itemHit(_target: any) {
		if (this.isPhysical()) {
			return this.item().successRate * 0.01 * this.subject().hit;
		} else {
			return this.item().successRate * 0.01;
		}
	}

	itemEva(target: any) {
		if (this.isPhysical()) {
			return target.eva;
		} else if (this.isMagical()) {
			return target.mev;
		} else {
			return 0;
		}
	}

	itemCri(target: any) {
		return this.item().damage.critical ? this.subject().cri * (1 - target.cev) : 0;
	}

	apply(target: any) {
		const result = target.result();
		this.subject().clearResult();
		result.clear();
		result.used = this.testApply(target);
		result.missed = result.used && g.game.vars.random.generate() >= this.itemHit(target);
		result.evaded = !result.missed && g.game.vars.random.generate() < this.itemEva(target);
		result.physical = this.isPhysical();
		result.drain = this.isDrain();
		if (result.isHit()) {
			if (this.item().damage.type > 0) {
				result.critical = g.game.vars.random.generate() < this.itemCri(target);
				const value = this.makeDamageValue(target, result.critical);
				this.executeDamage(target, value);
			}
			this.item().effects.forEach((effect: any) => {
				this.applyItemEffect(target, effect);
			});
			this.applyItemUserEffect(target);
		}
	}

	makeDamageValue(target: any, critical: boolean): number {
		const item = this.item();
		const baseValue = this.evalDamageFormula(target);
		let value = baseValue * this.calcElementRate(target);
		if (this.isPhysical()) {
			value *= target.pdr;
		}
		if (this.isMagical()) {
			value *= target.mdr;
		}
		if (baseValue < 0) {
			value *= target.rec;
		}
		if (critical) {
			value = this.applyCritical(value);
		}
		value = this.applyVariance(value, item.damage.variance);
		value = this.applyGuard(value, target);
		value = Math.round(value);
		return value;
	}

	evalDamageFormula(target: any): number {
		try {
			const item = this.item();
			// これらの変数は戦闘時に後述のeval内にて利用される
			/* eslint-disable @typescript-eslint/no-unused-vars */
			const a = this.subject();
			const b = target;
			const v = $gameVariables_._data;
			/* eslint-enable @typescript-eslint/no-unused-vars */
			// const sign = ([3, 4].contains(item.damage.type) ? -1 : 1);
			const sign = [3, 4].indexOf(item.damage.type) >= 0 ? -1 : 1;
			// eslint-disable-next-line no-eval
			let value = Math.max(eval(item.damage.formula), 0) * sign;
			if (isNaN(value)) value = 0;
			return value;
		} catch (e) {
			console.error(e);
			return 0;
		}
	}

	calcElementRate(target: any) {
		if (this.item().damage.elementId < 0) {
			return this.elementsMaxRate(target, this.subject().attackElements());
		} else {
			return target.elementRate(this.item().damage.elementId);
		}
	}

	elementsMaxRate(target: any, elements: any[]) {
		if (elements.length > 0) {
			return Math.max.apply(
				null,
				elements.map((elementId: number) => {
					return target.elementRate(elementId);
				})
			);
		} else {
			return 1;
		}
	}

	applyCritical(damage: number): number {
		return damage * 3;
	}

	applyVariance(damage: number, variance: number): number {
		const amp = Math.floor(Math.max((Math.abs(damage) * variance) / 100, 0));
		const v = Utils_.randomInt(amp + 1) + Utils_.randomInt(amp + 1) - amp;
		return damage >= 0 ? damage + v : damage - v;
	}

	applyGuard(damage: number, target: any): number {
		return damage / (damage > 0 && target.isGuard() ? 2 * target.grd : 1);
	}

	executeDamage(target: any, value: number) {
		const result = target.result();
		if (value === 0) {
			result.critical = false;
		}
		if (this.isHpEffect()) {
			this.executeHpDamage(target, value);
		}
		if (this.isMpEffect()) {
			this.executeMpDamage(target, value);
		}
	}

	executeHpDamage(target: any, value: number) {
		if (this.isDrain()) {
			value = Math.min(target.hp, value);
		}
		this.makeSuccess(target);
		target.gainHp(-value);
		if (value > 0) {
			target.onDamage(value);
		}
		this.gainDrainedHp(value);
	}

	executeMpDamage(target: any, value: number) {
		if (!this.isMpRecover()) {
			value = Math.min(target.mp, value);
		}
		if (value !== 0) {
			this.makeSuccess(target);
		}
		target.gainMp(-value);
		this.gainDrainedMp(value);
	}

	gainDrainedHp(value: number) {
		if (this.isDrain()) {
			let gainTarget = this.subject();
			if (this._reflectionTarget !== undefined) {
				gainTarget = this._reflectionTarget;
			}
			gainTarget.gainHp(value);
		}
	}

	gainDrainedMp(value: number) {
		if (this.isDrain()) {
			let gainTarget = this.subject();
			if (this._reflectionTarget !== undefined) {
				gainTarget = this._reflectionTarget;
			}
			gainTarget.gainMp(value);
		}
	}

	applyItemEffect(target: any, effect: any) {
		switch (effect.code) {
			case Game_Action.EFFECT_RECOVER_HP:
				this.itemEffectRecoverHp(target, effect);
				break;
			case Game_Action.EFFECT_RECOVER_MP:
				this.itemEffectRecoverMp(target, effect);
				break;
			case Game_Action.EFFECT_GAIN_TP:
				this.itemEffectGainTp(target, effect);
				break;
			case Game_Action.EFFECT_ADD_STATE:
				this.itemEffectAddState(target, effect);
				break;
			case Game_Action.EFFECT_REMOVE_STATE:
				this.itemEffectRemoveState(target, effect);
				break;
			case Game_Action.EFFECT_ADD_BUFF:
				this.itemEffectAddBuff(target, effect);
				break;
			case Game_Action.EFFECT_ADD_DEBUFF:
				this.itemEffectAddDebuff(target, effect);
				break;
			case Game_Action.EFFECT_REMOVE_BUFF:
				this.itemEffectRemoveBuff(target, effect);
				break;
			case Game_Action.EFFECT_REMOVE_DEBUFF:
				this.itemEffectRemoveDebuff(target, effect);
				break;
			case Game_Action.EFFECT_SPECIAL:
				this.itemEffectSpecial(target, effect);
				break;
			case Game_Action.EFFECT_GROW:
				this.itemEffectGrow(target, effect);
				break;
			case Game_Action.EFFECT_LEARN_SKILL:
				this.itemEffectLearnSkill(target, effect);
				break;
			case Game_Action.EFFECT_COMMON_EVENT:
				this.itemEffectCommonEvent(target, effect);
				break;
		}
	}

	itemEffectRecoverHp(target: any, effect: any) {
		let value = (target.mhp * effect.value1 + effect.value2) * target.rec;
		if (this.isItem()) {
			value *= this.subject().pha;
		}
		value = Math.floor(value);
		if (value !== 0) {
			target.gainHp(value);
			this.makeSuccess(target);
		}
	}

	itemEffectRecoverMp(target: any, effect: any) {
		let value = (target.mmp * effect.value1 + effect.value2) * target.rec;
		if (this.isItem()) {
			value *= this.subject().pha;
		}
		value = Math.floor(value);
		if (value !== 0) {
			target.gainMp(value);
			this.makeSuccess(target);
		}
	}

	itemEffectGainTp(target: any, effect: any) {
		const value = Math.floor(effect.value1);
		if (value !== 0) {
			target.gainTp(value);
			this.makeSuccess(target);
		}
	}

	itemEffectAddState(target: any, effect: any) {
		if (effect.dataId === 0) {
			this.itemEffectAddAttackState(target, effect);
		} else {
			this.itemEffectAddNormalState(target, effect);
		}
	}

	itemEffectAddAttackState(target: any, effect: any) {
		this.subject()
			.attackStates()
			.forEach((stateId: any) => {
				let chance = effect.value1;
				chance *= target.stateRate(stateId);
				chance *= this.subject().attackStatesRate(stateId);
				chance *= this.lukEffectRate(target);
				if (g.game.vars.random.generate() < chance) {
					target.addState(stateId);
					this.makeSuccess(target);
				}
			}, target);
	}

	itemEffectAddNormalState(target: any, effect: any) {
		let chance = effect.value1;
		if (!this.isCertainHit()) {
			chance *= target.stateRate(effect.dataId);
			chance *= this.lukEffectRate(target);
		}
		if (g.game.vars.random.generate() < chance) {
			target.addState(effect.dataId);
			this.makeSuccess(target);
		}
	}

	itemEffectRemoveState(target: any, effect: any) {
		const chance = effect.value1;
		if (g.game.vars.random.generate() < chance) {
			target.removeState(effect.dataId);
			this.makeSuccess(target);
		}
	}

	itemEffectAddBuff(target: any, effect: any) {
		target.addBuff(effect.dataId, effect.value1);
		this.makeSuccess(target);
	}

	itemEffectAddDebuff(target: any, effect: any) {
		const chance = target.debuffRate(effect.dataId) * this.lukEffectRate(target);
		if (g.game.vars.random.generate() < chance) {
			target.addDebuff(effect.dataId, effect.value1);
			this.makeSuccess(target);
		}
	}

	itemEffectRemoveBuff(target: any, effect: any) {
		if (target.isBuffAffected(effect.dataId)) {
			target.removeBuff(effect.dataId);
			this.makeSuccess(target);
		}
	}

	itemEffectRemoveDebuff(target: any, effect: any) {
		if (target.isDebuffAffected(effect.dataId)) {
			target.removeBuff(effect.dataId);
			this.makeSuccess(target);
		}
	}

	itemEffectSpecial(target: any, effect: any) {
		if (effect.dataId === Game_Action.SPECIAL_EFFECT_ESCAPE) {
			target.escape();
			this.makeSuccess(target);
		}
	}

	itemEffectGrow(target: any, effect: any) {
		target.addParam(effect.dataId, Math.floor(effect.value1));
		this.makeSuccess(target);
	}

	itemEffectLearnSkill(target: any, effect: any) {
		if (target.isActor()) {
			target.learnSkill(effect.dataId);
			this.makeSuccess(target);
		}
	}

	itemEffectCommonEvent(_target: any, _effect: any) {
		//
	}

	makeSuccess(target: any) {
		target.result().success = true;
	}

	applyItemUserEffect(_target: any) {
		const value = Math.floor(this.item().tpGain * this.subject().tcr);
		this.subject().gainSilentTp(value);
	}

	lukEffectRate(target: any) {
		return Math.max(1.0 + (this.subject().luk - target.luk) * 0.001, 0.0);
	}

	applyGlobal() {
		this.item().effects.forEach((effect: any) => {
			if (effect.code === Game_Action.EFFECT_COMMON_EVENT) {
				$gameTemp_.reserveCommonEvent(effect.dataId);
			}
		});
	}
}
