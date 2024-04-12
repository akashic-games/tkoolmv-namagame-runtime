import { Graphics } from "../core/Graphics";
import { DataManager } from "../managers/DataManager";
import { TextManager } from "../managers/TextManager";
import { Window_Command } from "./WindowCommand";

export class Window_TitleCommand extends Window_Command {
	static _lastCommandSymbol: string = null;

	static initCommandPosition() {
		this._lastCommandSymbol = null;
	}

	constructor() {
		super();
		// if (Object.getPrototypeOf(this) === Window_TitleCommand.prototype) {
		// 	this.initialize(this.x, this.y);
		// }
	}

	initialize() {
		super.initialize(0, 0);
		this.updatePlacement();
		this.openness = 0;
		this.selectLast();
	}

	windowWidth() {
		return 240;
	}

	updatePlacement() {
		this.x = (Graphics.boxWidth - this.width) / 2;
		this.y = Graphics.boxHeight - this.height - 96;
	}

	makeCommandList() {
		this.addCommand(TextManager.newGame, "newGame");
		this.addCommand(TextManager.continue_, "continue", this.isContinueEnabled());
		this.addCommand(TextManager.options, "options", false); // TODO: オプション機能未実装のため選択不可とするが、実装したら false を外す
	}

	isContinueEnabled() {
		return DataManager.isAnySavefileExists();
	}

	processOk() {
		Window_TitleCommand._lastCommandSymbol = this.currentSymbol();
		super.processOk();
	}

	selectLast() {
		if (Window_TitleCommand._lastCommandSymbol) {
			this.selectSymbol(Window_TitleCommand._lastCommandSymbol);
		} else if (this.isContinueEnabled()) {
			this.selectSymbol("continue");
		}
	}
}
