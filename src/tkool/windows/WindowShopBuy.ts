import { $gameParty, $dataItems, $dataWeapons, $dataArmors } from "../managers/globals";
import { Window_Selectable } from "./WindowSelectable";
import type { Window_ShopStatus } from "./WindowShopStatus";

export class Window_ShopBuy extends Window_Selectable {
	private _shopGoods: any[];
	private _money: number;
	private _data: any[];
	private _price: number[];
	private _statusWindow: Window_ShopStatus;

	initialize(x: number, y: number, height: number, shopGoods: any[]) {
		const width = this.windowWidth();
		super.initialize(x, y, width, height);
		this._shopGoods = shopGoods;
		this._money = 0;
		this.refresh();
		this.select(0);
	}

	windowWidth() {
		return 456;
	}

	maxItems() {
		return this._data ? this._data.length : 1;
	}

	item() {
		return this._data[this.index()];
	}

	setMoney(money: number) {
		this._money = money;
		this.refresh();
	}

	isCurrentItemEnabled() {
		return this.isEnabled(this._data[this.index()]);
	}

	price(item: any) {
		return this._price[this._data.indexOf(item)] || 0;
	}

	isEnabled(item: any) {
		return item && this.price(item) <= this._money && !$gameParty.hasMaxItems(item);
	}

	refresh() {
		this.makeItemList();
		this.createContents();
		this.drawAllItems();
	}

	makeItemList() {
		this._data = [];
		this._price = [];
		this._shopGoods.forEach(function (goods: any) {
			let item = null;
			switch (goods[0]) {
				case 0:
					item = $dataItems[goods[1]];
					break;
				case 1:
					item = $dataWeapons[goods[1]];
					break;
				case 2:
					item = $dataArmors[goods[1]];
					break;
			}
			if (item) {
				this._data.push(item);
				this._price.push(goods[2] === 0 ? item.price : goods[3]);
			}
		}, this);
	}

	drawItem(index: number) {
		const item = this._data[index];
		const rect = this.itemRect(index);
		const priceWidth = 96;
		rect.width -= this.textPadding();
		this.changePaintOpacity(this.isEnabled(item));
		this.drawItemName(item, rect.x, rect.y, rect.width - priceWidth);
		this.drawText(this.price(item), rect.x + rect.width - priceWidth, rect.y, priceWidth, "right");
		this.changePaintOpacity(true);
	}

	setStatusWindow(statusWindow: Window_ShopStatus) {
		this._statusWindow = statusWindow;
		this.callUpdateHelp();
	}

	updateHelp() {
		this.setHelpWindowItem(this.item());
		if (this._statusWindow) {
			this._statusWindow.setItem(this.item());
		}
	}
}
