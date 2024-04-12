import { Utils } from "../core/Utils";
import { BattleManager } from "../managers/BattleManager";
import {
	$dataTroops,
	$dataEnemies,
	$gameSystem,
	$gameTroop,
	$gameActors,
	$gameSwitches,
	$gameParty,
	set$gameTroopFactory
} from "../managers/globals";
import { Game_Enemy } from "./GameEnemy";
import { Game_Interpreter } from "./GameInterpreter";
import { Game_Unit } from "./GameUnit";

export class Game_Troop extends Game_Unit {
	static LETTER_TABLE_HALF: string[] = [
		" A",
		" B",
		" C",
		" D",
		" E",
		" F",
		" G",
		" H",
		" I",
		" J",
		" K",
		" L",
		" M",
		" N",
		" O",
		" P",
		" Q",
		" R",
		" S",
		" T",
		" U",
		" V",
		" W",
		" X",
		" Y",
		" Z"
	];
	static LETTER_TABLE_FULL: string[] = [
		"Ａ",
		"Ｂ",
		"Ｃ",
		"Ｄ",
		"Ｅ",
		"Ｆ",
		"Ｇ",
		"Ｈ",
		"Ｉ",
		"Ｊ",
		"Ｋ",
		"Ｌ",
		"Ｍ",
		"Ｎ",
		"Ｏ",
		"Ｐ",
		"Ｑ",
		"Ｒ",
		"Ｓ",
		"Ｔ",
		"Ｕ",
		"Ｖ",
		"Ｗ",
		"Ｘ",
		"Ｙ",
		"Ｚ"
	];

	private _interpreter: Game_Interpreter;
	private _troopId: number;
	private _eventFlags: any;
	private _enemies: Game_Enemy[];
	private _turnCount: number;
	private _namesCount: any;

	constructor() {
		super();
		if (Object.getPrototypeOf(this) === Game_Troop.prototype) {
			this.initialize();
		}
	}

	initialize() {
		Game_Unit.prototype.initialize.call(this);
		this._interpreter = new Game_Interpreter();
		this.clear();
	}

	isEventRunning() {
		return this._interpreter.isRunning();
	}

	updateInterpreter() {
		this._interpreter.update();
	}

	turnCount() {
		return this._turnCount;
	}

	members(): Game_Enemy[] {
		return this._enemies;
	}

	clear() {
		this._interpreter.clear();
		this._troopId = 0;
		this._eventFlags = {};
		this._enemies = [];
		this._turnCount = 0;
		this._namesCount = {};
	}

	troop() {
		return $dataTroops[this._troopId];
	}

	setup(troopId: number) {
		this.clear();
		this._troopId = troopId;
		this._enemies = [];
		this.troop().members.forEach((member: any) => {
			if ($dataEnemies[member.enemyId]) {
				const enemyId = member.enemyId;
				const x = member.x;
				const y = member.y;
				const enemy = new Game_Enemy(enemyId, x, y);
				if (member.hidden) {
					enemy.hide();
				}
				this._enemies.push(enemy);
			}
		});
		this.makeUniqueNames();
	}

	makeUniqueNames() {
		const table = this.letterTable();
		this.members().forEach(enemy => {
			if (enemy.isAlive() && enemy.isLetterEmpty()) {
				const name = enemy.originalName();
				const n = this._namesCount[name] || 0;
				enemy.setLetter(table[n % table.length]);
				this._namesCount[name] = n + 1;
			}
		});
		this.members().forEach(enemy => {
			const name = enemy.originalName();
			if (this._namesCount[name] >= 2) {
				enemy.setPlural(true);
			}
		});
	}

	letterTable() {
		return $gameSystem.isCJK() ? Game_Troop.LETTER_TABLE_FULL : Game_Troop.LETTER_TABLE_HALF;
	}

	enemyNames() {
		const names: string[] = [];
		this.members().forEach(enemy => {
			const name = enemy.originalName();
			if (enemy.isAlive() && !Utils.contains(names, name)) {
				names.push(name);
			}
		});
		return names;
	}

	meetsConditions(page: any) {
		const c = page.conditions;
		if (!c.turnEnding && !c.turnValid && !c.enemyValid && !c.actorValid && !c.switchValid) {
			return false; // Conditions not set
		}
		if (c.turnEnding) {
			if (!BattleManager.isTurnEnd()) {
				return false;
			}
		}
		if (c.turnValid) {
			const n = this._turnCount;
			const a = c.turnA;
			const b = c.turnB;
			if (b === 0 && n !== a) {
				return false;
			}
			if (b > 0 && (n < 1 || n < a || n % b !== a % b)) {
				return false;
			}
		}
		if (c.enemyValid) {
			const enemy = $gameTroop.members()[c.enemyIndex];
			if (!enemy || enemy.hpRate() * 100 > c.enemyHp) {
				return false;
			}
		}
		if (c.actorValid) {
			const actor = $gameActors.actor(c.actorId);
			if (!actor || actor.hpRate() * 100 > c.actorHp) {
				return false;
			}
		}
		if (c.switchValid) {
			if (!$gameSwitches.value(c.switchId)) {
				return false;
			}
		}
		return true;
	}

	setupBattleEvent() {
		if (!this._interpreter.isRunning()) {
			if (this._interpreter.setupReservedCommonEvent()) {
				return;
			}
			const pages = this.troop().pages;
			for (let i = 0; i < pages.length; i++) {
				const page = pages[i];
				if (this.meetsConditions(page) && !this._eventFlags[i]) {
					this._interpreter.setup(page.list);
					if (page.span <= 1) {
						this._eventFlags[i] = true;
					}
					break;
				}
			}
		}
	}

	increaseTurn() {
		const pages = this.troop().pages;
		for (let i = 0; i < pages.length; i++) {
			const page = pages[i];
			if (page.span === 1) {
				this._eventFlags[i] = false;
			}
		}
		this._turnCount++;
	}

	// Game_Troop のメンバは必ず Enemy 。
	// キャストの手間をなくすため。 ex) expTotal()
	deadMembers(): Game_Enemy[] {
		return super.deadMembers() as Game_Enemy[];
	}

	expTotal() {
		return this.deadMembers().reduce((r, enemy) => {
			return r + enemy.exp();
		}, 0);
	}

	goldTotal() {
		return (
			this.deadMembers().reduce((r, enemy) => {
				return r + enemy.gold();
			}, 0) * this.goldRate()
		);
	}

	goldRate() {
		return $gameParty.hasGoldDouble() ? 2 : 1;
	}

	makeDropItems() {
		return this.deadMembers().reduce((r, enemy) => {
			return r.concat(enemy.makeDropItems());
		}, []);
	}
}

set$gameTroopFactory(() => {
	return new Game_Troop();
});
