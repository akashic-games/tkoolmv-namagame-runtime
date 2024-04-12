import { Graphics } from "../core/Graphics";
import { DataManager } from "../managers/DataManager";
import { $gameVariables, $gameMessage } from "../managers/globals";
import { Window_ItemList } from "./WindowItemList";
import type { Window_Message } from "./WindowMessage";

export class Window_EventItem extends Window_ItemList {
	private _messageWindow: Window_Message;

	constructor(messageWindow: Window_Message) {
		super(messageWindow);
		// if (Object.getPrototypeOf(this) === Window_EventItem.prototype) {
		// 	this.initialize(param.messageWindow);
		// }
	}

	initialize(...args: any[]) {
		this._messageWindow = args[0];
		const width = Graphics.boxWidth;
		const height = this.windowHeight();
		super.initialize(0, 0, width, height);
		this.openness = 0;
		this.deactivate();
		this.setHandler("ok", this.onOk.bind(this));
		this.setHandler("cancel", this.onCancel.bind(this));
	}

	windowHeight() {
		return this.fittingHeight(this.numVisibleRows());
	}

	numVisibleRows() {
		return 4;
	}

	start() {
		this.refresh();
		this.updatePlacement();
		this.select(0);
		this.open();
		this.activate();
	}

	updatePlacement() {
		if (this._messageWindow.y >= Graphics.boxHeight / 2) {
			this.y = 0;
		} else {
			this.y = Graphics.boxHeight - this.height;
		}
	}

	includes(item: any) {
		const itypeId = $gameMessage.itemChoiceItypeId();
		return DataManager.isItem(item) && item.itypeId === itypeId;
	}

	isEnabled(_item: any) {
		return true;
	}

	onOk() {
		const item = this.item();
		const itemId = item ? item.id : 0;
		$gameVariables.setValue($gameMessage.itemChoiceVariableId(), itemId);
		this._messageWindow.terminateMessage();
		this.close();
	}

	onCancel() {
		$gameVariables.setValue($gameMessage.itemChoiceVariableId(), 0);
		this._messageWindow.terminateMessage();
		this.close();
	}
}
