import { Graphics } from "../core/Graphics";
import { $gameParty } from "../managers/globals";
import { ImageManager } from "../managers/ImageManager";
import { Window_Base } from "./WindowBase";
import { Window_Selectable } from "./WindowSelectable";

export class Window_MenuStatus extends Window_Selectable {
	_formationMode: boolean;
	_pendingIndex: number;

	constructor(...args: any[]) {
		super(...args);
	}

	initialize(x: number, y: number): void {
		const width = this.windowWidth();
		const height = this.windowHeight();
		super.initialize(x, y, width, height);
		this._formationMode = false;
		this._pendingIndex = -1;
		this.refresh();
	}

	windowWidth(): number {
		return Graphics.boxWidth - 240;
	}

	windowHeight(): number {
		return Graphics.boxHeight;
	}

	maxItems(): number {
		return $gameParty.size();
	}

	itemHeight(): number {
		const clientHeight = this.height - this.padding * 2;
		return Math.floor(clientHeight / this.numVisibleRows());
	}

	numVisibleRows(): number {
		return 4;
	}

	loadImages(): void {
		$gameParty.members().forEach(actor => {
			ImageManager.reserveFace(actor.faceName());
		});
	}

	drawItem(index: number): void {
		this.drawItemBackground(index);
		this.drawItemImage(index);
		this.drawItemStatus(index);
	}

	drawItemBackground(index: number): void {
		if (index === this._pendingIndex) {
			const rect = this.itemRect(index);
			const color = this.pendingColor();
			this.changePaintOpacity(false);
			this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
			this.changePaintOpacity(true);
		}
	}

	drawItemImage(index: number): void {
		const actor = $gameParty.members()[index];
		const rect = this.itemRect(index);
		this.changePaintOpacity(actor.isBattleMember());
		this.drawActorFace(actor, rect.x + 1, rect.y + 1, Window_Base._faceWidth, Window_Base._faceHeight);
		this.changePaintOpacity(true);
	}

	drawItemStatus(index: number): void {
		const actor = $gameParty.members()[index];
		const rect = this.itemRect(index);
		const x = rect.x + 162;
		const y = rect.y + rect.height / 2 - this.lineHeight() * 1.5;
		const width = rect.width - x - this.textPadding();
		this.drawActorSimpleStatus(actor, x, y, width);
	}

	processOk(): void {
		Window_Selectable.prototype.processOk.call(this);
		$gameParty.setMenuActor($gameParty.members()[this.index()]);
	}

	isCurrentItemEnabled(): boolean {
		if (this._formationMode) {
			const actor = $gameParty.members()[this.index()];
			return actor && actor.isFormationChangeOk();
		} else {
			return true;
		}
	}

	selectLast(): void {
		this.select($gameParty.menuActor().index() || 0);
	}

	formationMode(): boolean {
		return this._formationMode;
	}

	setFormationMode(formationMode: boolean): void {
		this._formationMode = formationMode;
	}

	pendingIndex(): number {
		return this._pendingIndex;
	}

	setPendingIndex(index: number): void {
		const lastPendingIndex = this._pendingIndex;
		this._pendingIndex = index;
		this.redrawItem(this._pendingIndex);
		this.redrawItem(lastPendingIndex);
	}
}
