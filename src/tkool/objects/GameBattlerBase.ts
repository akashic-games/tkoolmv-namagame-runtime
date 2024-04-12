import { DataManager } from "../managers/DataManager";
import { $dataStates, $gameParty, $dataSkills } from "../managers/globals";

export class Game_BattlerBase {
	static TRAIT_ELEMENT_RATE: number = 11;
	static TRAIT_DEBUFF_RATE: number = 12;
	static TRAIT_STATE_RATE: number = 13;
	static TRAIT_STATE_RESIST: number = 14;
	static TRAIT_PARAM: number = 21;
	static TRAIT_XPARAM: number = 22;
	static TRAIT_SPARAM: number = 23;
	static TRAIT_ATTACK_ELEMENT: number = 31;
	static TRAIT_ATTACK_STATE: number = 32;
	static TRAIT_ATTACK_SPEED: number = 33;
	static TRAIT_ATTACK_TIMES: number = 34;
	static TRAIT_STYPE_ADD: number = 41;
	static TRAIT_STYPE_SEAL: number = 42;
	static TRAIT_SKILL_ADD: number = 43;
	static TRAIT_SKILL_SEAL: number = 44;
	static TRAIT_EQUIP_WTYPE: number = 51;
	static TRAIT_EQUIP_ATYPE: number = 52;
	static TRAIT_EQUIP_LOCK: number = 53;
	static TRAIT_EQUIP_SEAL: number = 54;
	static TRAIT_SLOT_TYPE: number = 55;
	static TRAIT_ACTION_PLUS: number = 61;
	static TRAIT_SPECIAL_FLAG: number = 62;
	static TRAIT_COLLAPSE_TYPE: number = 63;
	static TRAIT_PARTY_ABILITY: number = 64;
	static FLAG_ID_AUTO_BATTLE: number = 0;
	static FLAG_ID_GUARD: number = 1;
	static FLAG_ID_SUBSTITUTE: number = 2;
	static FLAG_ID_PRESERVE_TP: number = 3;
	static ICON_BUFF_START: number = 32;
	static ICON_DEBUFF_START: number = 48;

	private _hp: number;
	private _mp: number;
	private _tp: number;
	private _hidden: boolean;
	private _paramPlus: number[];
	private _states: any[];
	private _stateTurns: any;
	private _buffs: number[];
	private _buffTurns: number[];

	constructor(...args: any[]) {
		if (Object.getPrototypeOf(this) === Game_BattlerBase.prototype) {
			this.initialize(args);
		}
	}

	get hp() {
		return this._hp;
	}
	get mp() {
		return this._mp;
	}
	get tp() {
		return this._tp;
	}
	get mhp() {
		return this.param(0);
	}
	get mmp() {
		return this.param(1);
	}
	get atk() {
		return this.param(2);
	}
	get def() {
		return this.param(3);
	}
	get mat() {
		return this.param(4);
	}
	get mdf() {
		return this.param(5);
	}
	get agi() {
		return this.param(6);
	}
	get luk() {
		return this.param(7);
	}
	get hit() {
		return this.xparam(0);
	}
	get eva() {
		return this.xparam(1);
	}
	get cri() {
		return this.xparam(2);
	}
	get cev() {
		return this.xparam(3);
	}
	get mev() {
		return this.xparam(4);
	}
	get mrf() {
		return this.xparam(5);
	}
	get cnt() {
		return this.xparam(6);
	}
	get hrg() {
		return this.xparam(7);
	}
	get mrg() {
		return this.xparam(8);
	}
	get trg() {
		return this.xparam(9);
	}
	get tgr() {
		return this.sparam(0);
	}
	get grd() {
		return this.sparam(1);
	}
	get rec() {
		return this.sparam(2);
	}
	get pha() {
		return this.sparam(3);
	}
	get mcr() {
		return this.sparam(4);
	}
	get tcr() {
		return this.sparam(5);
	}
	get pdr() {
		return this.sparam(6);
	}
	get mdr() {
		return this.sparam(7);
	}
	get fdr() {
		return this.sparam(8);
	}
	get exr() {
		return this.sparam(9);
	}

	initialize(..._args: any[]) {
		this.initMembers();
	}

