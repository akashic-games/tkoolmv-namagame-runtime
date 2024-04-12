import { Utils } from "../core/Utils";
import { DataManager } from "../managers/DataManager";
import {
	$gameActors,
	$dataItems,
	$dataWeapons,
	$dataArmors,
	$dataSystem,
	$gamePlayer,
	$gameMap,
	set$gamePartyFactory
} from "../managers/globals";
import { TextManager } from "../managers/TextManager";
import type { Game_Actor } from "./GameActor";
import { Game_Item } from "./GameItem";
import { Game_Unit } from "./GameUnit";

export class Game_Party extends Game_Unit {
	static ABILITY_ENCOUNTER_HALF: number = 0;
	static ABILITY_ENCOUNTER_NONE: number = 1;
	static ABILITY_CANCEL_SURPRISE: number = 2;
	static ABILITY_RAISE_PREEMPTIVE: number = 3;
	static ABILITY_GOLD_DOUBLE: number = 4;
	static ABILITY_DROP_ITEM_DOUBLE: number = 5;

	private _gold: number;
	private _steps: number;
	private _lastItem: Game_Item;
	private _menuActorId: number;
	private _targetActorId: number;
	private _actors: number[]; // IDの配列の模様
	private _items: any;
	private _weapons: any;
	private _armors: any;

	constructor() {
		super();
		if (Object.getPrototypeOf(this) === Game_Party.prototype) {
			this.initialize();
		}
	}

	initialize() {
		super.initialize();
		this._gold = 0;
		this._steps = 0;
		this._lastItem = new Game_Item();
		this._menuActorId = 0;
		this._targetActorId = 0;
		this._actors = [];
		this.initAllItems();
	}

	initAllItems() {
		this._items = {};
		this._weapons = {};
		this._armors = {};
	}

	exists() {
		return this._actors.length > 0;
	}

	size() {
		return this.members().length;
	}

	isEmpty() {
		return this.size() === 0;
	}

	members(): Game_Actor[] {
		return this.inBattle() ? this.battleMembers() : this.allMembers();
	}

	allMembers() {
		return this._actors.map((id: number) => {
			return $gameActors.actor(id);
		});
	}

	battleMembers() {
		return this.allMembers()
			.slice(0, this.maxBattleMembers())
			.filter(actor => {
				return actor.isAppeared();
			});
	}

	maxBattleMembers() {
		return 4;
	}

	leader() {
		return this.battleMembers()[0];
	}

	reviveBattleMembers() {
		this.battleMembers().forEach(actor => {
			if (actor.isDead()) {
				actor.setHp(1);
			}
		});
	}

	items() {
		const list = [];
		for (const id in this._items) {
			if (this._items.hasOwnProperty(id)) {
				list.push($dataItems[id]);
			}
		}
		return list;
	}

	weapons() {
		const list = [];
		for (const id in this._weapons) {
			if (this._weapons.hasOwnProperty(id)) {
				list.push($dataWeapons[id]);
			}
		}
		return list;
	}

	armors() {
		const list = [];
		for (const id in this._armors) {
			if (this._armors.hasOwnProperty(id)) {
				list.push($dataArmors[id]);
			}
		}
		return list;
	}

	equipItems() {
		return this.weapons().concat(this.armors());
	}

	allItems() {
		return this.items().concat(this.equipItems());
	}

	itemContainer(item: any) {
		if (!item) {
			return null;
		} else if (DataManager.isItem(item)) {
			return this._items;
		} else if (DataManager.isWeapon(item)) {
			return this._weapons;
		} else if (DataManager.isArmor(item)) {
			return this._armors;
		} else {
			return null;
		}
	}

	setupStartingMembers() {
		this._actors = [];
		$dataSystem.partyMembers.forEach((actorId: any) => {
			if ($gameActors.actor(actorId)) {
				this._actors.push(actorId);
			}
		});
	}

