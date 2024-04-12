import { Graphics } from "../core/Graphics";
import { TextManager } from "../managers/TextManager";
import { Window_HorzCommand } from "./WindowHorzCommand";
import type { Window_ItemList } from "./WindowItemList";

export class Window_ItemCategory extends Window_HorzCommand {
	_itemWindow: Window_ItemList;

	constructor(...args: any[]) {
		super(...args);
	}

	initialize(): void {
		super.initialize(0, 0);
	}

	windowWidth(): number {
		return Graphics.boxWidth;
	}

	maxCols(): number {
		return 4;
	}

	update(): void {
		super.update();
		if (this._itemWindow) {
			this._itemWindow.setCategory(this.currentSymbol());
		}
	}

	makeCommandList(): void {
		this.addCommand(TextManager.item, "item");
		this.addCommand(TextManager.weapon, "weapon");
		this.addCommand(TextManager.armor, "armor");
		this.addCommand(TextManager.keyItem, "keyItem");
	}

	setItemWindow(itemWindow: Window_ItemList): void {
		this._itemWindow = itemWindow;
	}
}
