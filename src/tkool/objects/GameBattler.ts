import { DataManager } from "../managers/DataManager";
import { $dataStates, $gameParty, $dataSystem } from "../managers/globals";
import { SoundManager } from "../managers/SoundManager";
import { Game_Action } from "./GameAction";
import { Game_ActionResult } from "./GameActionResult";
import { Game_BattlerBase } from "./GameBattlerBase";
import type { Game_Unit } from "./GameUnit";

export abstract class Game_Battler extends Game_BattlerBase {
	_actions: Game_Action[];
	_speed: number;
	_result: Game_ActionResult;
	_actionState: string;
	_lastTargetIndex: number;
	_animations: any[];
	_damagePopup: boolean;
	_effectType: any;
	_motionType: any;
	_weaponImageId: number;
	_motionRefresh: boolean;
	_selected: boolean;

	constructor(...args: any[]) {
		super(...args);
		if (Object.getPrototypeOf(this) === Game_Battler.prototype) {
			this.initialize(args);
		}
	}

	// MVのコードで Game_Battler に(空)実装がなく２つの派生クラス
	// Game_Actor, Game_Enemy で定義されるメソッドがあった。
	// ここで定義するべき抽象メソッドと思える。
	abstract friendsUnit(): Game_Unit;
	abstract index(): number;
	abstract opponentsUnit(): Game_Unit;
	abstract name(): string;
	abstract isSpriteVisible(): boolean;
	abstract isBattleMember(): boolean;

	initialize(...args: any[]) {
		super.initialize(...args);
	}

	initMembers() {
		super.initMembers();
		this._actions = [];
		this._speed = 0;
		this._result = new Game_ActionResult();
		this._actionState = "";
		this._lastTargetIndex = 0;
		this._animations = [];
		this._damagePopup = false;
		this._effectType = null;
		this._motionType = null;
		this._weaponImageId = 0;
		this._motionRefresh = false;
		this._selected = false;
	}

	clearAnimations() {
		this._animations = [];
	}

	clearDamagePopup() {
		this._damagePopup = false;
	}

	clearWeaponAnimation() {
		this._weaponImageId = 0;
	}

	clearEffect() {
		this._effectType = null;
	}

	clearMotion() {
		this._motionType = null;
		this._motionRefresh = false;
	}

	requestEffect(effectType: any) {
		this._effectType = effectType;
	}

	requestMotion(motionType: any) {
		this._motionType = motionType;
	}

	requestMotionRefresh() {
		this._motionRefresh = true;
	}

	select() {
		this._selected = true;
	}

	deselect() {
		this._selected = false;
	}

	isAnimationRequested() {
		return this._animations.length > 0;
	}

	isDamagePopupRequested() {
		return this._damagePopup;
	}

	isEffectRequested() {
		return !!this._effectType;
	}

	isMotionRequested() {
		return !!this._motionType;
	}

	isWeaponAnimationRequested() {
		return this._weaponImageId > 0;
	}

	isMotionRefreshRequested() {
		return this._motionRefresh;
	}

	isSelected() {
		return this._selected;
	}

	effectType() {
		return this._effectType;
	}

	motionType() {
		return this._motionType;
	}

	weaponImageId() {
		return this._weaponImageId;
	}

	shiftAnimation() {
		return this._animations.shift();
	}

	startAnimation(animationId: number, mirror: any, delay: any) {
		const data = { animationId: animationId, mirror: mirror, delay: delay };
		this._animations.push(data);
	}

	startDamagePopup() {
		this._damagePopup = true;
	}

	startWeaponAnimation(weaponImageId: number) {
		this._weaponImageId = weaponImageId;
	}

	action(index: number) {
		return this._actions[index];
	}

	setAction(index: number, action: any) {
		this._actions[index] = action;
	}

	numActions() {
		return this._actions.length;
	}

	clearActions() {
		this._actions = [];
	}

	result() {
		return this._result;
	}

	clearResult() {
		this._result.clear();
	}

	refresh() {
		Game_BattlerBase.prototype.refresh.call(this);
		if (this.hp === 0) {
			this.addState(this.deathStateId());
		} else {
			this.removeState(this.deathStateId());
		}
	}

