import { Graphics } from "../core/Graphics";
import { TextManager } from "../managers/TextManager";
import { Window_Command } from "./WindowCommand";

export class Window_GameEnd extends Window_Command {
	constructor(...args: any[]) {
		super(...args);
	}

	initialize(): void {
		super.initialize(0, 0);
		this.updatePlacement();
		this.openness = 0;
		this.open();
	}

	windowWidth(): number {
		return 240;
	}

	updatePlacement(): void {
		this.x = (Graphics.boxWidth - this.width) / 2;
		this.y = (Graphics.boxHeight - this.height) / 2;
	}

	makeCommandList(): void {
		this.addCommand(TextManager.toTitle, "toTitle");
		this.addCommand(TextManager.cancel, "cancel");
	}
}
