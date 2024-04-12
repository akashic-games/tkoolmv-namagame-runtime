import { Graphics } from "../core/Graphics";
import { TouchInput } from "../core/TouchInput";
import { Utils } from "../core/Utils";
import { BattleManager } from "../managers/BattleManager";
import {
	$dataSystem,
	$gameParty,
	$gameMap,
	$gameTemp,
	$gameMessage,
	$gameSystem,
	$dataTroops,
	set$gamePlayerFactory
} from "../managers/globals";
import { Game_Character } from "./GameCharacter";
import { Game_Followers } from "./GameFollowers";

function randomInt(max: number) {
	return Math.floor(max * g.game.vars.random.generate());
}

export class Game_Player extends Game_Character {
	private _vehicleType: string;
	private _vehicleGettingOn: boolean;
	private _vehicleGettingOff: boolean;
	private _dashing: boolean;
	private _needsMapReload: boolean;
	private _transferring: boolean;
	private _newMapId: number;
	private _newX: number;
	private _newY: number;
	private _newDirection: number;
	private _fadeType: number;
	private _followers: Game_Followers;
	private _encounterCount: number;

	constructor() {
		super();
		if (Object.getPrototypeOf(this) === Game_Player.prototype) {
			this.initialize();
		}
	}

	initialize() {
		super.initialize();
		this.setTransparent($dataSystem.optTransparent);
	}

	initMembers() {
		super.initMembers();
		this._vehicleType = "walk";
		this._vehicleGettingOn = false;
		this._vehicleGettingOff = false;
		this._dashing = false;
		this._needsMapReload = false;
		this._transferring = false;
		this._newMapId = 0;
		this._newX = 0;
		this._newY = 0;
		this._newDirection = 0;
		this._fadeType = 0;
		this._followers = new Game_Followers();
		this._encounterCount = 0;
	}

	clearTransferInfo() {
		this._transferring = false;
		this._newMapId = 0;
		this._newX = 0;
		this._newY = 0;
		this._newDirection = 0;
	}

	followers() {
		return this._followers;
	}

	refresh() {
		const actor = $gameParty.leader();
		const characterName = actor ? actor.characterName() : "";
		const characterIndex = actor ? actor.characterIndex() : 0;
		this.setImage(characterName, characterIndex);
		this._followers.refresh();
	}

	isStopping() {
		if (this._vehicleGettingOn || this._vehicleGettingOff) {
			return false;
		}
		return Game_Character.prototype.isStopping.call(this);
	}

	reserveTransfer(mapId: number, x: number, y: number, d?: number, fadeType?: number) {
		this._transferring = true;
		this._newMapId = mapId;
		this._newX = x;
		this._newY = y;
		this._newDirection = d;
		this._fadeType = fadeType;
	}

	requestMapReload() {
		this._needsMapReload = true;
	}

	isTransferring() {
		return this._transferring;
	}

	newMapId() {
		return this._newMapId;
	}

	fadeType() {
		return this._fadeType;
	}

	performTransfer() {
		if (this.isTransferring()) {
			this.setDirection(this._newDirection);
			if (this._newMapId !== $gameMap.mapId() || this._needsMapReload) {
				$gameMap.setup(this._newMapId);
				this._needsMapReload = false;
			}
			this.locate(this._newX, this._newY);
			this.refresh();
			this.clearTransferInfo();
		}
	}

	isMapPassable(x: number, y: number, d: number): boolean {
		const vehicle = this.vehicle();
		if (vehicle) {
			return vehicle.isMapPassable(x, y, d);
		} else {
			return Game_Character.prototype.isMapPassable.call(this, x, y, d);
		}
	}

	vehicle(): any {
		return $gameMap.vehicle(this._vehicleType);
	}

	isInBoat(): boolean {
		return this._vehicleType === "boat";
	}

	isInShip(): boolean {
		return this._vehicleType === "ship";
	}

	isInAirship(): boolean {
		return this._vehicleType === "airship";
	}

	isInVehicle(): boolean {
		return this.isInBoat() || this.isInShip() || this.isInAirship();
	}

	isNormal(): boolean {
		return this._vehicleType === "walk" && !this.isMoveRouteForcing();
	}

	isDashing(): boolean {
		return this._dashing;
	}

	isDebugThrough(): boolean {
		// return Input.isPressed("control") && $gameTemp.isPlaytest();
		return false;
	}

	isCollided(x: number, y: number): boolean {
		if (this.isThrough()) {
			return false;
		} else {
			return this.pos(x, y) || this._followers.isSomeoneCollided(x, y);
		}
	}

