import { $gameMap, set$gameSelfSwitchesFactory } from "../managers/globals";

export class Game_SelfSwitches {
	private _data: { [key: string]: any };

	constructor() {
		this.initialize();
	}

	initialize() {
		this.clear();
	}

	clear() {
		this._data = {};
	}

	value(key: any) {
		return !!this._data[key];
	}

	setValue(key: any, value: any) {
		if (value) {
			this._data[key] = true;
		} else {
			delete this._data[key];
		}
		this.onChange();
	}

	onChange() {
		$gameMap.requestRefresh();
	}
}

set$gameSelfSwitchesFactory(() => {
	return new Game_SelfSwitches();
});