	addState(stateId: number) {
		if (this.isStateAddable(stateId)) {
			if (!this.isStateAffected(stateId)) {
				this.addNewState(stateId);
				this.refresh();
			}
			this.resetStateCounts(stateId);
			this._result.pushAddedState(stateId);
		}
	}

	isStateAddable(stateId: number) {
		return (
			this.isAlive() &&
			$dataStates[stateId] &&
			!this.isStateResist(stateId) &&
			!this._result.isStateRemoved(stateId) &&
			!this.isStateRestrict(stateId)
		);
	}

	isStateRestrict(stateId: number) {
		return $dataStates[stateId].removeByRestriction && this.isRestricted();
	}

	onRestrict() {
		Game_BattlerBase.prototype.onRestrict.call(this);
		this.clearActions();
		this.states().forEach(state => {
			if (state.removeByRestriction) {
				this.removeState(state.id);
			}
		});
	}

	removeState(stateId: number) {
		if (this.isStateAffected(stateId)) {
			if (stateId === this.deathStateId()) {
				this.revive();
			}
			this.eraseState(stateId);
			this.refresh();
			this._result.pushRemovedState(stateId);
		}
	}

	escape() {
		if ($gameParty.inBattle()) {
			this.hide();
		}
		this.clearActions();
		this.clearStates();
		SoundManager.playEscape();
	}

	addBuff(paramId: number, turns: any) {
		if (this.isAlive()) {
			this.increaseBuff(paramId);
			if (this.isBuffAffected(paramId)) {
				this.overwriteBuffTurns(paramId, turns);
			}
			this._result.pushAddedBuff(paramId);
			this.refresh();
		}
	}

	addDebuff(paramId: number, turns: any) {
		if (this.isAlive()) {
			this.decreaseBuff(paramId);
			if (this.isDebuffAffected(paramId)) {
				this.overwriteBuffTurns(paramId, turns);
			}
			this._result.pushAddedDebuff(paramId);
			this.refresh();
		}
	}

	removeBuff(paramId: number) {
		if (this.isAlive() && this.isBuffOrDebuffAffected(paramId)) {
			this.eraseBuff(paramId);
			this._result.pushRemovedBuff(paramId);
			this.refresh();
		}
	}

	removeBattleStates() {
		this.states().forEach(state => {
			if (state.removeAtBattleEnd) {
				this.removeState(state.id);
			}
		});
	}

	removeAllBuffs() {
		for (let i = 0; i < this.buffLength(); i++) {
			this.removeBuff(i);
		}
	}

	removeStatesAuto(timing: any) {
		this.states().forEach(state => {
			if (this.isStateExpired(state.id) && state.autoRemovalTiming === timing) {
				this.removeState(state.id);
			}
		});
	}

	removeBuffsAuto() {
		for (let i = 0; i < this.buffLength(); i++) {
			if (this.isBuffExpired(i)) {
				this.removeBuff(i);
			}
		}
	}

	removeStatesByDamage() {
		this.states().forEach(state => {
			if (state.removeByDamage && Math.floor(100 * g.game.vars.random.generate()) < state.chanceByDamage) {
				this.removeState(state.id);
			}
		});
	}

	makeActionTimes() {
		return this.actionPlusSet().reduce((r: any, p: any) => {
			return g.game.vars.random.generate() < p ? r + 1 : r;
		}, 1);
	}

	makeActions() {
		this.clearActions();
		if (this.canMove()) {
			const actionTimes = this.makeActionTimes();
			this._actions = [];
			for (let i = 0; i < actionTimes; i++) {
				this._actions.push(new Game_Action(this));
			}
		}
	}

	speed() {
		return this._speed;
	}

	makeSpeed() {
		this._speed =
			Math.min.apply(
				null,
				this._actions.map((action: any) => {
					return action.speed();
				})
			) || 0;
	}

	currentAction() {
		return this._actions[0];
	}

	removeCurrentAction() {
		this._actions.shift();
	}

	setLastTarget(target: any) {
		if (target) {
			this._lastTargetIndex = target.index();
		} else {
			this._lastTargetIndex = 0;
		}
	}

	forceAction(skillId: number, targetIndex: number) {
		this.clearActions();
		const action = new Game_Action(this, true);
		action.setSkill(skillId);
		if (targetIndex === -2) {
			action.setTarget(this._lastTargetIndex);
		} else if (targetIndex === -1) {
			action.decideRandomTarget();
		} else {
			action.setTarget(targetIndex);
		}
		this._actions.push(action);
	}