	centerX(): number {
		return (Graphics.width / $gameMap.tileWidth() - 1) / 2.0;
	}

	centerY(): number {
		return (Graphics.height / $gameMap.tileHeight() - 1) / 2.0;
	}

	center(x: number, y: number) {
		return $gameMap.setDisplayPos(x - this.centerX(), y - this.centerY());
	}

	locate(x: number, y: number) {
		super.locate(x, y);
		this.center(x, y);
		this.makeEncounterCount();
		if (this.isInVehicle()) {
			this.vehicle().refresh();
		}
		this._followers.synchronize(x, y, this.direction());
	}

	increaseSteps() {
		super.increaseSteps();
		if (this.isNormal()) {
			$gameParty.increaseSteps();
		}
	}

	makeEncounterCount() {
		const n = $gameMap.encounterStep();
		this._encounterCount = randomInt(n) + randomInt(n) + 1;
	}

	makeEncounterTroopId(): number {
		const encounterList: any[] = [];
		let weightSum = 0;
		$gameMap.encounterList().forEach((encounter: any) => {
			if (this.meetsEncounterConditions(encounter)) {
				encounterList.push(encounter);
				weightSum += encounter.weight;
			}
		});
		if (weightSum > 0) {
			let value = randomInt(weightSum);
			for (let i = 0; i < encounterList.length; i++) {
				value -= encounterList[i].weight;
				if (value < 0) {
					return encounterList[i].troopId;
				}
			}
		}
		return 0;
	}

	meetsEncounterConditions(encounter: any): boolean {
		return encounter.regionSet.length === 0 || Utils.contains(encounter.regionSet, this.regionId());
	}

	executeEncounter() {
		if (!$gameMap.isEventRunning() && this._encounterCount <= 0) {
			this.makeEncounterCount();
			const troopId = this.makeEncounterTroopId();
			if ($dataTroops[troopId]) {
				BattleManager.setup(troopId, true, false);
				BattleManager.onEncounter();
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	startMapEvent(x: number, y: number, triggers: any, normal: any) {
		if (!$gameMap.isEventRunning()) {
			$gameMap.eventsXy(x, y).forEach((event: any) => {
				if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
					event.start();
				}
			});
		}
	}

	moveByInput() {
		if (!this.isMoving() && this.canMove()) {
			let direction = this.getInputDirection();
			if (direction > 0) {
				$gameTemp.clearDestination();
			} else if ($gameTemp.isDestinationValid()) {
				const x = $gameTemp.destinationX();
				const y = $gameTemp.destinationY();
				direction = this.findDirectionTo(x, y);
			}
			if (direction > 0) {
				this.executeMove(direction);
			}
		}
	}

	canMove() {
		if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
			return false;
		}
		if (this.isMoveRouteForcing() || this.areFollowersGathering()) {
			return false;
		}
		if (this._vehicleGettingOn || this._vehicleGettingOff) {
			return false;
		}
		if (this.isInVehicle() && !this.vehicle().canMove()) {
			return false;
		}
		return true;
	}

	getInputDirection(): number {
		// return Input.dir4;
		return 0;
	}

	executeMove(direction: number) {
		this.moveStraight(direction);
	}

	update(sceneActive?: boolean) {
		const lastScrolledX = this.scrolledX();
		const lastScrolledY = this.scrolledY();
		const wasMoving = this.isMoving();
		this.updateDashing();
		if (sceneActive) {
			this.moveByInput();
		}
		super.update();
		this.updateScroll(lastScrolledX, lastScrolledY);
		this.updateVehicle();
		if (!this.isMoving()) {
			this.updateNonmoving(wasMoving);
		}
		this._followers.update();
	}

	updateDashing() {
		if (this.isMoving()) {
			return;
		}
		if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()) {
			this._dashing = this.isDashButtonPressed() || $gameTemp.isDestinationValid();
		} else {
			this._dashing = false;
		}
	}

	isDashButtonPressed(): boolean {
		// const shift = Input.isPressed("shift");
		// if (ConfigManager.alwaysDash) {
		// 	return !shift;
		// } else {
		// 	return shift;
		// }
		return false;
	}

	updateScroll(lastScrolledX: number, lastScrolledY: number) {
		const x1 = lastScrolledX;
		const y1 = lastScrolledY;
		const x2 = this.scrolledX();
		const y2 = this.scrolledY();
		if (y2 > y1 && y2 > this.centerY()) {
			$gameMap.scrollDown(y2 - y1);
		}
		if (x2 < x1 && x2 < this.centerX()) {
			$gameMap.scrollLeft(x1 - x2);
		}
		if (x2 > x1 && x2 > this.centerX()) {
			$gameMap.scrollRight(x2 - x1);
		}
		if (y2 < y1 && y2 < this.centerY()) {
			$gameMap.scrollUp(y1 - y2);
		}
	}

