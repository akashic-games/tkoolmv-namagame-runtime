import { Graphics } from "../core/Graphics";
import { Window_Base } from "./WindowBase";

export class Window_Help extends Window_Base {
	private _text: string;

	constructor(numLines?: number) {
		super(numLines);
	}

	initialize(numLines: number) {
		const width = Graphics.boxWidth;
		const height = this.fittingHeight(numLines || 2);
		super.initialize(0, 0, width, height);
		this._text = "";
	}

	setText(text: string) {
		if (this._text !== text) {
			this._text = text;
			this.refresh();
		}
	}

	clear() {
		this.setText("");
	}

	setItem(item: any) {
		this.setText(item ? item.description : "");
	}

	refresh() {
		this.contents.clear();
		this.drawTextEx(this._text, this.textPadding(), 0);
	}
}
