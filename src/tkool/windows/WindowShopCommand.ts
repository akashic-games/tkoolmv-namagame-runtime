import { TextManager } from "../managers/TextManager";
import { Window_HorzCommand } from "./WindowHorzCommand";

export class Window_ShopCommand extends Window_HorzCommand {
	private _purchaseOnly: boolean;
	private _windowWidth: number;

	initialize(...args: any[]) {
		const width: number = args[0];
		const purchaseOnly: boolean = args[1];
		this._windowWidth = width;
		this._purchaseOnly = purchaseOnly;
		super.initialize(0, 0);
	}

	windowWidth() {
		return this._windowWidth;
	}

	maxCols() {
		return 3;
	}

	makeCommandList() {
		this.addCommand(TextManager.buy, "buy");
		this.addCommand(TextManager.sell, "sell", !this._purchaseOnly);
		this.addCommand(TextManager.cancel, "cancel");
	}
}
