import { DataManager } from "../managers/DataManager";
import { $gameParty } from "../managers/globals";
import { Game_Action } from "../objects/GameAction";
import { Window_MenuStatus } from "./WindowMenuStatus";

export class Window_MenuActor extends Window_MenuStatus {
	constructor(...args: any[]) {
		super(...args);
	}

	initialize(): void {
		super.initialize(0, 0);
		this.hide();
	}

	processOk(): void {
		if (!this.cursorAll()) {
			$gameParty.setTargetActor($gameParty.members()[this.index()]);
		}
		this.callOkHandler();
	}

	selectLast(): void {
		this.select($gameParty.targetActor().index() || 0);
	}

	selectForItem(item: any): void {
		const actor = $gameParty.menuActor();
		const action = new Game_Action(actor);
		action.setItemObject(item);
		this.setCursorFixed(false);
		this.setCursorAll(false);
		if (action.isForUser()) {
			if (DataManager.isSkill(item)) {
				this.setCursorFixed(true);
				this.select(actor.index());
			} else {
				this.selectLast();
			}
		} else if (action.isForAll()) {
			this.setCursorAll(true);
			this.select(0);
		} else {
			this.selectLast();
		}
	}
}
