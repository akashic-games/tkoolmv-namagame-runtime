import { Graphics } from "../core/Graphics";
import { $gameParty } from "../managers/globals";
import { SceneManager } from "../managers/SceneManager";
import { Window_Gold } from "../windows/WindowGold";
import { Window_MenuCommand } from "../windows/WindowMenuCommand";
import { Window_MenuStatus } from "../windows/WindowMenuStatus";
import { Scene_Equip } from "./SceneEquip";
import { Scene_GameEnd } from "./SceneGameEnd";
import { Scene_Item } from "./SceneItem";
import { Scene_MenuBase } from "./SceneMenuBase";
import { Scene_Skill } from "./SceneSkill";
import { Scene_Status } from "./SceneStatus";

export class Scene_Menu extends Scene_MenuBase {
	_statusWindow: Window_MenuStatus;
	_commandWindow: Window_MenuCommand;
	_goldWindow: Window_Gold;

	constructor() {
		super();
		if (Object.getPrototypeOf(this) === Scene_Menu.prototype) {
			this.initialize();
		}
	}

	initialize(): void {
		super.initialize();
	}

	create(): void {
		Scene_MenuBase.prototype.create.call(this);
		this.createCommandWindow();
		this.createGoldWindow();
		this.createStatusWindow();
	}

	start(): void {
		Scene_MenuBase.prototype.start.call(this);
		this._statusWindow.refresh();
	}

	createCommandWindow(): void {
		this._commandWindow = new Window_MenuCommand(0, 0);
		this._commandWindow.setHandler("item", this.commandItem.bind(this));
		this._commandWindow.setHandler("skill", this.commandPersonal.bind(this));
		this._commandWindow.setHandler("equip", this.commandPersonal.bind(this));
		this._commandWindow.setHandler("status", this.commandPersonal.bind(this));
		this._commandWindow.setHandler("formation", this.commandFormation.bind(this));
		// オプション機能とセーブ機能は非サポート要件なので、コメントアウト
		// this._commandWindow.setHandler("options",   this.commandOptions.bind(this));
		// this._commandWindow.setHandler("save",      this.commandSave.bind(this));
		this._commandWindow.setHandler("gameEnd", this.commandGameEnd.bind(this));
		this._commandWindow.setHandler("cancel", this.popScene.bind(this));
		this.addWindow(this._commandWindow);
	}

	createGoldWindow(): void {
		this._goldWindow = new Window_Gold(0, 0);
		this._goldWindow.y = Graphics.boxHeight - this._goldWindow.height;
		this.addWindow(this._goldWindow);
	}

	createStatusWindow(): void {
		this._statusWindow = new Window_MenuStatus(this._commandWindow.width, 0);
		this._statusWindow.reserveFaceImages();
		this.addWindow(this._statusWindow);
	}

	commandItem(): void {
		SceneManager.push(Scene_Item);
	}

	commandPersonal(): void {
		this._statusWindow.setFormationMode(false);
		this._statusWindow.selectLast();
		this._statusWindow.activate();
		this._statusWindow.setHandler("ok", this.onPersonalOk.bind(this));
		this._statusWindow.setHandler("cancel", this.onPersonalCancel.bind(this));
	}

	commandFormation(): void {
		this._statusWindow.setFormationMode(true);
		this._statusWindow.selectLast();
		this._statusWindow.activate();
		this._statusWindow.setHandler("ok", this.onFormationOk.bind(this));
		this._statusWindow.setHandler("cancel", this.onFormationCancel.bind(this));
	}

	// オプション機能は非サポート要件なのでコメントアウト
	// commandOptions(): void {
	// 	SceneManager.push(Scene_Options);
	// }

	// セーブ機能は非サポート要件なのでコメントアウト
	// commandSave(): void {
	// 	SceneManager.push(Scene_Save);
	// }

	commandGameEnd(): void {
		SceneManager.push(Scene_GameEnd);
	}

	onPersonalOk(): void {
		switch (this._commandWindow.currentSymbol()) {
			case "skill":
				SceneManager.push(Scene_Skill);
				break;
			case "equip":
				SceneManager.push(Scene_Equip);
				break;
			case "status":
				SceneManager.push(Scene_Status);
				break;
		}
	}

	onPersonalCancel(): void {
		this._statusWindow.deselect();
		this._commandWindow.activate();
	}

	onFormationOk(): void {
		const index = this._statusWindow.index();
		// const actor = $gameParty.members()[index];
		const pendingIndex = this._statusWindow.pendingIndex();
		if (pendingIndex >= 0) {
			$gameParty.swapOrder(index, pendingIndex);
			this._statusWindow.setPendingIndex(-1);
			this._statusWindow.redrawItem(index);
		} else {
			this._statusWindow.setPendingIndex(index);
		}
		this._statusWindow.activate();
	}

	onFormationCancel(): void {
		if (this._statusWindow.pendingIndex() >= 0) {
			this._statusWindow.setPendingIndex(-1);
			this._statusWindow.activate();
		} else {
			this._statusWindow.deselect();
			this._commandWindow.activate();
		}
	}
}
