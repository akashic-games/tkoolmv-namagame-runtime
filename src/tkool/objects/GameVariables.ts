import { $dataSystem, $gameMap, set$gameVariablesFactory } from "../managers/globals";

export class Game_Variables {
	_data: number[];

	constructor() {
		this.initialize();
	}

	initialize() {
		this.clear();
	}

	clear() {
		this._data = [];
	}

	value(variableId: number) {
		return this._data[variableId] || 0;
	}

	setValue(variableId: number, value: number) {
		if (variableId > 0 && variableId < $dataSystem.variables.length) {
			if (typeof value === "number") {
				value = Math.floor(value);
			}
			this._data[variableId] = value;
			this.onChange();
		}
	}

	onChange() {
		$gameMap.requestRefresh();
	}
}

set$gameVariablesFactory(() => {
	return new Game_Variables();
});