	initMembers() {
		this._hp = 1;
		this._mp = 0;
		this._tp = 0;
		this._hidden = false;
		this.clearParamPlus();
		this.clearStates();
		this.clearBuffs();
	}

	clearParamPlus() {
		this._paramPlus = [0, 0, 0, 0, 0, 0, 0, 0];
	}

	clearStates() {
		this._states = [];
		this._stateTurns = {};
	}

	eraseState(stateId: number) {
		const index = this._states.indexOf(stateId);
		if (index >= 0) {
			this._states.splice(index, 1);
		}
		delete this._stateTurns[stateId];
	}

	isStateAffected(stateId: number): boolean {
		// return this._states.contains(stateId);
		return this._states.indexOf(stateId) >= 0;
	}

	isDeathStateAffected() {
		return this.isStateAffected(this.deathStateId());
	}

	deathStateId() {
		return 1;
	}

	resetStateCounts(stateId: number) {
		const state = $dataStates[stateId];
		const variance = 1 + Math.max(state.maxTurns - state.minTurns, 0);
		this._stateTurns[stateId] = state.minTurns + Math.floor(variance * g.game.vars.random.generate());
	}

	isStateExpired(stateId: number) {
		return this._stateTurns[stateId] === 0;
	}

	updateStateTurns() {
		this._states.forEach((stateId: number) => {
			if (this._stateTurns[stateId] > 0) {
				this._stateTurns[stateId]--;
			}
		});
	}

	clearBuffs() {
		this._buffs = [0, 0, 0, 0, 0, 0, 0, 0];
		this._buffTurns = [0, 0, 0, 0, 0, 0, 0, 0];
	}

	eraseBuff(paramId: number) {
		this._buffs[paramId] = 0;
		this._buffTurns[paramId] = 0;
	}

	buffLength() {
		return this._buffs.length;
	}

	buff(paramId: number) {
		return this._buffs[paramId];
	}

	isBuffAffected(paramId: number) {
		return this._buffs[paramId] > 0;
	}

	isDebuffAffected(paramId: number) {
		return this._buffs[paramId] < 0;
	}

	isBuffOrDebuffAffected(paramId: number) {
		return this._buffs[paramId] !== 0;
	}

	isMaxBuffAffected(paramId: number) {
		return this._buffs[paramId] === 2;
	}

	isMaxDebuffAffected(paramId: number) {
		return this._buffs[paramId] === -2;
	}

	increaseBuff(paramId: number) {
		if (!this.isMaxBuffAffected(paramId)) {
			this._buffs[paramId]++;
		}
	}

	decreaseBuff(paramId: number) {
		if (!this.isMaxDebuffAffected(paramId)) {
			this._buffs[paramId]--;
		}
	}

	overwriteBuffTurns(paramId: number, turns: number) {
		if (this._buffTurns[paramId] < turns) {
			this._buffTurns[paramId] = turns;
		}
	}

	isBuffExpired(paramId: number) {
		return this._buffTurns[paramId] === 0;
	}

	updateBuffTurns() {
		for (let i = 0; i < this._buffTurns.length; i++) {
			if (this._buffTurns[i] > 0) {
				this._buffTurns[i]--;
			}
		}
	}

	die() {
		this._hp = 0;
		this.clearStates();
		this.clearBuffs();
	}

	revive() {
		if (this._hp === 0) {
			this._hp = 1;
		}
	}

	states() {
		return this._states.map(id => {
			return $dataStates[id];
		});
	}

	stateIcons(): number[] {
		// NOTE: SpriteStateIconから number[] と推測
		return this.states()
			.map(state => {
				return state.iconIndex;
			})
			.filter(iconIndex => {
				return iconIndex > 0;
			});
	}

	buffIcons() {
		const icons = [];
		for (let i = 0; i < this._buffs.length; i++) {
			if (this._buffs[i] !== 0) {
				icons.push(this.buffIconIndex(this._buffs[i], i));
			}
		}
		return icons;
	}

	buffIconIndex(buffLevel: number, paramId: number) {
		if (buffLevel > 0) {
			return Game_BattlerBase.ICON_BUFF_START + (buffLevel - 1) * 8 + paramId;
		} else if (buffLevel < 0) {
			return Game_BattlerBase.ICON_DEBUFF_START + (-buffLevel - 1) * 8 + paramId;
		} else {
			return 0;
		}
	}

