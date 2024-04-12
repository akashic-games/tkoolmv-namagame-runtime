import { $gameParty } from "../managers/globals";
import { TextManager } from "../managers/TextManager";
import { Window_Base } from "./WindowBase";

export class Window_Gold extends Window_Base {
	constructor(x: number, y: number) {
		super(x, y);
		// if (Object.getPrototypeOf(this) === Window_Gold.prototype) {
		// 	this.initialize(param.x, param.y);
		// }
	}

	initialize(x: number, y: number) {
		const width = this.windowWidth();
		const height = this.windowHeight();
		super.initialize(x, y, width, height);
		this.refresh();
	}

	windowWidth() {
		return 240;
	}

	windowHeight() {
		return this.fittingHeight(1);
	}

	refresh() {
		const x = this.textPadding();
		const width = this.contents.width - this.textPadding() * 2;
		this.contents.clear();
		this.drawCurrencyValue(this.value(), this.currencyUnit(), x, 0, width);
	}

	value() {
		return $gameParty.gold();
	}

	currencyUnit() {
		return TextManager.currencyUnit;
	}

	open() {
		this.refresh();
		super.open();
	}
}