	name() {
		const numBattleMembers = this.battleMembers().length;
		if (numBattleMembers === 0) {
			return "";
		} else if (numBattleMembers === 1) {
			return this.leader().name();
		} else {
			return Utils.format(TextManager.partyName, this.leader().name());
		}
	}

	setupBattleTest() {
		this.setupBattleTestMembers();
		this.setupBattleTestItems();
	}

	setupBattleTestMembers() {
		$dataSystem.testBattlers.forEach((battler: any) => {
			const actor = $gameActors.actor(battler.actorId);
			if (actor) {
				actor.changeLevel(battler.level, false);
				actor.initEquips(battler.equips);
				actor.recoverAll();
				this.addActor(battler.actorId);
			}
		});
	}

	setupBattleTestItems() {
		$dataItems.forEach((item: any) => {
			if (item && item.name.length > 0) {
				this.gainItem(item, this.maxItems(item));
			}
		});
	}

	highestLevel() {
		return Math.max.apply(
			null,
			this.members().map(actor => {
				return actor.level;
			})
		);
	}

	addActor(actorId: number) {
		if (/* !this._actors.contains(actorId)*/ this._actors.indexOf(actorId) < 0) {
			this._actors.push(actorId);
			$gamePlayer.refresh();
			$gameMap.requestRefresh();
		}
	}

	removeActor(actorId: number) {
		if (/* this._actors.contains(actorId)*/ this._actors.indexOf(actorId) >= 0) {
			this._actors.splice(this._actors.indexOf(actorId), 1);
			$gamePlayer.refresh();
			$gameMap.requestRefresh();
		}
	}

	gold() {
		return this._gold;
	}

	gainGold(amount: number) {
		this._gold = Utils.clamp(0, Math.min(this._gold + amount), this.maxGold());
	}

	loseGold(amount: number) {
		this.gainGold(-amount);
	}

	maxGold() {
		return 99999999;
	}

	steps() {
		return this._steps;
	}

	increaseSteps() {
		this._steps++;
	}

	numItems(item: any) {
		const container = this.itemContainer(item);
		return container ? container[item.id] || 0 : 0;
	}

	maxItems(_item: any) {
		return 99;
	}

	hasMaxItems(item: any) {
		return this.numItems(item) >= this.maxItems(item);
	}

	hasItem(item: any, includeEquip?: boolean) {
		if (includeEquip === undefined) {
			includeEquip = false;
		}
		if (this.numItems(item) > 0) {
			return true;
		} else if (includeEquip && this.isAnyMemberEquipped(item)) {
			return true;
		} else {
			return false;
		}
	}

	isAnyMemberEquipped(item: any) {
		return this.members().some(actor => {
			return Utils.contains(actor.equips(), item);
		});
	}

	gainItem(item: any, amount?: number, includeEquip?: boolean) {
		const container = this.itemContainer(item);
		if (container) {
			const lastNumber = this.numItems(item);
			const newNumber = lastNumber + amount;
			container[item.id] = Utils.clamp(newNumber, 0, this.maxItems(item));
			if (container[item.id] === 0) {
				delete container[item.id];
			}
			if (includeEquip && newNumber < 0) {
				this.discardMembersEquip(item, -newNumber);
			}
			$gameMap.requestRefresh();
		}
	}

	discardMembersEquip(item: any, amount: number) {
		let n = amount;
		this.members().forEach(actor => {
			while (n > 0 && actor.isEquipped(item)) {
				actor.discardEquip(item);
				n--;
			}
		});
	}

	loseItem(item: any, amount: number, includeEquip?: boolean) {
		this.gainItem(item, -amount, includeEquip);
	}

	consumeItem(item: any) {
		if (DataManager.isItem(item) && item.consumable) {
			this.loseItem(item, 1);
		}
	}

	canUse(item: any): boolean {
		return this.members().some(actor => {
			return actor.canUse(item);
		});
	}

	canInput(): boolean {
		return this.members().some(actor => {
			return actor.canInput();
		});
	}