	allIcons() {
		return this.stateIcons().concat(this.buffIcons());
	}

	traitObjects() {
		// Returns an array of the all objects having traits. States only here.
		return this.states();
	}

	allTraits() {
		return this.traitObjects().reduce((r, obj) => {
			return r.concat(obj.traits);
		}, []);
	}

	traits(code: number) {
		return this.allTraits().filter((trait: any) => {
			return trait.code === code;
		});
	}

	traitsWithId(code: number, id: number) {
		return this.allTraits().filter((trait: any) => {
			return trait.code === code && trait.dataId === id;
		});
	}

	traitsPi(code: number, id: number) {
		return this.traitsWithId(code, id).reduce((r: number, trait: any) => {
			return r * trait.value;
		}, 1);
	}

	traitsSum(code: number, id: number) {
		return this.traitsWithId(code, id).reduce((r: number, trait: any) => {
			return r + trait.value;
		}, 0);
	}

	traitsSumAll(code: number): number {
		return this.traits(code).reduce((r: number, trait: any) => {
			return r + trait.value;
		}, 0);
	}

	traitsSet(code: number): number[] {
		return this.traits(code).reduce(
			(r: any, trait: any) => {
				return r.concat(trait.dataId);
			},
			[] // (optional) コールバックの最初の呼び出しのとき最初の引数になる
		);
	}

	paramBase(_paramId: number) {
		return 0;
	}

	paramPlus(paramId: number) {
		return this._paramPlus[paramId];
	}

	paramMin(paramId: number) {
		if (paramId === 1) {
			return 0; // MMP
		} else {
			return 1;
		}
	}

	paramMax(paramId: number) {
		if (paramId === 0) {
			return 999999; // MHP
		} else if (paramId === 1) {
			return 9999; // MMP
		} else {
			return 999;
		}
	}

	paramRate(paramId: number) {
		return this.traitsPi(Game_BattlerBase.TRAIT_PARAM, paramId);
	}

	paramBuffRate(paramId: number) {
		return this._buffs[paramId] * 0.25 + 1.0;
	}

	param(paramId: number) {
		let value = this.paramBase(paramId) + this.paramPlus(paramId);
		value *= this.paramRate(paramId) * this.paramBuffRate(paramId);
		const maxValue = this.paramMax(paramId);
		const minValue = this.paramMin(paramId);
		// return Math.round(value.clamp(minValue, maxValue));
		return Math.round(Math.min(maxValue, Math.max(value, minValue)));
	}

