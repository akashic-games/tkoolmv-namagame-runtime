import { Graphics } from "../core/Graphics";
import { $gameParty, $gameTemp } from "../managers/globals";
import { SceneManager } from "../managers/SceneManager";
import { SoundManager } from "../managers/SoundManager";
import { Game_Action } from "../objects/GameAction";
import type { Game_Actor } from "../objects/GameActor";
import type { Game_Battler } from "../objects/GameBattler";
import type { Window_Base } from "../windows/WindowBase";
import type { Window_ItemList } from "../windows/WindowItemList";
import { Window_MenuActor } from "../windows/WindowMenuActor";
import type { Window_Selectable } from "../windows/WindowSelectable";
import { Scene_Map } from "./SceneMap";
import { Scene_MenuBase } from "./SceneMenuBase";

export class Scene_ItemBase extends Scene_MenuBase {
	_itemWindow: Window_Selectable;
	_actorWindow: Window_MenuActor;

	constructor() {
		super();
		if (Object.getPrototypeOf(this) === Scene_ItemBase.prototype) {
			this.initialize();
		}
	}

	initialize(): void {
		super.initialize();
	}

	create(): void {
		super.create();
	}

	createActorWindow(): void {
		this._actorWindow = new Window_MenuActor();
		this._actorWindow.setHandler("ok", this.onActorOk.bind(this));
		this._actorWindow.setHandler("cancel", this.onActorCancel.bind(this));
		this.addWindow(this._actorWindow);
	}

	item(): any {
		return (this._itemWindow as Window_ItemList).item();
	}

	user(): Game_Battler | null {
		return null;
	}

	isCursorLeft(): boolean {
		return this._itemWindow.index() % 2 === 0;
	}

	showSubWindow(window: Window_Base): void {
		window.x = this.isCursorLeft() ? Graphics.boxWidth - window.width : 0;
		window.show();
		window.activate();
	}

	hideSubWindow(window: Window_Base): void {
		window.hide();
		window.deactivate();
		this.activateItemWindow();
	}

	onActorOk(): void {
		if (this.canUse()) {
			this.useItem();
		} else {
			SoundManager.playBuzzer();
		}
	}

	onActorCancel(): void {
		this.hideSubWindow(this._actorWindow);
	}

	determineItem(): void {
		const action = new Game_Action(this.user());
		const item = this.item();
		action.setItemObject(item);
		if (action.isForFriend()) {
			this.showSubWindow(this._actorWindow);
			this._actorWindow.selectForItem(this.item());
		} else {
			this.useItem();
			this.activateItemWindow();
		}
	}

	useItem(): void {
		this.playSeForItem();
		this.user().useItem(this.item());
		this.applyItem();
		this.checkCommonEvent();
		this.checkGameover();
		this._actorWindow.refresh();
	}

	activateItemWindow(): void {
		this._itemWindow.refresh();
		this._itemWindow.activate();
	}

	itemTargetActors(): Game_Actor[] {
		const action = new Game_Action(this.user());
		action.setItemObject(this.item());
		if (!action.isForFriend()) {
			return [];
		} else if (action.isForAll()) {
			return $gameParty.members();
		} else {
			return [$gameParty.members()[this._actorWindow.index()]];
		}
	}

	canUse(): boolean {
		return this.user()?.canUse(this.item()) && this.isItemEffectsValid();
	}

	isItemEffectsValid(): boolean {
		const action = new Game_Action(this.user());
		action.setItemObject(this.item());
		return this.itemTargetActors().some(target => {
			return action.testApply(target);
		});
	}

	applyItem(): void {
		const action = new Game_Action(this.user());
		action.setItemObject(this.item());
		this.itemTargetActors().forEach(target => {
			for (let i = 0; i < action.numRepeats(); i++) {
				action.apply(target);
			}
		});
		action.applyGlobal();
	}

	checkCommonEvent(): void {
		if ($gameTemp.isCommonEventReserved()) {
			SceneManager.goto(Scene_Map);
		}
	}

	playSeForItem(): void {
		//
	}
}
