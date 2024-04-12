import { BattleManager } from "../managers/BattleManager";
import { set$gameTimerFactory } from "../managers/globals";

export class Game_Timer {
	private _frames: number;
	private _working: boolean;

	constructor() {
		this.initialize();
	}

	initialize() {
		this._frames = 0;
		this._working = false;
	}

	update(sceneActive: boolean) {
		if (sceneActive && this._working && this._frames > 0) {
			this._frames--;
			if (this._frames === 0) {
				this.onExpire();
			}
		}
	}

	start(count: number) {
		this._frames = count;
		this._working = true;
	}

	stop() {
		this._working = false;
	}

	isWorking() {
		return this._working;
	}

	seconds() {
		return Math.floor(this._frames / 60);
	}

	onExpire() {
		BattleManager.abort();
	}
}

set$gameTimerFactory(() => {
	return new Game_Timer();
});