	xparam(xparamId: number) {
		return this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);
	}

	sparam(sparamId: number) {
		return this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);
	}

	elementRate(elementId: number) {
		return this.traitsPi(Game_BattlerBase.TRAIT_ELEMENT_RATE, elementId);
	}

	debuffRate(paramId: number) {
		return this.traitsPi(Game_BattlerBase.TRAIT_DEBUFF_RATE, paramId);
	}

	stateRate(stateId: number) {
		return this.traitsPi(Game_BattlerBase.TRAIT_STATE_RATE, stateId);
	}

	stateResistSet() {
		return this.traitsSet(Game_BattlerBase.TRAIT_STATE_RESIST);
	}

	isStateResist(stateId: number) {
		// return this.stateResistSet().contains(stateId);
		return this.stateResistSet().indexOf(stateId) >= 0;
	}

	attackElements() {
		return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_ELEMENT);
	}

	attackStates() {
		return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_STATE);
	}

	attackStatesRate(stateId: number) {
		return this.traitsSum(Game_BattlerBase.TRAIT_ATTACK_STATE, stateId);
	}

	attackSpeed() {
		return this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_SPEED);
	}

	attackTimesAdd() {
		return Math.max(this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_TIMES), 0);
	}

	addedSkillTypes() {
		return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_ADD);
	}

	isSkillTypeSealed(stypeId: number) {
		// return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_SEAL).contains(stypeId);
		return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_SEAL).indexOf(stypeId) >= 0;
	}

	addedSkills() {
		return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_ADD);
	}

	isSkillSealed(skillId: number) {
		// return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_SEAL).contains(skillId);
		return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_SEAL).indexOf(skillId) >= 0;
	}

	isEquipWtypeOk(wtypeId: number) {
		// return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_WTYPE).contains(wtypeId);
		return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_WTYPE).indexOf(wtypeId) >= 0;
	}

	isEquipAtypeOk(atypeId: number) {
		// return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_ATYPE).contains(atypeId);
		return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_ATYPE).indexOf(atypeId) >= 0;
	}

	isEquipTypeLocked(etypeId: number) {
		// return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_LOCK).contains(etypeId);
		return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_LOCK).indexOf(etypeId) >= 0;
	}

	isEquipTypeSealed(etypeId: number) {
		// return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_SEAL).contains(etypeId);
		return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_SEAL).indexOf(etypeId) >= 0;
	}

	slotType() {
		const set = this.traitsSet(Game_BattlerBase.TRAIT_SLOT_TYPE);
		return set.length > 0 ? Math.max.apply(null, set) : 0;
	}

	isDualWield() {
		return this.slotType() === 1;
	}

	actionPlusSet() {
		return this.traits(Game_BattlerBase.TRAIT_ACTION_PLUS).map((trait: any) => {
			return trait.value;
		});
	}

	specialFlag(flagId: number) {
		return this.traits(Game_BattlerBase.TRAIT_SPECIAL_FLAG).some((trait: any) => {
			return trait.dataId === flagId;
		});
	}

	collapseType() {
		const set = this.traitsSet(Game_BattlerBase.TRAIT_COLLAPSE_TYPE);
		return set.length > 0 ? Math.max.apply(null, set) : 0;
	}

	partyAbility(abilityId: number) {
		return this.traits(Game_BattlerBase.TRAIT_PARTY_ABILITY).some((trait: any) => {
			return trait.dataId === abilityId;
		});
	}

	isAutoBattle() {
		return this.specialFlag(Game_BattlerBase.FLAG_ID_AUTO_BATTLE);
	}

	isGuard() {
		return this.specialFlag(Game_BattlerBase.FLAG_ID_GUARD) && this.canMove();
	}

	isSubstitute() {
		return this.specialFlag(Game_BattlerBase.FLAG_ID_SUBSTITUTE) && this.canMove();
	}

	isPreserveTp() {
		return this.specialFlag(Game_BattlerBase.FLAG_ID_PRESERVE_TP);
	}

	addParam(paramId: number, value: number) {
		this._paramPlus[paramId] += value;
		this.refresh();
	}

	setHp(hp: number) {
		this._hp = hp;
		this.refresh();
	}

	setMp(mp: number) {
		this._mp = mp;
		this.refresh();
	}

	setTp(tp: number) {
		this._tp = tp;
		this.refresh();
	}

	maxTp() {
		return 100;
	}

	refresh() {
		this.stateResistSet().forEach((stateId: number) => {
			this.eraseState(stateId);
		});
		this._hp = /* this._hp.clamp(0, this.mhp)*/ Math.min(this.mhp, Math.max(this._hp, 0));
		this._mp = /* this._mp.clamp(0, this.mmp)*/ Math.min(this.mmp, Math.max(this._mp, 0));
		this._tp = /* this._tp.clamp(0, this.maxTp())*/ Math.min(this.maxTp(), Math.max(this._tp, 0));
	}

	recoverAll() {
		this.clearStates();
		this._hp = this.mhp;
		this._mp = this.mmp;
	}

	hpRate() {
		return this.hp / this.mhp;
	}

	mpRate() {
		return this.mmp > 0 ? this.mp / this.mmp : 0;
	}

	tpRate() {
		return this.tp / this.maxTp();
	}

	hide() {
		this._hidden = true;
	}

	appear() {
		this._hidden = false;
	}

	isHidden() {
		return this._hidden;
	}

	isAppeared() {
		return !this.isHidden();
	}

	isDead() {
		return this.isAppeared() && this.isDeathStateAffected();
	}

	isAlive() {
		return this.isAppeared() && !this.isDeathStateAffected();
	}

	isDying() {
		return this.isAlive() && this._hp < this.mhp / 4;
	}

	isRestricted() {
		return this.isAppeared() && this.restriction() > 0;
	}

	canInput() {
		return this.isAppeared() && !this.isRestricted() && !this.isAutoBattle();
	}

	canMove() {
		return this.isAppeared() && this.restriction() < 4;
	}

	isConfused() {
		return this.isAppeared() && this.restriction() >= 1 && this.restriction() <= 3;
	}

	confusionLevel() {
		return this.isConfused() ? this.restriction() : 0;
	}

	isActor() {
		return false;
	}

	isEnemy() {
		return false;
	}

	sortStates() {
		this._states.sort((a, b) => {
			const p1 = $dataStates[a].priority;
			const p2 = $dataStates[b].priority;
			if (p1 !== p2) {
				return p2 - p1;
			}
			return a - b;
		});
	}

	restriction() {
		return Math.max.apply(
			null,
			this.states()
				.map(state => {
					return state.restriction;
				})
				.concat(0)
		);
	}

	addNewState(stateId: number) {
		if (stateId === this.deathStateId()) {
			this.die();
		}
		const restricted = this.isRestricted();
		this._states.push(stateId);
		this.sortStates();
		if (!restricted && this.isRestricted()) {
			this.onRestrict();
		}
	}

	onRestrict() {
		//
	}

	mostImportantStateText() {
		const states = this.states();
		for (let i = 0; i < states.length; i++) {
			if (states[i].message3) {
				return states[i].message3;
			}
		}
		return "";
	}

	stateMotionIndex() {
		const states = this.states();
		if (states.length > 0) {
			return states[0].motion;
		} else {
			return 0;
		}
	}

	stateOverlayIndex() {
		const states = this.states();
		if (states.length > 0) {
			return states[0].overlay;
		} else {
			return 0;
		}
	}

	isSkillWtypeOk(_skill: any) {
		return true;
	}

	skillMpCost(skill: any) {
		return Math.floor(skill.mpCost * this.mcr);
	}

	skillTpCost(skill: any) {
		return skill.tpCost;
	}

	canPaySkillCost(skill: any) {
		return this._tp >= this.skillTpCost(skill) && this._mp >= this.skillMpCost(skill);
	}

	paySkillCost(skill: any) {
		this._mp -= this.skillMpCost(skill);
		this._tp -= this.skillTpCost(skill);
	}

	isOccasionOk(item: any) {
		if ($gameParty.inBattle()) {
			return item.occasion === 0 || item.occasion === 1;
		} else {
			return item.occasion === 0 || item.occasion === 2;
		}
	}

	meetsUsableItemConditions(item: any) {
		return this.canMove() && this.isOccasionOk(item);
	}

	meetsSkillConditions(skill: any) {
		return (
			this.meetsUsableItemConditions(skill) &&
			this.isSkillWtypeOk(skill) &&
			this.canPaySkillCost(skill) &&
			!this.isSkillSealed(skill.id) &&
			!this.isSkillTypeSealed(skill.stypeId)
		);
	}

	meetsItemConditions(item: any) {
		return this.meetsUsableItemConditions(item) && $gameParty.hasItem(item);
	}

	canUse(item: any) {
		if (!item) {
			return false;
		} else if (DataManager.isSkill(item)) {
			return this.meetsSkillConditions(item);
		} else if (DataManager.isItem(item)) {
			return this.meetsItemConditions(item);
		} else {
			return false;
		}
	}

	canEquip(item: any) {
		if (!item) {
			return false;
		} else if (DataManager.isWeapon(item)) {
			return this.canEquipWeapon(item);
		} else if (DataManager.isArmor(item)) {
			return this.canEquipArmor(item);
		} else {
			return false;
		}
	}

	canEquipWeapon(item: any) {
		return this.isEquipWtypeOk(item.wtypeId) && !this.isEquipTypeSealed(item.etypeId);
	}

	canEquipArmor(item: any) {
		return this.isEquipAtypeOk(item.atypeId) && !this.isEquipTypeSealed(item.etypeId);
	}

	attackSkillId() {
		return 1;
	}

	guardSkillId() {
		return 2;
	}

	canAttack() {
		return this.canUse($dataSkills[this.attackSkillId()]);
	}

	canGuard() {
		return this.canUse($dataSkills[this.guardSkillId()]);
	}
}
