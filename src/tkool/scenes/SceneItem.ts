import { Graphics } from "../core/Graphics";
import { $gameParty } from "../managers/globals";
import { SoundManager } from "../managers/SoundManager";
import type { Game_Battler } from "../objects/GameBattler";
import { Window_ItemCategory } from "../windows/WindowItemCategory";
import { Window_ItemList } from "../windows/WindowItemList";
import { Scene_ItemBase } from "./SceneItemBase";

export class Scene_Item extends Scene_ItemBase {
	_categoryWindow: Window_ItemCategory;
	_itemWindow: Window_ItemList;

	constructor() {
		super();
		if (Object.getPrototypeOf(this) === Scene_Item.prototype) {
			this.initialize();
		}
	}

	initialize(): void {
		super.initialize();
	}

	create(): void {
		super.create();
		this.createHelpWindow();
		this.createCategoryWindow();
		this.createItemWindow();
		this.createActorWindow();
	}

	createCategoryWindow(): void {
		this._categoryWindow = new Window_ItemCategory();
		this._categoryWindow.setHelpWindow(this._helpWindow);
		this._categoryWindow.y = this._helpWindow.height;
		this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
		this._categoryWindow.setHandler("cancel", this.popScene.bind(this));
		this.addWindow(this._categoryWindow);
	}

	createItemWindow(): void {
		const wy = this._categoryWindow.y + this._categoryWindow.height;
		const wh = Graphics.boxHeight - wy;
		this._itemWindow = new Window_ItemList(0, wy, Graphics.boxWidth, wh);
		this._itemWindow.setHelpWindow(this._helpWindow);
		this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
		this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
		this.addWindow(this._itemWindow);
		this._categoryWindow.setItemWindow(this._itemWindow);
	}

	user(): Game_Battler {
		const members = $gameParty.movableMembers();
		let bestActor = members[0];
		let bestPha = 0;
		for (let i = 0; i < members.length; i++) {
			if (members[i].pha > bestPha) {
				bestPha = members[i].pha;
				bestActor = members[i];
			}
		}
		return bestActor;
	}

	onCategoryOk(): void {
		this._itemWindow.activate();
		this._itemWindow.selectLast();
	}

	onItemOk(): void {
		$gameParty.setLastItem(this.item());
		this.determineItem();
	}

	onItemCancel(): void {
		this._itemWindow.deselect();
		this._categoryWindow.activate();
	}

	playSeForItem(): void {
		SoundManager.playUseItem();
	}

	useItem(): void {
		Scene_ItemBase.prototype.useItem.call(this);
		this._itemWindow.redrawCurrentItem();
	}
}
