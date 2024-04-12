import { TextManager } from "../managers/TextManager";
import { Window_HorzCommand } from "./WindowHorzCommand";

export class Window_EquipCommand extends Window_HorzCommand {
	_windowWidth: number;

	constructor(x: number, y: number, width: number) {
		super(x, y, width);
	}

	initialize(x: number, y: number, width: number) {
		this._windowWidth = width;
		super.initialize(x, y);
	}

	windowWidth(): number {
		return this._windowWidth;
	}

	maxCols(): number {
		return 3;
	}

	makeCommandList(): void {
		this.addCommand(TextManager.equip2, "equip");
		this.addCommand(TextManager.optimize, "optimize");
		this.addCommand(TextManager.clear, "clear");
	}
}