	updateVehicle() {
		if (this.isInVehicle() && !this.areFollowersGathering()) {
			if (this._vehicleGettingOn) {
				this.updateVehicleGetOn();
			} else if (this._vehicleGettingOff) {
				this.updateVehicleGetOff();
			} else {
				this.vehicle().syncWithPlayer();
			}
		}
	}

	updateVehicleGetOn() {
		if (!this.areFollowersGathering() && !this.isMoving()) {
			this.setDirection(this.vehicle().direction());
			this.setMoveSpeed(this.vehicle().moveSpeed());
			this._vehicleGettingOn = false;
			this.setTransparent(true);
			if (this.isInAirship()) {
				this.setThrough(true);
			}
			this.vehicle().getOn();
		}
	}

	updateVehicleGetOff() {
		if (!this.areFollowersGathering() && this.vehicle().isLowest()) {
			this._vehicleGettingOff = false;
			this._vehicleType = "walk";
			this.setTransparent(false);
		}
	}

	updateNonmoving(wasMoving: boolean) {
		if (!$gameMap.isEventRunning()) {
			if (wasMoving) {
				$gameParty.onPlayerWalk();
				this.checkEventTriggerHere([1, 2]);
				if ($gameMap.setupStartingEvent()) {
					return;
				}
			}
			if (this.triggerAction()) {
				return;
			}
			if (wasMoving) {
				this.updateEncounterCount();
			} else {
				$gameTemp.clearDestination();
			}
		}
	}

	triggerAction(): boolean {
		if (this.canMove()) {
			if (this.triggerButtonAction()) {
				return true;
			}
			if (this.triggerTouchAction()) {
				return true;
			}
		}
		return false;
	}

	triggerButtonAction(): boolean {
		// if (Input.isTriggered("ok")) {
		// 	if (this.getOnOffVehicle()) {
		// 		return true;
		// 	}
		// 	this.checkEventTriggerHere([0]);
		// 	if ($gameMap.setupStartingEvent()) {
		// 		return true;
		// 	}
		// 	this.checkEventTriggerThere([0, 1, 2]);
		// 	if ($gameMap.setupStartingEvent()) {
		// 		return true;
		// 	}
		// }
		return false;
	}

	triggerTouchAction(): boolean {
		if ($gameTemp.isDestinationValid()) {
			const direction = this.direction();
			const x1 = this.x;
			const y1 = this.y;
			const x2 = $gameMap.roundXWithDirection(x1, direction);
			const y2 = $gameMap.roundYWithDirection(y1, direction);
			const x3 = $gameMap.roundXWithDirection(x2, direction);
			const y3 = $gameMap.roundYWithDirection(y2, direction);
			const destX = $gameTemp.destinationX();
			const destY = $gameTemp.destinationY();
			if (destX === x1 && destY === y1) {
				return this.triggerTouchActionD1(x1, y1);
			} else if (destX === x2 && destY === y2) {
				return this.triggerTouchActionD2(x2, y2);
			} else if (destX === x3 && destY === y3) {
				return this.triggerTouchActionD3(x2, y2);
			}
		}
		return false;
	}

	triggerTouchActionD1(x1: number, y1: number) {
		if ($gameMap.airship().pos(x1, y1)) {
			if (TouchInput.isTriggered() && this.getOnOffVehicle()) {
				return true;
			}
		}
		this.checkEventTriggerHere([0]);
		return $gameMap.setupStartingEvent();
	}

	triggerTouchActionD2(x2: number, y2: number) {
		if ($gameMap.boat().pos(x2, y2) || $gameMap.ship().pos(x2, y2)) {
			if (TouchInput.isTriggered() && this.getOnVehicle()) {
				return true;
			}
		}
		if (this.isInBoat() || this.isInShip()) {
			if (TouchInput.isTriggered() && this.getOffVehicle()) {
				return true;
			}
		}
		this.checkEventTriggerThere([0, 1, 2]);
		return $gameMap.setupStartingEvent();
	}

	triggerTouchActionD3(x2: number, y2: number) {
		if ($gameMap.isCounter(x2, y2)) {
			this.checkEventTriggerThere([0, 1, 2]);
		}
		return $gameMap.setupStartingEvent();
	}