	useItem(item: any) {
		if (DataManager.isSkill(item)) {
			this.paySkillCost(item);
		} else if (DataManager.isItem(item)) {
			this.consumeItem(item);
		}
	}

	consumeItem(item: any) {
		$gameParty.consumeItem(item);
	}

	gainHp(value: number) {
		this._result.hpDamage = -value;
		this._result.hpAffected = true;
		this.setHp(this.hp + value);
	}

	gainMp(value: number) {
		this._result.mpDamage = -value;
		this.setMp(this.mp + value);
	}

	gainTp(value: number) {
		this._result.tpDamage = -value;
		this.setTp(this.tp + value);
	}

	gainSilentTp(value: number) {
		this.setTp(this.tp + value);
	}

	initTp() {
		this.setTp(Math.floor(25 * g.game.vars.random.generate()));
	}

	clearTp() {
		this.setTp(0);
	}

	chargeTpByDamage(damageRate: number) {
		const value = Math.floor(50 * damageRate * this.tcr);
		this.gainSilentTp(value);
	}

	regenerateHp() {
		let value = Math.floor(this.mhp * this.hrg);
		value = Math.max(value, -this.maxSlipDamage());
		if (value !== 0) {
			this.gainHp(value);
		}
	}

	maxSlipDamage() {
		return $dataSystem.optSlipDeath ? this.hp : Math.max(this.hp - 1, 0);
	}

	regenerateMp() {
		const value = Math.floor(this.mmp * this.mrg);
		if (value !== 0) {
			this.gainMp(value);
		}
	}

	regenerateTp() {
		const value = Math.floor(100 * this.trg);
		this.gainSilentTp(value);
	}

	regenerateAll() {
		if (this.isAlive()) {
			this.regenerateHp();
			this.regenerateMp();
			this.regenerateTp();
		}
	}

	onBattleStart() {
		this.setActionState("undecided");
		this.clearMotion();
		if (!this.isPreserveTp()) {
			this.initTp();
		}
	}

	onAllActionsEnd() {
		this.clearResult();
		this.removeStatesAuto(1);
		this.removeBuffsAuto();
	}

	onTurnEnd() {
		this.clearResult();
		this.regenerateAll();
		// if (!BattleManager.isForcedTurn()) {
		// 	this.updateStateTurns();
		// 	this.updateBuffTurns();
		// }
		this.removeStatesAuto(2);
	}

	onBattleEnd() {
		this.clearResult();
		this.removeBattleStates();
		this.removeAllBuffs();
		this.clearActions();
		if (!this.isPreserveTp()) {
			this.clearTp();
		}
		this.appear();
	}

	onDamage(value: number) {
		this.removeStatesByDamage();
		this.chargeTpByDamage(value / this.mhp);
	}

	setActionState(actionState: any) {
		this._actionState = actionState;
		this.requestMotionRefresh();
	}

	isUndecided() {
		return this._actionState === "undecided";
	}

	isInputting() {
		return this._actionState === "inputting";
	}

	isWaiting() {
		return this._actionState === "waiting";
	}

	isActing() {
		return this._actionState === "acting";
	}

	isChanting() {
		if (this.isWaiting()) {
			return this._actions.some(action => {
				return action.isMagicSkill();
			});
		}
		return false;
	}

	isGuardWaiting() {
		if (this.isWaiting()) {
			return this._actions.some(action => {
				return action.isGuard();
			});
		}
		return false;
	}

	performActionStart(action: Game_Action) {
		if (!action.isGuard()) {
			this.setActionState("acting");
		}
	}

	performAction(_action: Game_Action) {
		//
	}

	performActionEnd() {
		this.setActionState("done");
	}

	performDamage() {
		//
	}

	performMiss() {
		SoundManager.playMiss();
	}

	performRecovery() {
		SoundManager.playRecovery();
	}

	performEvasion() {
		SoundManager.playEvasion();
	}

	performMagicEvasion() {
		SoundManager.playMagicEvasion();
	}

	performCounter() {
		SoundManager.playEvasion();
	}

	performReflection() {
		SoundManager.playReflection();
	}

	performSubstitute(_target: any) {
		//
	}

	performCollapse() {
		//
	}
}
