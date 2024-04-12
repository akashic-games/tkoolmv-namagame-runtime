import type { Rectangle } from "../core/Rectangle";
import { DataManager } from "../managers/DataManager";
import { TextManager } from "../managers/TextManager";
import { Window_Selectable } from "./WindowSelectable";

export class Window_SavefileList extends Window_Selectable {
	private _mode: string;

	initialize(x: number, y: number, width: number, height: number) {
		Window_Selectable.prototype.initialize.call(this, x, y, width, height);
		this.activate();
		this._mode = null;
	}

	setMode(mode: string) {
		this._mode = mode;
	}

	maxItems() {
		return DataManager.maxSavefiles();
	}

	maxVisibleItems() {
		return 5;
	}

	itemHeight() {
		const innerHeight = this.height - this.padding * 2;
		return Math.floor(innerHeight / this.maxVisibleItems());
	}

	drawItem(index: number) {
		const id = index + 1;
		const valid = DataManager.isThisGameFile(id);
		const info = DataManager.loadSavefileInfo(id);
		const rect = this.itemRectForText(index);
		this.resetTextColor();
		if (this._mode === "load") {
			this.changePaintOpacity(valid);
		}
		this.drawFileId(id, rect.x, rect.y);
		if (info) {
			this.changePaintOpacity(valid);
			this.drawContents(info, rect, valid);
			this.changePaintOpacity(true);
		}
	}

	drawFileId(id: number, x: number, y: number) {
		this.drawText(TextManager.file + " " + id, x, y, 180);
	}

	drawContents(info: any, rect: Rectangle, valid: boolean) {
		const bottom = rect.y + rect.height;
		if (rect.width >= 420) {
			this.drawGameTitle(info, rect.x + 192, rect.y, rect.width - 192);
			if (valid) {
				this.drawPartyCharacters(info, rect.x + 220, bottom - 4);
			}
		}
		const lineHeight = this.lineHeight();
		const y2 = bottom - lineHeight;
		if (y2 >= lineHeight) {
			this.drawPlaytime(info, rect.x, y2, rect.width);
		}
	}

	drawGameTitle(info: any, x: number, y: number, width: number) {
		if (info.title) {
			this.drawText(info.title, x, y, width);
		}
	}

	drawPartyCharacters(info: any, x: number, y: number) {
		if (info.characters) {
			for (let i = 0; i < info.characters.length; i++) {
				const data = info.characters[i];
				this.drawCharacter(data[0], data[1], x + i * 48, y);
			}
		}
	}

	drawPlaytime(info: any, x: number, y: number, width: number) {
		if (info.playtime) {
			this.drawText(info.playtime, x, y, width, "right");
		}
	}

	playOkSound() {
		//
	}
}
