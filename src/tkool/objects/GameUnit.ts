import type { Game_Battler } from "./GameBattler";

export class Game_Unit {
	private _inBattle: boolean;

	constructor() {
		if (Object.getPrototypeOf(this) === Game_Unit.prototype) {
			this.initialize();
		}
	}

	initialize() {
		this._inBattle = false;
	}

	inBattle() {
		return this._inBattle;
	}

	members(): Game_Battler[] {
		return [];
	}

	aliveMembers(): Game_Battler[] {
		return this.members().filter(member => {
			return member.isAlive();
		});
	}

	deadMembers(): Game_Battler[] {
		return this.members().filter(member => {
			return member.isDead();
		});
	}

	movableMembers(): Game_Battler[] {
		return this.members().filter(member => {
			return member.canMove();
		});
	}

	clearActions(): any {
		return this.members().forEach(member => {
			return member.clearActions();
		});
	}

	agility(): number {
		const members = this.members();
		if (members.length === 0) {
			return 1;
		}
		const sum = members.reduce((r, member) => {
			return r + member.agi;
		}, 0);
		return sum / members.length;
	}

	tgrSum(): number {
		return this.aliveMembers().reduce((r, member) => {
			return r + member.tgr;
		}, 0);
	}

	randomTarget(): Game_Battler {
		let tgrRand = g.game.vars.random.generate() * this.tgrSum();
		let target: any = null;
		this.aliveMembers().forEach(member => {
			tgrRand -= member.tgr;
			if (tgrRand <= 0 && !target) {
				target = member;
			}
		});
		return target;
	}

	randomDeadTarget() {
		const members = this.deadMembers();
		if (members.length === 0) {
			return null;
		}
		return members[Math.floor(g.game.vars.random.generate() * members.length)];
	}

	smoothTarget(index: number) {
		if (index < 0) {
			index = 0;
		}
		const member = this.members()[index];
		return member && member.isAlive() ? member : this.aliveMembers()[0];
	}

	smoothDeadTarget(index: number) {
		if (index < 0) {
			index = 0;
		}
		const member = this.members()[index];
		return member && member.isDead() ? member : this.deadMembers()[0];
	}

	clearResults() {
		this.members().forEach(member => {
			member.clearResult();
		});
	}

	onBattleStart() {
		this.members().forEach(member => {
			member.onBattleStart();
		});
		this._inBattle = true;
	}

	onBattleEnd() {
		this._inBattle = false;
		this.members().forEach(member => {
			member.onBattleEnd();
		});
	}

	makeActions() {
		this.members().forEach(member => {
			member.makeActions();
		});
	}

	select(activeMember: any) {
		this.members().forEach(member => {
			if (member === activeMember) {
				member.select();
			} else {
				member.deselect();
			}
		});
	}

	isAllDead() {
		return this.aliveMembers().length === 0;
	}

	substituteBattler() {
		const members = this.members();
		for (let i = 0; i < members.length; i++) {
			if (members[i].isSubstitute()) {
				return members[i];
			}
		}
	}
}