	isAllDead(): boolean {
		if (/* Game_Unit.prototype.isAllDead.call(this)*/ super.isAllDead()) {
			return this.inBattle() || !this.isEmpty();
		} else {
			return false;
		}
	}

	onPlayerWalk() {
		this.members().forEach(actor => {
			return actor.onPlayerWalk();
		});
	}

	menuActor() {
		let actor = $gameActors.actor(this._menuActorId);
		if (/* !this.members().contains(actor)*/ this.members().indexOf(actor) < 0) {
			actor = this.members()[0];
		}
		return actor;
	}

	setMenuActor(actor: any) {
		this._menuActorId = actor.actorId();
	}

	makeMenuActorNext() {
		let index = this.members().indexOf(this.menuActor());
		if (index >= 0) {
			index = (index + 1) % this.members().length;
			this.setMenuActor(this.members()[index]);
		} else {
			this.setMenuActor(this.members()[0]);
		}
	}

	makeMenuActorPrevious() {
		let index = this.members().indexOf(this.menuActor());
		if (index >= 0) {
			index = (index + this.members().length - 1) % this.members().length;
			this.setMenuActor(this.members()[index]);
		} else {
			this.setMenuActor(this.members()[0]);
		}
	}

	targetActor(): any {
		let actor = $gameActors.actor(this._targetActorId);
		if (/* !this.members().contains(actor)*/ this.members().indexOf(actor) < 0) {
			actor = this.members()[0];
		}
		return actor;
	}

	setTargetActor(actor: any) {
		this._targetActorId = actor.actorId();
	}

	lastItem() {
		return this._lastItem.object();
	}

	setLastItem(item: any) {
		this._lastItem.setObject(item);
	}

	swapOrder(index1: any, index2: any) {
		const temp = this._actors[index1];
		this._actors[index1] = this._actors[index2];
		this._actors[index2] = temp;
		$gamePlayer.refresh();
	}

	charactersForSavefile() {
		return this.battleMembers().map(actor => {
			return [actor.characterName(), actor.characterIndex()];
		});
	}

	facesForSavefile() {
		return this.battleMembers().map(actor => {
			return [actor.faceName(), actor.faceIndex()];
		});
	}

	partyAbility(abilityId: number) {
		return this.battleMembers().some(actor => {
			return actor.partyAbility(abilityId);
		});
	}

	hasEncounterHalf() {
		return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_HALF);
	}

	hasEncounterNone() {
		return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_NONE);
	}

	hasCancelSurprise() {
		return this.partyAbility(Game_Party.ABILITY_CANCEL_SURPRISE);
	}

	hasRaisePreemptive() {
		return this.partyAbility(Game_Party.ABILITY_RAISE_PREEMPTIVE);
	}

	hasGoldDouble() {
		return this.partyAbility(Game_Party.ABILITY_GOLD_DOUBLE);
	}

	hasDropItemDouble() {
		return this.partyAbility(Game_Party.ABILITY_DROP_ITEM_DOUBLE);
	}

	ratePreemptive(troopAgi: number) {
		let rate = this.agility() >= troopAgi ? 0.05 : 0.03;
		if (this.hasRaisePreemptive()) {
			rate *= 4;
		}
		return rate;
	}

	rateSurprise(troopAgi: number) {
		let rate = this.agility() >= troopAgi ? 0.03 : 0.05;
		if (this.hasCancelSurprise()) {
			rate = 0;
		}
		return rate;
	}

	performVictory() {
		this.members().forEach(actor => {
			actor.performVictory();
		});
	}

	performEscape() {
		this.members().forEach(actor => {
			actor.performEscape();
		});
	}

	removeBattleStates() {
		this.members().forEach(actor => {
			actor.removeBattleStates();
		});
	}

	requestMotionRefresh() {
		this.members().forEach(actor => {
			actor.requestMotionRefresh();
		});
	}
}

set$gamePartyFactory(() => {
	return new Game_Party();
});
