import { $dataSystem, $gameParty, $gamePlayer } from "../managers/globals";
import { Game_Follower } from "./GameFollower";

export class Game_Followers {
	private _visible: any;
	private _gathering: boolean;
	private _data: Game_Follower[];

	constructor() {
		this.initialize();
	}

	initialize() {
		this._visible = $dataSystem.optFollowers;
		this._gathering = false;
		this._data = [];
		for (let i = 1; i < $gameParty.maxBattleMembers(); i++) {
			this._data.push(new Game_Follower(i));
		}
	}

	isVisible() {
		return this._visible;
	}

	show() {
		this._visible = true;
	}

	hide() {
		this._visible = false;
	}

	follower(index: number) {
		return this._data[index];
	}

	forEach(callback: (data: Game_Follower) => void, thisObject?: any) {
		this._data.forEach(callback, thisObject);
	}

	reverseEach(callback: (data: Game_Follower) => void, thisObject?: any) {
		this._data.reverse();
		this._data.forEach(callback, thisObject);
		this._data.reverse();
	}

	refresh() {
		this.forEach(follower => {
			return follower.refresh();
		}, this);
	}

	update() {
		if (this.areGathering()) {
			if (!this.areMoving()) {
				this.updateMove();
			}
			if (this.areGathered()) {
				this._gathering = false;
			}
		}
		this.forEach(follower => {
			follower.update();
		}, this);
	}

	updateMove() {
		for (let i = this._data.length - 1; i >= 0; i--) {
			const precedingCharacter = i > 0 ? this._data[i - 1] : $gamePlayer;
			this._data[i].chaseCharacter(precedingCharacter);
		}
	}

	jumpAll() {
		if ($gamePlayer.isJumping()) {
			for (let i = 0; i < this._data.length; i++) {
				const follower = this._data[i];
				const sx = $gamePlayer.deltaXFrom(follower.x);
				const sy = $gamePlayer.deltaYFrom(follower.y);
				follower.jump(sx, sy);
			}
		}
	}

	synchronize(x: number, y: number, d: number) {
		this.forEach(follower => {
			follower.locate(x, y);
			follower.setDirection(d);
		}, this);
	}

	gather() {
		this._gathering = true;
	}

	areGathering() {
		return this._gathering;
	}

	visibleFollowers() {
		return this._data.filter(follower => {
			return follower.isVisible();
		}, this);
	}

	areMoving() {
		return this.visibleFollowers().some(follower => {
			return follower.isMoving();
		}, this);
	}

	areGathered() {
		return this.visibleFollowers().every(follower => {
			return !follower.isMoving() && follower.pos($gamePlayer.x, $gamePlayer.y);
		}, this);
	}

	isSomeoneCollided(x: number, y: number) {
		return this.visibleFollowers().some(follower => {
			return follower.pos(x, y);
		}, this);
	}
}
