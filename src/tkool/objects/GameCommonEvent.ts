import { $dataCommonEvents, $gameSwitches } from "../managers/globals";
import { Game_Interpreter } from "./GameInterpreter";

export class Game_CommonEvent {
	private _commonEventId: number;
	private _interpreter: Game_Interpreter;

	constructor(commonEventId: number) {
		this.initialize(commonEventId);
	}

	initialize(commonEventId: number) {
		this._commonEventId = commonEventId;
		this.refresh();
	}

	event() {
		return $dataCommonEvents[this._commonEventId];
	}

	list() {
		return this.event().list;
	}

	refresh() {
		if (this.isActive()) {
			if (!this._interpreter) {
				this._interpreter = new Game_Interpreter();
			}
		} else {
			this._interpreter = null;
		}
	}

	isActive() {
		const event = this.event();
		return event.trigger === 2 && $gameSwitches.value(event.switchId);
	}

	update() {
		if (this._interpreter) {
			if (!this._interpreter.isRunning()) {
				this._interpreter.setup(this.list());
			}
			this._interpreter.update();
		}
	}
}
