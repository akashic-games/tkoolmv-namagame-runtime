import { Graphics } from "../core/Graphics";
import { TouchInput } from "../core/TouchInput";
import { $gameMessage } from "../managers/globals";
import type { TextState } from "./WindowBase";
import { Window_Base } from "./WindowBase";

export class Window_ScrollText extends Window_Base {
	private _text: string;
	private _allTextHeight: number;

	constructor() {
		super();
		// if (Object.getPrototypeOf(this) === Window_ScrollText.prototype) {
		// 	this.initialize();
		// }
	}

	initialize() {
		const width = Graphics.boxWidth;
		const height = Graphics.boxHeight;
		super.initialize(0, 0, width, height);
		this.opacity = 0;
		this.hide();
		this._text = "";
		this._allTextHeight = 0;
	}

	update() {
		super.update();

		if ($gameMessage.scrollMode()) {
			if (this._text) {
				this.updateMessage();
			}
			if (!this._text && $gameMessage.hasText()) {
				this.startMessage();
			}
		}
	}

	startMessage() {
		this._text = $gameMessage.allText();
		this.refresh();
		this.show();
	}

	refresh() {
		// const textState = { index: 0 };
		const textState: TextState = {
			index: 0,
			text: this.convertEscapeCharacters(this._text)
		};
		this.resetFontSettings();
		this._allTextHeight = this.calcTextHeight(textState, true);
		this.createContents();
		this.origin.y = -this.height;
		this.drawTextEx(this._text, this.textPadding(), 1);
	}

	contentsHeight() {
		return Math.max(this._allTextHeight, 1);
	}

	updateMessage() {
		this.origin.y += this.scrollSpeed();
		if (this.origin.y >= this.contents.height) {
			this.terminateMessage();
		}
	}

	scrollSpeed() {
		let speed = $gameMessage.scrollSpeed() / 2;
		if (this.isFastForward()) {
			speed *= this.fastForwardRate();
		}
		return speed;
	}

	isFastForward() {
		if ($gameMessage.scrollNoFast()) {
			return false;
		} else {
			return (
				/* Input.isPressed("ok") || Input.isPressed("shift") ||*/
				TouchInput.isPressed()
			);
		}
	}

	fastForwardRate() {
		return 3;
	}

	terminateMessage() {
		this._text = null;
		$gameMessage.clear();
		this.hide();
	}
}
