import { TouchInput } from "../core/TouchInput";
import { DataManager } from "../managers/DataManager";
import { $gameParty } from "../managers/globals";
import { SoundManager } from "../managers/SoundManager";
import { TextManager } from "../managers/TextManager";
import type { Game_Actor } from "../objects/GameActor";
import { Window_Base } from "./WindowBase";

export class Window_ShopStatus extends Window_Base {
	private _item: any;
	private _pageIndex: number;

	initialize(x: number, y: number, width: number, height: number) {
		super.initialize(x, y, width, height);
		this._item = null;
		this._pageIndex = 0;
		this.refresh();
	}

	refresh() {
		this.contents.clear();
		if (this._item) {
			const x = this.textPadding();
			this.drawPossession(x, 0);
			if (this.isEquipItem()) {
				this.drawEquipInfo(x, this.lineHeight() * 2);
			}
		}
	}

	setItem(item: any) {
		this._item = item;
		this.refresh();
	}

	isEquipItem() {
		return DataManager.isWeapon(this._item) || DataManager.isArmor(this._item);
	}

	drawPossession(x: number, y: number) {
		const width = this.contents.width - this.textPadding() - x;
		const possessionWidth = this.textWidth("0000");
		this.changeTextColor(this.systemColor());
		this.drawText(TextManager.possession, x, y, width - possessionWidth);
		this.resetTextColor();
		this.drawText($gameParty.numItems(this._item), x, y, width, "right");
	}

	drawEquipInfo(x: number, y: number) {
		const members = this.statusMembers();
		for (let i = 0; i < members.length; i++) {
			this.drawActorEquipInfo(x, y + this.lineHeight() * (i * 2.4), members[i]);
		}
	}

	statusMembers() {
		const start = this._pageIndex * this.pageSize();
		const end = start + this.pageSize();
		return $gameParty.members().slice(start, end);
	}

	pageSize() {
		return 4;
	}

	maxPages() {
		return Math.floor(($gameParty.size() + this.pageSize() - 1) / this.pageSize());
	}

	drawActorEquipInfo(x: number, y: number, actor: Game_Actor) {
		const enabled = actor.canEquip(this._item);
		this.changePaintOpacity(enabled);
		this.resetTextColor();
		this.drawText(actor.name(), x, y, 168);
		const item1 = this.currentEquippedItem(actor, this._item.etypeId);
		if (enabled) {
			this.drawActorParamChange(x, y, actor, item1);
		}
		this.drawItemName(item1, x, y + this.lineHeight());
		this.changePaintOpacity(true);
	}

	drawActorParamChange(x: number, y: number, _actor: Game_Actor, item1: any) {
		const width = this.contents.width - this.textPadding() - x;
		const paramId = this.paramId();
		const change = this._item.params[paramId] - (item1 ? item1.params[paramId] : 0);
		this.changeTextColor(this.paramchangeTextColor(change));
		this.drawText((change > 0 ? "+" : "") + change, x, y, width, "right");
	}

	paramId() {
		return DataManager.isWeapon(this._item) ? 2 : 3;
	}

	currentEquippedItem(actor: Game_Actor, etypeId: number) {
		const list = [];
		const equips = actor.equips();
		const slots = actor.equipSlots();
		for (let i = 0; i < slots.length; i++) {
			if (slots[i] === etypeId) {
				list.push(equips[i]);
			}
		}
		const paramId = this.paramId();
		let worstParam = Number.MAX_VALUE;
		let worstItem = null;
		for (let j = 0; j < list.length; j++) {
			if (list[j] && list[j].params[paramId] < worstParam) {
				worstParam = list[j].params[paramId];
				worstItem = list[j];
			}
		}
		return worstItem;
	}

	update() {
		super.update();
		this.updatePage();
	}

	updatePage() {
		if (this.isPageChangeEnabled() && this.isPageChangeRequested()) {
			this.changePage();
		}
	}

	isPageChangeEnabled() {
		return this.visible && this.maxPages() >= 2;
	}

	isPageChangeRequested() {
		// if (Input.isTriggered('shift')) {
		// 	return true;
		// }
		// if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
		// 	return true;
		// }
		return false;
	}

	isTouchedInsideFrame() {
		const x = this.canvasToLocalX(TouchInput.x);
		const y = this.canvasToLocalY(TouchInput.y);
		return x >= 0 && y >= 0 && x < this.width && y < this.height;
	}

	changePage() {
		this._pageIndex = (this._pageIndex + 1) % this.maxPages();
		this.refresh();
		SoundManager.playCursor();
	}
}
