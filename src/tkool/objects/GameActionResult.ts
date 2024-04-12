import { $dataStates } from "../managers/globals";

export class Game_ActionResult {
	used: boolean;
	missed: boolean;
	evaded: boolean;
	physical: boolean;
	drain: boolean;
	critical: boolean;
	success: boolean;
	hpAffected: boolean;
	hpDamage: number;
	mpDamage: number;
	tpDamage: number;
	addedStates: any[];
	removedStates: any[];
	addedBuffs: any[];
	addedDebuffs: any[];
	removedBuffs: any[];

	constructor() {
		this.initialize();
	}

	initialize() {
		this.clear();
	}

	clear() {
		this.used = false;
		this.missed = false;
		this.evaded = false;
		this.physical = false;
		this.drain = false;
		this.critical = false;
		this.success = false;
		this.hpAffected = false;
		this.hpDamage = 0;
		this.mpDamage = 0;
		this.tpDamage = 0;
		this.addedStates = [];
		this.removedStates = [];
		this.addedBuffs = [];
		this.addedDebuffs = [];
		this.removedBuffs = [];
	}

	addedStateObjects() {
		return this.addedStates.map((id: number) => {
			return $dataStates[id];
		});
	}

	removedStateObjects() {
		return this.removedStates.map((id: number) => {
			return $dataStates[id];
		});
	}

	isStatusAffected() {
		return (
			this.addedStates.length > 0 ||
			this.removedStates.length > 0 ||
			this.addedBuffs.length > 0 ||
			this.addedDebuffs.length > 0 ||
			this.removedBuffs.length > 0
		);
	}

	isHit() {
		return this.used && !this.missed && !this.evaded;
	}

	isStateAdded(stateId: number) {
		// return this.addedStates.contains(stateId);
		return this.addedStates.indexOf(stateId) >= 0;
	}

	pushAddedState(stateId: number) {
		if (!this.isStateAdded(stateId)) {
			this.addedStates.push(stateId);
		}
	}

	isStateRemoved(stateId: number) {
		// return this.removedStates.contains(stateId);
		return this.removedStates.indexOf(stateId) >= 0;
	}

	pushRemovedState(stateId: number) {
		if (!this.isStateRemoved(stateId)) {
			this.removedStates.push(stateId);
		}
	}

	isBuffAdded(paramId: number) {
		// return this.addedBuffs.contains(paramId);
		return this.addedBuffs.indexOf(paramId) >= 0;
	}

	pushAddedBuff(paramId: number) {
		if (!this.isBuffAdded(paramId)) {
			this.addedBuffs.push(paramId);
		}
	}

	isDebuffAdded(paramId: number) {
		// return this.addedDebuffs.contains(paramId);
		return this.addedDebuffs.indexOf(paramId) >= 0;
	}

	pushAddedDebuff(paramId: number) {
		if (!this.isDebuffAdded(paramId)) {
			this.addedDebuffs.push(paramId);
		}
	}

	isBuffRemoved(paramId: number) {
		// return this.removedBuffs.contains(paramId);
		return this.removedBuffs.indexOf(paramId) >= 0;
	}

	pushRemovedBuff(paramId: number) {
		if (!this.isBuffRemoved(paramId)) {
			this.removedBuffs.push(paramId);
		}
	}
}
