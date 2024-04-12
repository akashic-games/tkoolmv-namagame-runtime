import { $gameParty } from "../managers/globals";
import { Window_ItemList } from "./WindowItemList";

export class Window_BattleItem extends Window_ItemList {
	constructor(x: number, y: number, width: number, height: number) {
		super(x, y, width, height);
	}

	initialize(x: number, y: number, width: number, height: number) {
		super.initialize(x, y, width, height);
		this.hide();
	}

	includes(item: any) {
		return $gameParty.canUse(item);
	}

	show() {
		this.selectLast();
		this.showHelpWindow();
		super.show();
	}

	hide() {
		this.hideHelpWindow();
		super.hide();
	}
}
