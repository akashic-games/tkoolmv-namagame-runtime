import { JsonEx } from "../core/JsonEx";
import type { Game_Actor } from "../objects/GameActor";
import type { Window_EquipStatus } from "./WindowEquipStatus";
import { Window_ItemList } from "./WindowItemList";

export class Window_EquipItem extends Window_ItemList {
	_actor: Game_Actor;
	_slotId: number;
	_statusWindow: Window_EquipStatus;

	constructor(x: number, y: number, width: number, height: number) {
		super(x, y, width, height);
	}

	initialize(x: number, y: number, width: number, height: number): void {
		super.initialize(x, y, width, height);
		this._actor = null;
		this._slotId = 0;
	}

	setActor(actor: Game_Actor): void {
		if (this._actor !== actor) {
			this._actor = actor;
			this.refresh();
			this.resetScroll();
		}
	}

	setSlotId(slotId: number): void {
		if (this._slotId !== slotId) {
			this._slotId = slotId;
			this.refresh();
			this.resetScroll();
		}
	}

	includes(item: any): boolean {
		if (item === null) {
			return true;
		}
		if (this._slotId < 0 || item.etypeId !== this._actor.equipSlots()[this._slotId]) {
			return false;
		}
		return this._actor.canEquip(item);
	}

	isEnabled(_item: any): boolean {
		return true;
	}

	selectLast(): void {
		//
	}

	setStatusWindow(statusWindow: Window_EquipStatus): void {
		this._statusWindow = statusWindow;
		this.callUpdateHelp();
	}

	updateHelp(): void {
		super.updateHelp();
		if (this._actor && this._statusWindow) {
			const actor = JsonEx.makeDeepCopy<Game_Actor>(this._actor);
			actor.forceChangeEquip(this._slotId, this.item());
			this._statusWindow.setTempActor(actor);
		}
	}

	playOkSound() {
		//
	}
}
