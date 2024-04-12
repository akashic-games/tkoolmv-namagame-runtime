import { DataManager } from "../managers/DataManager";
import { $gameSystem, $gameParty, $dataSystem } from "../managers/globals";
import { TextManager } from "../managers/TextManager";
import { Window_Command } from "./WindowCommand";

export class Window_MenuCommand extends Window_Command {
	static _lastCommandSymbol: any = null;

	static initCommandPosition() {
		this._lastCommandSymbol = null;
	}

	constructor(...args: any[]) {
		super(...args);
	}

	initialize(x: number, y: number) {
		super.initialize(x, y);
		this.selectLast();
	}

	windowWidth() {
		return 240;
	}

	numVisibleRows() {
		return this.maxItems();
	}

	makeCommandList() {
		this.addMainCommands();
		this.addFormationCommand();
		this.addOriginalCommands();
		// オプション機能とセーブ機能は非サポート要件なので、コメントアウト
		// this.addOptionsCommand();
		// this.addSaveCommand();
		this.addGameEndCommand();
	}

	addMainCommands() {
		const enabled = this.areMainCommandsEnabled();
		if (this.needsCommand("item")) {
			this.addCommand(TextManager.item, "item", enabled);
		}
		if (this.needsCommand("skill")) {
			this.addCommand(TextManager.skill, "skill", enabled);
		}
		if (this.needsCommand("equip")) {
			this.addCommand(TextManager.equip, "equip", enabled);
		}
		if (this.needsCommand("status")) {
			this.addCommand(TextManager.status, "status", enabled);
		}
	}

	addFormationCommand() {
		if (this.needsCommand("formation")) {
			const enabled = this.isFormationEnabled();
			this.addCommand(TextManager.formation, "formation", enabled);
		}
	}

	addOriginalCommands() {
		//
	}

	// オプション機能は非サポート要件なので、コメントアウト
	// addOptionsCommand() {
	// 	if (this.needsCommand("options")) {
	// 		const enabled = this.isOptionsEnabled();
	// 		this.addCommand(TextManager.options, "options", enabled);
	// 	}
	// }

	// セーブ機能は非サポート要件なので、コメントアウト
	// addSaveCommand() {
	// 	if (this.needsCommand("save")) {
	// 		const enabled = this.isSaveEnabled();
	// 		this.addCommand(TextManager.save, "save", enabled);
	// 	}
	// }

	addGameEndCommand() {
		const enabled = this.isGameEndEnabled();
		this.addCommand(TextManager.gameEnd, "gameEnd", enabled);
	}

	needsCommand(name: string) {
		const flags = $dataSystem.menuCommands;
		if (flags) {
			switch (name) {
				case "item":
					return flags[0];
				case "skill":
					return flags[1];
				case "equip":
					return flags[2];
				case "status":
					return flags[3];
				case "formation":
					return flags[4];
				case "save":
					return flags[5];
			}
		}
		return true;
	}

	areMainCommandsEnabled() {
		return $gameParty.exists();
	}

	isFormationEnabled() {
		return $gameParty.size() >= 2 && $gameSystem.isFormationEnabled();
	}

	isOptionsEnabled() {
		return true;
	}

	isSaveEnabled() {
		return !DataManager.isEventTest() && $gameSystem.isSaveEnabled();
	}

	isGameEndEnabled() {
		return true;
	}

	processOk() {
		Window_MenuCommand._lastCommandSymbol = this.currentSymbol();
		Window_Command.prototype.processOk.call(this);
	}

	selectLast() {
		this.selectSymbol(Window_MenuCommand._lastCommandSymbol);
	}
}
