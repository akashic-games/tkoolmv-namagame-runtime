import { Window_Command } from "./WindowCommand";

export class Window_HorzCommand extends Window_Command {
	constructor(...args: any[]) {
		super(...args);
	}

	initialize(...args: any[]): void {
		const x = args[0];
		const y = args[1];
		super.initialize(x, y);
	}

	numVisibleRows(): number {
		return 1;
	}

	maxCols(): number {
		return 4;
	}

	itemTextAlign(): string {
		return "center";
	}
}