	updateEncounterCount() {
		if (this.canEncounter()) {
			this._encounterCount -= this.encounterProgressValue();
		}
	}

	canEncounter() {
		return (
			!$gameParty.hasEncounterNone() &&
			$gameSystem.isEncounterEnabled() &&
			!this.isInAirship() &&
			!this.isMoveRouteForcing() &&
			!this.isDebugThrough()
		);
	}

	encounterProgressValue() {
		let value = $gameMap.isBush(this.x, this.y) ? 2 : 1;
		if ($gameParty.hasEncounterHalf()) {
			value *= 0.5;
		}
		if (this.isInShip()) {
			value *= 0.5;
		}
		return value;
	}

	checkEventTriggerHere(triggers: any) {
		if (this.canStartLocalEvents()) {
			this.startMapEvent(this.x, this.y, triggers, false);
		}
	}

	checkEventTriggerThere(triggers: any) {
		if (this.canStartLocalEvents()) {
			const direction = this.direction();
			const x1 = this.x;
			const y1 = this.y;
			const x2 = $gameMap.roundXWithDirection(x1, direction);
			const y2 = $gameMap.roundYWithDirection(y1, direction);
			this.startMapEvent(x2, y2, triggers, true);
			if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2)) {
				const x3 = $gameMap.roundXWithDirection(x2, direction);
				const y3 = $gameMap.roundYWithDirection(y2, direction);
				this.startMapEvent(x3, y3, triggers, true);
			}
		}
	}

	checkEventTriggerTouch(x: number, y: number): boolean {
		if (this.canStartLocalEvents()) {
			this.startMapEvent(x, y, [1, 2], true);
		}
		return false; // 基底クラスはfalseを返しているので追加
	}

	canStartLocalEvents(): boolean {
		return !this.isInAirship();
	}

	getOnOffVehicle(): boolean {
		if (this.isInVehicle()) {
			return this.getOffVehicle();
		} else {
			return this.getOnVehicle();
		}
	}

	getOnVehicle(): boolean {
		const direction = this.direction();
		const x1 = this.x;
		const y1 = this.y;
		const x2 = $gameMap.roundXWithDirection(x1, direction);
		const y2 = $gameMap.roundYWithDirection(y1, direction);
		if ($gameMap.airship().pos(x1, y1)) {
			this._vehicleType = "airship";
		} else if ($gameMap.ship().pos(x2, y2)) {
			this._vehicleType = "ship";
		} else if ($gameMap.boat().pos(x2, y2)) {
			this._vehicleType = "boat";
		}
		if (this.isInVehicle()) {
			this._vehicleGettingOn = true;
			if (!this.isInAirship()) {
				this.forceMoveForward();
			}
			this.gatherFollowers();
		}
		return this._vehicleGettingOn;
	}

	getOffVehicle(): boolean {
		if (this.vehicle().isLandOk(this.x, this.y, this.direction())) {
			if (this.isInAirship()) {
				this.setDirection(2);
			}
			this._followers.synchronize(this.x, this.y, this.direction());
			this.vehicle().getOff();
			if (!this.isInAirship()) {
				this.forceMoveForward();
				this.setTransparent(false);
			}
			this._vehicleGettingOff = true;
			this.setMoveSpeed(4);
			this.setThrough(false);
			this.makeEncounterCount();
			this.gatherFollowers();
		}
		return this._vehicleGettingOff;
	}

	forceMoveForward() {
		this.setThrough(true);
		this.moveForward();
		this.setThrough(false);
	}

	isOnDamageFloor(): boolean {
		return $gameMap.isDamageFloor(this.x, this.y) && !this.isInAirship();
	}

	moveStraight(d: number) {
		if (this.canPass(this.x, this.y, d)) {
			this._followers.updateMove();
		}
		super.moveStraight(d);
	}

	moveDiagonally(horz: number, vert: number) {
		if (this.canPassDiagonally(this.x, this.y, horz, vert)) {
			this._followers.updateMove();
		}
		super.moveDiagonally(horz, vert);
	}

	jump(xPlus: number, yPlus: number) {
		super.jump(xPlus, yPlus);
		this._followers.jumpAll();
	}

	showFollowers() {
		this._followers.show();
	}

	hideFollowers() {
		this._followers.hide();
	}

	gatherFollowers() {
		this._followers.gather();
	}

	areFollowersGathering(): any {
		return this._followers.areGathering();
	}

	areFollowersGathered(): any {
		return this._followers.areGathered();
	}
}

set$gamePlayerFactory(() => {
	return new Game_Player();
});
